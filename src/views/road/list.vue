<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口名称">
            <el-input v-model="form.crossingName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="路口方位">
            <el-input v-model="form.crossingPointName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="所属中队">
            <el-input v-model="form.policeStationName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="listLoading" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btns_box">
      <el-button @click="handleClick('add')">新建</el-button>
      <el-button @click="handleClick('update')">修改</el-button>
      <el-button @click="handleClickDel">删除</el-button>
      <el-button @click="handleClick('href')">路口归置</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-radio
            class="selectRow-radio"
            :label="scope.row.crossingId"
            :value="selectedRowKey"
            @change="handleSelectRow(scope.row.crossingId)"
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
        width="100"
      />
      <el-table-column
        prop="crossingPointName"
        label="路口方位"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.crossingPointData.length > 0">{{ renderCrossingPointName(scope.row.crossingPointData) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="policeStationName"
        label="所属中队"
      />
    </el-table>
    <div class="table_pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="paginationTotal"
        :page-size="10"
        :current-page="currentPage"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from '@/utils/request'

export default {
  data() {
    return {
      listLoading: false,
      currentPage: 1,
      paginationTotal: 0,
      selectedRowKey: null, // 选择的行的id
      tableData: [],
      form: {},
      searchData: {} // 搜索数据
    }
  },
  mounted: function() {
    this.getTableData(1)
  },
  methods: {
    renderCrossingPointName(crossingPointData) {
      const crossingPointName = crossingPointData.map(({ crossingPointName }) => crossingPointName)
      return crossingPointName.join('、')
    },
    handleSelectRow(value) {
      // 单选
      this.selectedRowKey = value
    },
    getTableData(pageNumber) {
      this.listLoading = true
      axios.post('/api/crossings/search', {
        pageNo: pageNumber,
        pageSize: 10,
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
      this.searchData = this.form
      this.getTableData(1)
    },
    handleClick(type) {
      if (type === 'href') {
        if (!this.selectedRowKey) {
          this.$message({
            message: '请先选择一条数据',
            type: 'error'
          })
          return
        }
        const { crossingName, crossingId } = this.tableData.filter((item) => item.crossingId === this.selectedRowKey)[0]
        this.$router.push({
          path: '/police/add',
          query: {
            crossingId,
            crossingName
          }
        })
      } else if (type === 'add') {
        this.$router.push({
          path: '/road/add'
        })
      } else if (type === 'update') {
        if (!this.selectedRowKey) {
          this.$message({
            message: '请先选择一条数据',
            type: 'error'
          })
          return
        }
        // const { crossingId } = this.tableData.filter((item) => item.crossingId === this.selectedRowKey)[0]
        this.$router.push({
          path: '/road/add',
          query: {
            crossingId: this.selectedRowKey
            // crossingName
          }
        })
      }
    },
    handleClickDel() {
      if (!this.selectedRowKey) {
        this.$message({
          message: '请先选择一条数据',
          type: 'error'
        })
        return
      }
      this.$alert('确认删除？', '系统提示', {
        confirmButtonText: '确定',
        callback: (type) => {
          if (type !== 'confirm') return
          axios.delete(`/api/crossings/${this.selectedRowKey}`).then((res) => {
            this.$message.success('操作成功')
            // 刷新列表
            this.currentPage = 1
            this.getTableData(1)
          }).catch((e) => {
            this.$message.error(e.response.data.returnMessage || '操作失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.btns_box {
  margin-bottom: 20px;
}
.table_pagination {
  margin-top: 20px;
}
</style>
<style lang="scss">
.selectRow-radio {
  .el-radio__input {
    margin-left: 7px;
  }
  .el-radio__label {
    display: none;
  }
}
</style>
