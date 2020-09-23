<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口方位">
            <el-input v-model="form.roadposition" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="所属路口">
            <el-input v-model="form.road" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="listLoading" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btns_box">
      <el-button @click="handleClick('start')">启用</el-button>
      <el-button @click="handleClick('stop')">禁用</el-button>
      <el-button @click="handleClick('service')">维修</el-button>
      <el-button @click="handleClick('href')">方位归置</el-button>
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
            :label="scope.row.id"
            :value="selectedRowKey"
            @change="handleSelectRow(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="路口方位"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === 2">启用</div>
          <div v-if="scope.row.status === 1">禁用</div>
          <div v-if="scope.row.status === 3">维修</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="cid"
        label="所属路口"
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
      searchData: {}, // 搜索数据
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 2,
          label: '启用'
        },
        {
          value: 1,
          label: '禁用'
        },
        {
          value: 3,
          label: '维修'
        }
      ]
    }
  },
  mounted: function() {
    this.getTableData(1)
  },
  methods: {
    handleSelectRow(value) {
      // 单选
      this.selectedRowKey = value
    },
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
      this.searchData = this.form
      this.getTableData(1)
    },
    handleClick(type) {
      if (!this.selectedRowKey) {
        this.$message({
          message: '请先选择一条数据',
          type: 'error'
        })
        return
      }
      if (type === 'href') {
        const { name } = this.tableData.filter((item) => item.id === this.selectedRowKey)[0]
        this.$router.push({
          path: '/road/add',
          query: {
            id: this.selectedRowKey,
            name
          }
        })
      } else {
        const statusObj = {
          start: 2,
          stop: 1,
          service: 3
        }
        axios.put('/api/crossingpoints ', {
          id: this.selectedRowKey,
          status: statusObj[type]
        }).then((res) => {
          this.$message.success('操作成功')
          this.selectedRowKey = null
          this.currentPage = 1
          this.getTableData(1)
        }).catch(() => {
          this.$message.error('操作失败')
        })
      }
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
