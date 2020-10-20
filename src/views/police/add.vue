<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="派出所名称">
            <el-input v-model="form.policeStationName" placeholder="请设置派出所名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="所属地区">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.regionName"
                :label="item.regionName"
                :value="item.regionName"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="已选择路口">
          <div v-for="(item, index) of selectedRoadArray" :key="item.crossingName" class="selectedRoad">{{ item.crossingName }}<i class="selectedRoadClear el-icon-circle-close" @click="removeSelectedRoad(index)" /></div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form ref="form" class="roadposition_form" :model="searchform" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口名称">
            <el-input v-model="searchform.crossingName" placeholder="请输入路口名称查找" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="listLoading" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 600px"
      border
    >
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-checkbox
            :key="scope.row.crossingId"
            class="selectRow-checkbox"
            :checked="((multipleSelection[scope.row.crossingId] || {}).value || false)"
            @change="(e) => handleSelectionChange(e, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="crossingName"
        label="路口名称"
      />
      <el-table-column
        prop="crossingPointNum"
        label="路口方位数"
      />
    </el-table>
    <div class="table_pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="paginationTotal"
        :page-size="10"
        @current-change="currentChange"
      />
    </div>
    <div class="savebtn">
      <el-button type="primary" :loading="saveLoading" @click="doSubmit">设置派出所完成</el-button>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    return {
      listLoading: false,
      saveLoading: false,
      tableData: [],
      currentPage: 1,
      paginationTotal: 0,
      multipleSelection: {}, // 选择的行
      selectedRoadArray: [],
      statusOptions: [], // 所属地区数据
      form: {
        policeStationName: '',
        region: '' // 所属地区
      },
      searchform: {},
      searchData: {} // 搜索数据
    }
  },
  mounted: function() {
    const { policeStationId, crossingName, crossingId } = this.$route.query
    this.getTableData(1)
    // 获取所属地区
    axios.get('/api/regions').then((res) => {
      this.statusOptions = res.data
    }).catch(() => {
      this.$message.error('获取所属地区失败')
    })
    // 修改页面, 回填之前的数据
    if (policeStationId) {
      // 修改
      axios.get(`/api/policestations/${policeStationId}`).then((res) => {
        const { policeStationName, policeStationId, crossingData, region } = res.data
        this.policeStationId = policeStationId
        this.form.policeStationName = policeStationName
        this.form.region = region
        if (crossingData && crossingData.length > 0) {
          this.selectedRoadArray = crossingData
          crossingData.forEach((item) => {
            this.multipleSelection[item.crossingId] = {
              value: true,
              crossingId: item.crossingId,
              crossingName: item.crossingName
            }
          })
        }
      }).catch((e) => {
        this.$message.error(e.response.data.returnMessage || '获取数据异常')
      })
    } else if (crossingName) {
      // 从路口列表跳转过来的
      this.selectedRoadArray = [{
        crossingId,
        crossingName
      }]
      this.multipleSelection[crossingId] = {
        value: true,
        crossingId,
        crossingName
      }
    }
  },
  methods: {
    getTableData(pageNumber) {
      this.listLoading = true
      axios.post('/api/crossings/search', {
        pageNo: pageNumber,
        pageSize: 10,
        type: 2,
        policeStationName: '无',
        ...this.searchData
      }).then((res) => {
        this.listLoading = false
        this.tableData = res.data.data
        this.paginationTotal = res.data.totalCount
      }).catch((e) => {
        this.listLoading = false
        this.$message.error(e.response.data.returnMessage || '获取数据异常')
      })
    },
    currentChange(pageNumber) {
      this.getTableData(pageNumber)
    },
    onSearch() {
      this.searchData = this.searchform
      this.getTableData(1)
    },
    handleSelectionChange(val, row) {
      if (!this.multipleSelection[row.crossingId]) {
        this.multipleSelection[row.crossingId] = {}
      }
      // console.log(val)
      Object.assign(this.multipleSelection[row.crossingId], {
        value: val,
        ...row
      })
      // 先清空
      this.selectedRoadArray = []
      for (const key in this.multipleSelection) {
        const { crossingId, crossingName, value } = this.multipleSelection[key] || {}
        if (value) {
          this.selectedRoadArray.push({
            crossingId,
            crossingName
          })
        }
      }
    },
    removeSelectedRoad(index) {
      const { crossingId } = this.selectedRoadArray[index]
      this.selectedRoadArray.splice(index, 1)
      this.multipleSelection[crossingId].value = false
      const tableData = this.tableData
      this.tableData = []
      setTimeout(() => {
        this.tableData = tableData
      })
    },
    doSubmit() {
      const { policeStationName, region } = this.form
      if (!policeStationName) {
        this.$message.error('请先输入派出所名称')
        return
      }
      if (!region) {
        this.$message.error('请先选择所属地区')
        return
      }
      if (this.selectedRoadArray.length <= 0) {
        this.$message.error('请先选择路口')
        return
      }
      // 已选择的路口id集合
      const crossingId = this.selectedRoadArray.map(({ crossingId }) => crossingId)
      this.saveLoading = true
      if (this.policeStationId) {
        // 修改
        axios.put('/api/policestations', {
          policeStationId: this.policeStationId,
          region,
          crossingId
        }).then((res) => {
          this.saveLoading = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              location.reload()
            }
          })
        }).catch((e) => {
          this.saveLoading = false
          this.$message.error(e.response.data.returnMessage || '操作失败')
        })
      } else {
        // 新增
        axios.post('/api/policestation', {
          policeStationName,
          region,
          crossingId
        }).then((res) => {
          this.saveLoading = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              location.reload()
            }
          })
        }).catch((e) => {
          this.saveLoading = false
          this.$message.error(e.response.data.returnMessage || '操作失败')
        })
      }
    }
  }
}
</script>

<style scoped>
.selectedRoad {
  position: relative;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding-right: 20px;
  font-size: 14px;
  color: #606266;
  margin-right: 20px;
}
.selectedRoadClear {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 20px;
  cursor: pointer;
}
.btns_box {
  margin-bottom: 20px;
}
.table_pagination {
  margin-top: 20px;
}
.savebtn {
  margin-top: 20px;
}
</style>
