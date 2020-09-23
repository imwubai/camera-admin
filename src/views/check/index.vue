<template>
  <div class="app-container">
    <div class="ruleType-buttons">
      <block v-for="[key, value] in ruleTypeMap.entries" :key="key">
        <el-button
          :type="form.ruleType === key ? 'primary' : ''"
          @click="selectRuleType(key)"
        >{{ value }}</el-button>
      </block>
    </div>
    <el-form ref="form" class="roadposition_form" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="违法地点：">
            <el-input v-model="form.rulePlace" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="采集时间：">
            <el-date-picker
              v-model="form.ruleAt"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="相似度：">
            <el-input v-model="form.similarity" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="审核状态：">
            <el-select v-model="form.verifyedStatus" placeholder="请选择">
              <el-option
                v-for="item in verifyedStatusOptions.searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当事人处理结果：" label-width="130px">
            <el-select v-model="form.handledStatus" placeholder="请选择">
              <el-option
                v-for="item in handledStatusOptions.searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="有无车牌：">
            <el-checkbox v-model="form.licensePlateStatus" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="searchLoading" @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btns_box">
      <el-button type="primary" :loading="auditLoading" @click="handleShowDialog(true)">审核</el-button>
      <el-button type="primary" :loading="detailLoading" @click="handleShowDialog(false)">查看</el-button>
    </el-row>
    <el-table v-loading="tableLoading" row-key="id" :data="dataSource" style="width: 100%" border>
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
      <el-table-column type="index" label="序号" width="150" />
      <el-table-column prop="createdAt" label="采集时间" width="150" />
      <el-table-column prop="rulePlace" label="违法地点" width="150" />
      <el-table-column prop="ruleType" label="违法类型" width="150">
        <template slot-scope="scope">{{ ruleTypeMap.get(scope.row.ruleType) }}</template>
      </el-table-column>
      <el-table-column prop="similarity" label="相似度" width="150" />
      <el-table-column prop="verifyedStatus" label="审核状态" width="150">
        <template
          slot-scope="scope"
        >{{ scope.row.verifyedStatus ? verifyedStatusMap.get(scope.row.verifyedStatus) : '' }}</template>
      </el-table-column>
      <el-table-column label="当事人处理结果" width="150">
        <template
          slot-scope="scope"
        >{{ scope.row.handledStatus ? handledStatusMap.get(scope.row.handledStatus) : '' }}</template>
      </el-table-column>
      <el-table-column prop="verifyedAt" label="审核时间" width="150" />
      <el-table-column prop="verifyedName" label="审核人" width="150" />
    </el-table>
    <div class="table_pagination">
      <el-pagination
        :current-page="pageNo"
        layout="prev, pager, next"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="table-footer">
      <div class="table-footer-block">
        <i class="el-icon-view" />今日采集量：
        <span>{{ count1 }}</span>
      </div>
      <div class="table-footer-block">
        <i class="el-icon-document-copy" />审核量：
        <span>{{ count2 }}</span>
      </div>
      <div class="table-footer-block">
        <i class="el-icon-delete" />作废量：
        <span>{{ count3 }}</span>
      </div>
    </div>
    <el-dialog
      class="audit-dialog"
      :title="isAudit ? '审核' : '查看'"
      :visible.sync="dialogVisible"
      width="1200px"
      :destroy-on-close="true"
    >
      <div class="audit-dialog-content">
        <div class="audit-dialog-content-left">
          <div class="evidence-block">
            <div class="evidence-block-imgDiv">
              <img :src="`${imgOrigin}/${info.evidenceBigPhoto}`" alt>
            </div>
            <div class="evidence-block-imgDiv">
              <img
                v-if="info.evidenceSmallPhoto"
                :src="`${imgOrigin}/${info.evidenceSmallPhoto}`"
                alt
              >
              <div v-else>暂无图片</div>
            </div>
          </div>
          <div class="license-block">
            <div class="license-block-imgDiv">
              <div class="title">当事人</div>
              <img :src="`${imgOrigin}/${info.facePhoto}`" alt>
            </div>
            <div class="license-block-imgDiv">
              <div class="title">推荐/车主</div>
              <img
                :src="`${imgOrigin}/${isAudit ? selectedHaikang.licensePhoto : info.licensePhoto}`"
                alt
              >
            </div>
            <div class="license-block-tipDiv">
              <div>身份证号：{{ idCard(isAudit ? selectedHaikang.license : info.license) }}</div>
              <div>相似度：{{ isAudit ? selectedHaikang.similarity : info.similarity }}</div>
            </div>
          </div>
        </div>
        <div class="audit-dialog-content-right">
          <div v-show="info.haikang && info.haikang.length > 0" class="similarity-block">
            <div
              v-for="(item, index) in info.haikang"
              :key="item.id"
              :class="{'similarity-block-imgDiv': true, 'similarity-block-imgDiv-selected': item.id === selectedHaikangKey}"
              @click="handleSelectFaceImg(item.id)"
            >
              <img :src="`${imgOrigin}/${item.licensePhoto}`" alt>
              <div class="name">
                {{ item.ruleName }}
                <span>{{ item.similarity }}</span>
              </div>
              <div class="idCard">{{ idCard(item.license) }}</div>
              <div class="index">{{ index + 1 }}</div>
              <div class="tick" />
            </div>
          </div>
          <div class="auditDialog-form">
            <el-form ref="form2" :model="auditForm" label-width="90px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="违法类型：">
                    <el-select v-if="isAudit" v-model="auditForm.ruleType" placeholder="请选择">
                      <el-option
                        v-for="item in ruleTypeOptions.operateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <div v-else>{{ ruleTypeMap.get(info.ruleType) }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出行方式：">
                    <el-select v-if="isAudit" v-model="auditForm.travelMode" placeholder="请选择">
                      <el-option
                        v-for="item in travelModeOptions.operateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <div v-else>{{ travelModeMap.get(info.travelMode) }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采集时间：">{{ info.ruleAt }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="审核时间：">{{ info.verifyedAt }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">{{ isAudit ? selectedHaikang.ruleName : info.ruleName }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车牌号：">
                    <el-input v-if="isAudit" v-model="auditForm.licensePlate" placeholder="请输入" />
                    <div v-else>{{ info.licensePlate }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="手机号："
                  >{{ isAudit ? selectedHaikang.telephone : info.telephone }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="短信模板：">
                    <el-input
                      v-if="isAudit"
                      v-model="auditForm.message"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入"
                    />
                    <div v-else style="line-height: 24px">{{ info.message }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="isAudit" slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="confirmLoading" @click="handleAuditOrInvaild(true)">审核</el-button>
        <el-button :loading="confirmLoading" @click="handleAuditOrInvaild(false)">作废</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '@/utils/request'
import { apiDomain } from '@/utils/config'

export default {
  data() {
    return {
      imgOrigin: apiDomain,
      defaultMessage:
        '【姓名】，您于【违法时间】在【违法地点】驾驶【车牌号】非机动车，被电子警察记录了“【违法类型】”的违法行为，请及时接受处理。处理途径：1.xxxx；2.xxx;3xxx;咨询电话：xxxxx。',
      ruleTypeMap: new Map([
        [0, '全部'],
        [1, '闯红灯'],
        [2, '越线'],
        [6, '逆行'],
        [3, '一车多人'],
        [5, '无头盔'],
        [4, '安装伞具']
      ]),
      verifyedStatusMap: new Map([
        [0, '全部'],
        [1, '未审核'],
        [2, '已审核'],
        [3, '已作废']
      ]),
      handledStatusMap: new Map([
        [0, '全部'],
        [1, '未处理'],
        [2, '已处理'],
        [3, '无需处理']
      ]),
      travelModeMap: new Map([
        [undefined, '全部'],
        [1, '电动自行车'],
        [2, '三轮车'],
        [3, '手推车'],
        [4, '残疾人专用车'],
        [5, '畜力车'],
        [6, '助力自行车'],
        [7, '其他非机动车']
      ]),
      searchLoading: false,
      tableLoading: false,
      auditLoading: false,
      detailLoading: false,
      confirmLoading: false,
      pageNo: 1,
      pageSize: 10,
      total: 4,
      dataSource: [],
      count1: 0,
      count2: 0,
      count3: 0,
      form: {
        ruleType: '',
        verifyedStatus: 1,
        handledStatus: 0,
        licensePlateStatus: false
      },
      auditForm: {
        travelMode: 1
      },
      selectedRowKey: 0,
      isAudit: false,
      dialogVisible: false,
      info: {},
      selectedHaikangKey: 0
    }
  },
  computed: {
    ruleTypeOptions() {
      const searchOptions = []
      const operateOptions = []
      this.ruleTypeMap.forEach((key, value) => {
        const o = {
          label: key,
          value
        }
        if (value) {
          operateOptions.push(o)
        }
        searchOptions.push(o)
      })
      return {
        searchOptions,
        operateOptions
      }
    },
    verifyedStatusOptions() {
      const searchOptions = []
      const operateOptions = []
      this.verifyedStatusMap.forEach((key, value) => {
        const o = {
          label: key,
          value
        }
        if (value) {
          operateOptions.push(o)
        }
        searchOptions.push(o)
      })
      return {
        searchOptions,
        operateOptions
      }
    },
    handledStatusOptions() {
      const searchOptions = []
      const operateOptions = []
      this.handledStatusMap.forEach((key, value) => {
        const o = {
          label: key,
          value
        }
        if (value) {
          operateOptions.push(o)
        }
        searchOptions.push(o)
      })
      return {
        searchOptions,
        operateOptions
      }
    },
    travelModeOptions() {
      const searchOptions = []
      const operateOptions = []
      this.travelModeMap.forEach((key, value) => {
        const o = {
          label: key,
          value
        }
        if (value) {
          operateOptions.push(o)
        }
        searchOptions.push(o)
      })
      return {
        searchOptions,
        operateOptions
      }
    },
    searchParams() {
      const result = {}
      Object.keys(this.form).forEach((key) => {
        if (
          this.form[key] ||
          this.form[key] === 0 ||
          this.form[key] === false
        ) {
          if (key === 'ruleAt' && this.form[key] && this.form[key].length > 0) {
            const [begin, end] = this.form[key]
            result.ruleBeginAt = moment(begin).format('YYYY-MM-DD HH:mm:ss')
            result.ruleEndAt = moment(end).format('YYYY-MM-DD HH:mm:ss')
          } else if (key === 'similarity') {
            result[key] = Number(this.form[key])
          } else if (key === 'licensePlateStatus') {
            result[key] = this.form[key] ? 2 : 0
          } else {
            result[key] = this.form[key]
          }
        }
      })
      return result
    },
    selectedRowData() {
      let result = {}
      this.dataSource.forEach((item) => {
        if (item === this.selectedRowKey) {
          result = item
        }
      })
      return result
    },
    selectedHaikang() {
      let result = {};
      (this.info.haikang || []).forEach((item) => {
        if (item.id === this.selectedHaikangKey) {
          result = item
        }
      })
      return result
    }
  },
  watch: {
    dialogVisible(value) {
      if (!value) {
        this.auditForm = {
          travelMode: 1,
          message: this.defaultMessage
        }
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    idCard(text) {
      return text ? `******${String(text).substr(6, 8)}****` : ''
    },
    getTableData(params) {
      this.tableLoading = true
      axios
        .post('/api/rules/search', {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          ...this.searchParams,
          ...params
        })
        .then((res) => {
          const { data, pageNo, pageSize, totalCount } = res.data
          this.pageNo = pageNo
          this.pageSize = pageSize
          this.total = totalCount
          this.dataSource = data
          this.tableLoading = false
        })
        .catch(() => {
          this.$message.error('操作失败')
          this.tableLoading = false
        })
    },
    selectRuleType(value) {
      // 查询条件
      this.form.ruleType = value
    },
    async handleSearch() {
      // 查询
      this.searchLoading = true
      await this.getTableData()
      this.searchLoading = false
    },
    handleSelectRow(value) {
      // 单选
      this.selectedRowKey = value
    },
    handleCurrentChange(value) {
      // 改变页码
      this.pageNo = value
      this.getTableData()
    },
    handleShowDialog(isAudit) {
      // 弹窗展示
      if (!this.selectedRowKey) {
        this.$message.error('请先选择要操作的数据')
        return
      }
      // if (isAudit) {
      //   if (
      //     this.verifyedStatusMap.get(this.selectedRowData.ruletype) !== '未审核'
      //   ) {
      //     this.$message.error('请选择未审核的记录')
      //     return
      //   }
      // } else {
      //   if (
      //     !['已审核', '已作废'].includes(
      //       this.verifyedStatusMap.get(this.selectedRowData.ruletype)
      //     )
      //   ) {
      //     this.$message.error('请选择已审核或已作废的记录')
      //     return
      //   }
      // }
      if (isAudit) {
        this.auditLoading = true
      } else {
        this.detailLoading = true
      }
      this.isAudit = isAudit
      axios
        .get(`/api/rules/${this.selectedRowKey}`)
        .then((res) => {
          const { data } = res
          if (isAudit) {
            axios
              .get('/api/faces')
              .then((res2) => {
                const { data: data2 } = res2
                this.info = {
                  ...data,
                  haikang: (data2 || []).map((item, index) => ({
                    ...item,
                    id: index + 1
                  }))
                }
                this.selectedHaikangKey =
                  data2 && data2.length > 0 ? data2[0].id : 0
                this.auditForm = {
                  ruleType: data.ruleType,
                  travelMode: data.travelMode || 1,
                  licensePlate: data.licensePlate,
                  message: data.message || this.defaultMessage
                }
                this.dialogVisible = true
                if (isAudit) {
                  this.auditLoading = false
                } else {
                  this.detailLoading = false
                }
              })
              .catch(() => {
                true
                if (isAudit) {
                  this.auditLoading = false
                } else {
                  this.detailLoading = false
                }
              })
          } else {
            this.info = data
            this.auditForm = {
              ruleType: data.ruleType,
              travelMode: data.travelMode || 1,
              licensePlate: data.licensePlate,
              message: data.message || this.defaultMessage
            }
            this.dialogVisible = true
            if (isAudit) {
              this.auditLoading = false
            } else {
              this.detailLoading = false
            }
          }
        })
        .catch(() => {
          if (isAudit) {
            this.auditLoading = false
          } else {
            this.detailLoading = false
          }
        })
    },
    handleSelectFaceImg(value) {
      // 选择相似信息
      this.selectedHaikangKey = value
    },
    handleAuditOrInvaild(isAudit) {
      // 弹窗-审核/作废
      if (!this.auditForm.licensePlate) {
        this.$message.error('车牌号不能为空')
        return
      }
      if (!this.auditForm.message) {
        this.$message.error('短信模板不能为空')
        return
      }
      const params = {
        id: this.selectedRowKey,
        verifyedStatus: isAudit ? 2 : 3,
        verifyedName: localStorage.getItem('username'),
        ...this.auditForm,
        ...this.selectedHaikang,
        handledStatus: this.info.handledStatus,
        licensePlateStatus: this.info.licensePlateStatus,
        verifyedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      if (isAudit) {
        params.verifyedStatus = 2
      } else {
        params.verifyedStatus = 3
      }
      this.confirmLoading = true
      axios
        .put('/api/policestations', params)
        .then(() => {
          this.dialogVisible = false
          this.getTableData({
            pageNo: 1
          })
          this.confirmLoading = false
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    handleCancel() {
      // 弹窗-取消
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.ruleType-buttons {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 20px 20px;
}
.btns_box {
  margin-bottom: 20px;
}
.selectRow-radio {
  .el-radio__input {
    margin-left: 7px;
  }
  .el-radio__label {
    display: none;
  }
}
.table_pagination {
  margin-top: 20px;
}
.table-footer {
  display: flex;
  margin-top: 20px;
  &-block {
    flex: 1;
    i {
      margin-right: 4px;
    }
    span {
      color: red;
    }
  }
}
.audit-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .audit-dialog-content {
    display: flex;
    &-left {
      flex: 0 0 580px;
      .evidence-block {
        display: flex;
        &-imgDiv {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 290px;
          height: 198px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .license-block {
        display: flex;
        &-imgDiv {
          flex: 0 0 150px;
          height: 226px;
          .title {
            padding-top: 10px;
            color: #f00;
            text-align: center;
          }
          img {
            display: block;
            width: 100%;
            height: 200px;
          }
        }
        &-tipDiv {
          padding: 25px 0 0 5px;
          div:first-child {
            margin-bottom: 10px;
          }
        }
      }
    }
    &-right {
      flex: 0 0 578px;
      .similarity-block {
        display: flex;
        flex-wrap: wrap;
        border: 2px solid #ccc;
        border-right: none;
        border-top: none;
        &-imgDiv {
          position: relative;
          flex: 0 0 192px;
          height: 196px;
          text-align: center;
          cursor: pointer;
          border-right: 2px solid #ccc;
          border-top: 2px solid #ccc;
          img {
            display: block;
            width: 120px;
            height: 160px;
            margin: 0 35px;
          }
          div {
            span {
              color: #f60;
            }
          }
          .name {
            font-weight: bold;
          }
          .idCard {
            border-top: 1px solid #ccc;
          }
          .index {
            color: #fff;
            position: absolute;
            top: 0px;
            left: 5px;
            z-index: 1;
            font-size: 16px;
          }
          .tick {
            position: absolute;
            top: -2px;
            left: -2px;
            border: 16px solid #ccc;
            border-bottom-color: transparent;
            border-right-color: transparent;
          }
        }
        .similarity-block-imgDiv-selected {
          .tick {
            border-color: #409eff;
            border-bottom-color: transparent;
            border-right-color: transparent;
          }
        }
      }
    }
    .auditDialog-form {
      padding-top: 10px;
      .el-row {
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
      }
      .el-row:last-child {
        border: none;
      }
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>
