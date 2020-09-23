<template>
  <div class="app-container">
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="所属派出所">
            <el-input v-model="form.pid" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号">
            <el-input v-model="form.telephone" placeholder="请输入" />
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
      <el-button @click="handleClickAdd">新建</el-button>
      <el-button @click="handleClickUpdate">修改</el-button>
      <el-button @click="handleClickStart">启动</el-button>
      <el-button @click="handleClickStop">禁用</el-button>
      <el-button @click="handleClickDel">删除</el-button>
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
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="所属派出所"
        label="psid"
      />
      <el-table-column
        prop="telephone"
        label="手机号"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '禁用' : '启用' }}
        </template>
      </el-table-column>
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
        }
      ],
      tableData: [],
      form: {},
      searchData: {} // 搜索数据
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
      axios.post('/api/users/search', {
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
    handleClickAdd() {
      this.$router.push({
        path: '/user/add'
      })
    },
    handleClickUpdate() {
      if (!this.selectedRowKey) {
        this.$message({
          message: '请先选择一条数据',
          type: 'error'
        })
        return
      }
      const { username } = this.tableData.filter((item) => item.id === this.selectedRowKey)[0]
      this.$router.push({
        path: '/user/add',
        query: {
          id: this.selectedRowKey,
          username: username
        }
      })
    },
    handleClickStart() {
      if (!this.selectedRowKey) {
        this.$message({
          message: '请先选择一条数据',
          type: 'error'
        })
        return
      }
      axios.put('/api/users', {
        id: this.selectedRowKey,
        status: 2
      }).then((res) => {
        this.$message.success('操作成功')
        this.currentPage = 1
        this.getTableData(1)
      }).catch(() => {
        this.$message.error('操作失败')
      })
    },
    handleClickStop() {
      if (!this.selectedRowKey) {
        this.$message({
          message: '请先选择一条数据',
          type: 'error'
        })
        return
      }
      axios.put('/api/users', {
        id: this.selectedRowKey,
        status: 1
      }).then((res) => {
        this.$message.success('操作成功')
        this.currentPage = 1
        this.getTableData(1)
      }).catch(() => {
        this.$message.error('操作失败')
      })
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
          axios.delete(`/api/users/${this.selectedRowKey}`).then((res) => {
            this.$message.success('操作成功')
            // 刷新列表
            this.currentPage = 1
            this.getTableData(1)
          }).catch(() => {
            this.$message.error('操作失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
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

