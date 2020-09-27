<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口名称">
            <el-input v-model="form.crossingName" placeholder="请设置路口名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="已选择路口方位">
          <div v-for="(item, index) of selectedRoadArray" :key="item.crossingPointName" class="selectedRoad">{{ item.crossingPointName }}<i class="selectedRoadClear el-icon-circle-close" @click="removeSelectedRoad(index)" /></div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form ref="form" class="roadposition_form" :model="searchform" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口方位">
            <el-input v-model="searchform.crossingPointName" placeholder="请输入路口方位查找" />
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
            :key="scope.row.crossingPointId"
            class="selectRow-checkbox"
            :checked="((multipleSelection[scope.row.crossingPointId] || {}).value || false)"
            @change="(e) => handleSelectionChange(e, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="crossingPointName"
        label="路口方位"
      />
      <el-table-column
        prop="crossingPointStatus"
        label="状态"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.crossingPointStatus === 2">启用</div>
          <div v-if="scope.row.crossingPointStatus === 1">禁用</div>
          <div v-if="scope.row.crossingPointStatus === 3">维修</div>
        </template>
      </el-table-column>
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
      <el-button type="primary" :loading="saveLoading" @click="doSubmit">设置路口完成</el-button>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    return {
      crossingId: null, // 修改时候有id
      listLoading: false,
      currentPage: 1,
      paginationTotal: 0,
      tableData: [],
      saveLoading: false,
      multipleSelection: {}, // 选择的行
      selectedRoadArray: [],
      form: {
        crossingName: ''
      },
      searchform: {},
      searchData: {} // 搜索数据
    }
  },
  mounted: function() {
    const { crossingId, crossingPointName, crossingPointId } = this.$route.query
    this.getTableData(1)
    // 修改页面, 回填之前的数据
    if (crossingId) {
      // 修改
      axios.get(`/api/crossings/${crossingId}`).then((res) => {
        const { crossingName, crossingId, crossingPointData } = res.data
        this.crossingId = crossingId
        this.form.crossingName = crossingName
        if (crossingPointData && crossingPointData.length > 0) {
          this.selectedRoadArray = crossingPointData
          crossingPointData.forEach((item) => {
            this.multipleSelection[item.crossingPointId] = {
              value: true,
              crossingPointId: item.crossingPointId,
              crossingPointName: item.crossingPointName
            }
          })
        }
      }).catch((e) => {
        // this.listLoading = false
        this.$message.error(e.response.data.returnMessage || '获取数据异常')
      })
    } else if (crossingPointName) {
      // 从路口方位跳转过来的
      this.selectedRoadArray = [{
        crossingPointId,
        crossingPointName
      }]
      this.multipleSelection[crossingPointId] = {
        value: true,
        crossingPointId,
        crossingPointName
      }
    }
  },
  methods: {
    getTableData(pageNumber) {
      this.listLoading = true
      axios.post('/api/crossingpoints/search', {
        pageNo: pageNumber,
        pageSize: 10,
        type: 2,
        ...this.searchData
      }).then((res) => {
        this.listLoading = false
        this.tableData = res.data.data
        this.paginationTotal = res.data.totalCount
      }).catch((a) => {
        this.listLoading = false
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
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
      // console.log({...row})
      if (!this.multipleSelection[row.crossingPointId]) {
        this.multipleSelection[row.crossingPointId] = {}
      }
      // console.log(val)
      Object.assign(this.multipleSelection[row.crossingPointId], {
        value: val,
        ...row
      })
      // 先清空
      this.selectedRoadArray = []
      for (const key in this.multipleSelection) {
        const { crossingPointId, crossingPointName, value } = this.multipleSelection[key] || {}
        if (value) {
          this.selectedRoadArray.push({
            crossingPointId,
            crossingPointName
          })
        }
      }
    },
    removeSelectedRoad(index) {
      const { crossingPointId } = this.selectedRoadArray[index]
      this.selectedRoadArray.splice(index, 1)
      this.multipleSelection[crossingPointId].value = false
      const tableData = this.tableData
      this.tableData = []
      setTimeout(() => {
        this.tableData = tableData
      })
    },
    doSubmit() {
      const { crossingName } = this.form
      if (!crossingName) {
        this.$message.error('请先输入路口名称')
        return
      }
      if (this.selectedRoadArray.length <= 0) {
        this.$message.error('请先选择路口方位')
        return
      }
      const crossingPointId = this.selectedRoadArray.map(({ crossingPointId }) => crossingPointId)
      let reqObj = {}
      if (this.crossingId) {
        // 修改
        reqObj = {
          crossingId: this.crossingId,
          crossingPointId
        }
      } else {
        // 新增
        reqObj = {
          crossingName,
          crossingPointId
        }
      }
      this.saveLoading = true
      axios.post('/api/crossing', reqObj).then((res) => {
        this.saveLoading = false
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            location.reload()
          }
        })
        console.log(res)
      }).catch((e) => {
        this.saveLoading = false
        this.$message.error(e.response.data.returnMessage || '操作失败')
      })
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
<style lang="scss">
.selectRow-checkbox {
  .el-checkbox__input {
    margin-left: 7px;
  }
  .el-checkbox__label {
    display: none;
  }
}
</style>
