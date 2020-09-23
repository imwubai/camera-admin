<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="派出所名称">
            <el-input v-model="form.name" placeholder="请设置派出所名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="所属地区">
            <el-input v-model="form.name1" placeholder="请选择" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="已选择路口">
          <div v-for="(item, index) of selectedRoadArray" :key="item.name" class="selectedRoad">{{ item.name }}<i class="selectedRoadClear el-icon-circle-close" @click="removeSelectedRoad(index)" /></div>
        </el-form-item>
      </el-row>
    </el-form>
    <el-form ref="form" class="roadposition_form" :model="searchform" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="路口名称">
            <el-input v-model="searchform.name" placeholder="请输入路口名称查找" />
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="name"
        label="路口名称"
      />
      <el-table-column
        prop="num"
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
console.log(axios)

export default {
  data() {
    return {
      listLoading: false,
      saveLoading: false,
      multipleSelection: [], // 选择的行
      tableData: [],
      currentPage: 1,
      paginationTotal: 0,
      selectedRoadArray: [
        {
          id: 1,
          name: '上海市'
        },
        {
          id: 2,
          name: '北京'
        }
      ],
      form: {},
      searchform: {},
      searchData: {} // 搜索数据
    }
  },
  mounted: function() {
    this.getTableData(1)
  },
  methods: {
    getTableData(pageNumber) {
      this.listLoading = true
      axios.post('/api/crossings/search', {
        pageNo: pageNumber,
        pageSize: 10,
        type: 2,
        ...this.searchData
      }).then((res) => {
        this.listLoading = false
        this.tableData = res.data.data
        this.paginationTotal = res.data.totalCount
      }).catch(() => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    removeSelectedRoad(index) {
      console.log(index)
    },
    doSubmit() {
      this.saveLoading = true
      setTimeout(() => {
        this.saveLoading = false
      }, 500)
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
