<template>
  <div class="app-container">
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
    <!-- <div class="ruleType-buttons">
      <block v-for="[key, value] in ruleTypeMap.entries()" :key="key">
        <el-button
          :type="form.ruleType === key ? 'primary' : ''"
          @click="selectRuleType(key)"
        >{{ value }}</el-button>
      </block>
    </div> -->
    <el-form
      ref="form"
      class="roadposition_form"
      :model="form"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="违法地点">
            <el-input v-model="form.rulePlace" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="违法类型">
            <el-select v-model="form.ruleType" placeholder="请选择">
              <el-option
                v-for="[key, value] in ruleTypeMap.entries()"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="采集时间">
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
          <el-form-item label="相似度">
            <el-input v-model="form.similarity" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="审核状态">
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
          <el-form-item label="当事人处理结果">
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
          <el-form-item label-width="0">
            <el-checkbox v-model="form.licensePlateStatus" label="有无车牌" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="handleSearch"
          >查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="tableLoading"
      row-key="id"
      :data="dataSource"
      style="width: 100%"
      border
    >
      <el-table-column label="操作" width="92">
        <template slot-scope="scope">
          <el-button
            v-if="verifyedStatusMap.get(scope.row.verifyedStatus) === '未审核'"
            type="primary"
            @click="handleShowDialog(true, scope.row.id, scope.row.ruleType)"
          >审核</el-button>
          <el-button
            v-if="
              ['已审核', '已作废'].includes(
                verifyedStatusMap.get(scope.row.verifyedStatus)
              )
            "
            type="primary"
            @click="handleShowDialog(false, scope.row.id, scope.row.ruleType)"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="ruleAt" label="采集时间" />
      <el-table-column prop="rulePlace" label="违法地点" />
      <el-table-column prop="ruleType" label="违法类型">
        <template slot-scope="scope">{{
          ruleTypeMap.get(scope.row.ruleType)
        }}</template>
      </el-table-column>
      <el-table-column prop="similarity" label="相似度" />
      <el-table-column prop="verifyedStatus" label="审核状态">
        <template slot-scope="scope">{{
          scope.row.verifyedStatus
            ? verifyedStatusMap.get(scope.row.verifyedStatus)
            : ""
        }}</template>
      </el-table-column>
      <el-table-column label="当事人处理结果">
        <template slot-scope="scope">{{
          scope.row.handledStatus
            ? handledStatusMap.get(scope.row.handledStatus)
            : ""
        }}</template>
      </el-table-column>
      <el-table-column prop="verifyedAt" label="审核时间" />
      <el-table-column prop="verifyedName" label="审核人" />
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
              <img :src="`${imgOrigin}/${info.evidenceBigPhoto1}`" alt>
            </div>
            <div v-if="ruleType < 3" class="evidence-block-imgDiv">
              <img :src="`${imgOrigin}/${info.evidenceBigPhoto2}`" alt>
            </div>
          </div>
          <div class="license-block">
            <div class="license-block-imgDiv">
              <div class="title">当事人</div>
              <img :src="`${imgOrigin}/${info.evidencePhoto}`" alt>
            </div>
            <div class="license-block-imgDiv">
              <div class="title">推荐/车主</div>
              <img
                :src="`${imgOrigin}/${
                  isAudit && ruleType >= 3
                    ? selectedHaikang.facePhoto
                    : info.facePhoto
                }`"
                alt
              >
            </div>
            <div class="license-block-tipDiv">
              <div>
                身份证号：{{
                  idCard(
                    isAudit && ruleType >= 3
                      ? selectedHaikang.license
                      : info.license
                  )
                }}
              </div>
              <div>
                相似度：{{
                  isAudit && ruleType >= 3
                    ? selectedHaikang.similarity
                    : info.similarity
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="audit-dialog-content-right">
          <div v-if="ruleType < 3" class="evidence-block">
            <div class="evidence-block-imgDiv">
              <img :src="`${imgOrigin}/${info.evidenceSmallPhoto}`" alt>
            </div>
            <div class="evidence-block-imgDiv">
              <video
                :src="`${imgOrigin}/${info.evidenceVedio}`"
                controls="controls"
              >
                您的浏览器不支持。
              </video>
            </div>
          </div>
          <div
            v-show="info.haikang && info.haikang.length > 0 && ruleType >= 3"
            class="similarity-block"
          >
            <div
              v-for="(item, index) in info.haikang"
              :key="item.id"
              :class="{
                'similarity-block-imgDiv': true,
                'similarity-block-imgDiv-selected':
                  item.id === selectedHaikangKey,
              }"
              @click="handleSelectFaceImg(item.id)"
            >
              <img :src="`${item.facePhoto}`" alt>
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
                    <el-select
                      v-if="isAudit"
                      v-model="auditForm.ruleType"
                      placeholder="请选择"
                      @change="auditRuleTypeChange"
                    >
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
                    <el-select
                      v-if="isAudit"
                      v-model="auditForm.travelMode"
                      placeholder="请选择"
                      @change="auditTravelModeChange"
                    >
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
                  <el-form-item label="采集时间：">{{
                    info.ruleAt
                  }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="审核时间：">{{
                    info.verifyedAt
                  }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">{{
                    isAudit && ruleType >= 3
                      ? selectedHaikang.ruleName
                      : info.ruleName
                  }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车牌号：">
                    <div v-if="isAudit" class="checkLicensePlate">
                      <el-input
                        v-model="auditForm.licensePlate"
                        placeholder="请输入"
                        maxlength="20"
                        @input="auditLicensePlateChange"
                      />
                      <el-button
                        v-if="ruleType < 3"
                        class="checkLicensePlateBtn"
                        type="primary"
                        :loading="checkLicensePlateLoading"
                        @click="handleCheckLicensePlate"
                      >校验</el-button>
                    </div>
                    <div v-else>{{ info.licensePlate }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号：">{{
                    isAudit && ruleType >= 3
                      ? selectedHaikang.telephone
                      : info.telephone
                  }}</el-form-item>
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
                    <div v-else style="line-height: 24px">
                      {{ info.message }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="isAudit" slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="handleAuditOrInvaild(true)"
        >审核</el-button>
        <el-button
          :loading="confirmLoading"
          @click="handleAuditOrInvaild(false)"
        >作废</el-button>
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
      defaultMessageObj: {
        name: '',
        time: '',
        address: '',
        licensePlate: '',
        ruleType: '',
        travelMode: ''
      },
      imgOrigin: apiDomain,
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
        [0, '全部'],
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
      confirmLoading: false,
      pageNo: 1,
      pageSize: 10,
      total: 4,
      dataSource: [],
      count1: 0,
      count2: 0,
      count3: 0,
      form: {
        ruleType: 0,
        verifyedStatus: 0,
        handledStatus: 0,
        licensePlateStatus: false
      },
      auditForm: {
        travelMode: 1
      },
      selectedRowKey: 0,
      ruleType: 0,
      isAudit: false,
      dialogVisible: false,
      info: {},
      selectedHaikangKey: 0,
      checkLicensePlateLoading: false
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
    selectedHaikang() {
      let result = {};
      (this.info.haikang || []).forEach((item) => {
        if (item.id === this.selectedHaikangKey) {
          result = item
          this.defaultMessageObj.name = item.ruleName
          this.auditForm.message = this.defaultMessage()
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
          message: ''
        }
      }
    }
  },
  mounted() {
    this.getTableData()
    this.getStatisticalData()
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
          this.$message.error('获取违法数据失败')
          this.tableLoading = false
        })
    },
    getStatisticalData() {
      axios.get('/api/times').then((res) => {
        const {
          data: { getNumber, verifyedNumber, voidNumber }
        } = res
        this.count1 = getNumber
        this.count2 = verifyedNumber
        this.count3 = voidNumber
      })
    },
    // selectRuleType(value) {
    //   // 查询条件
    //   this.form.ruleType = value
    // },
    async handleSearch() {
      // 查询
      this.pageNo = 1
      this.searchLoading = true
      await this.getTableData()
      this.searchLoading = false
    },
    handleCurrentChange(value) {
      // 改变页码
      this.pageNo = value
      this.getTableData()
    },
    auditRuleTypeChange(e) {
      this.defaultMessageObj.ruleType = this.ruleTypeMap.get(e)
      this.auditForm.message = this.defaultMessage()
    },
    auditTravelModeChange(e) {
      this.defaultMessageObj.travelMode = this.travelModeMap.get(e)
      this.auditForm.message = this.defaultMessage()
    },
    auditLicensePlateChange(e) {
      this.defaultMessageObj.licensePlate = e
      this.auditForm.message = this.defaultMessage()
    },
    defaultMessage() {
      const {
        name,
        time,
        address,
        licensePlate,
        ruleType,
        travelMode
      } = this.defaultMessageObj
      return `${name}，您于${time}在${address}驾驶${licensePlate}${travelMode}，被电子警察记录了${ruleType}的违法行为，请及时接受处理。`
    },
    handleShowDialog(isAudit, id, ruleType) {
      this.tableLoading = true
      this.selectedRowKey = id
      this.ruleType = ruleType
      this.isAudit = isAudit
      axios
        .get(`/api/rules/${this.selectedRowKey}`)
        .then((res) => {
          const { data } = res
          if (isAudit) {
            if (this.ruleType >= 3) {
              axios
                .get(`/api/rules/${this.selectedRowKey}/faces`)
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
                  this.defaultMessageObj = {
                    name: this.selectedHaikang.ruleName,
                    time: this.info.ruleAt,
                    address: this.info.ruleplace || '',
                    licensePlate: this.info.licensePlate || '',
                    ruleType: this.ruleTypeMap.get(data.ruleType || 1), // 违法类型 默认闯红灯
                    travelMode: this.travelModeMap.get(data.travelMode || 1) // 出行方式 默认电动自行车
                  }
                  this.auditForm = {
                    ruleType: data.ruleType || 1, // 违法类型 默认闯红灯
                    travelMode: data.travelMode || 1, // 出行方式 默认电动自行车
                    licensePlate: data.licensePlate,
                    message: this.defaultMessage()
                  }
                  this.dialogVisible = true
                  this.tableLoading = false
                })
                .catch(() => {
                  this.tableLoading = false
                })
            } else {
              this.info = {
                ...data
              }
              this.defaultMessageObj = {
                name: this.info.ruleName,
                time: this.info.ruleAt,
                address: this.info.ruleplace || '',
                licensePlate: this.info.licensePlate || '',
                ruleType: this.ruleTypeMap.get(data.ruleType || 1), // 违法类型 默认闯红灯
                travelMode: this.travelModeMap.get(data.travelMode || 1) // 出行方式 默认电动自行车
              }
              this.auditForm = {
                ruleType: data.ruleType || 1, // 违法类型 默认闯红灯
                travelMode: data.travelMode || 1, // 出行方式 默认电动自行车
                licensePlate: data.licensePlate,
                message: this.defaultMessage()
              }
              this.dialogVisible = true
              this.tableLoading = false
            }
          } else {
            this.info = data
            this.auditForm = {
              ruleType: data.ruleType,
              travelMode: data.travelMode || 1,
              licensePlate: data.licensePlate,
              message: data.message || ''
            }
            this.dialogVisible = true
            this.tableLoading = false
          }
          console.log(this.ruleType)
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleSelectFaceImg(value) {
      // 选择相似信息
      this.selectedHaikangKey = value
    },
    handleAuditOrInvaild(isAudit) {
      // 弹窗-审核/作废
      if (!this.auditForm.licensePlate && this.ruleType < 3) {
        this.$message.error('车牌号不能为空')
        return
      }
      if (!this.auditForm.message) {
        this.$message.error('短信模板不能为空')
        return
      }
      /**
       * this.info.facePhoto = data.facePhoto
            this.info.license = data.license
            this.info.ruleName = data.ruleName
            this.info.telephone = data.telephone
       */
      const params = {
        id: this.selectedRowKey,
        verifyedStatus: isAudit ? 2 : 3,
        verifyedName: localStorage.getItem('username'),
        ...this.auditForm,
        facePhoto:
          this.ruleType >= 3
            ? this.selectedHaikang.facePhoto
            : this.info.facePhoto,
        license:
          this.ruleType >= 3 ? this.selectedHaikang.license : this.info.license,
        ruleName:
          this.ruleType >= 3
            ? this.selectedHaikang.ruleName
            : this.info.ruleName,
        similarity:
          this.ruleType >= 3
            ? this.selectedHaikang.similarity
            : this.info.similarity,
        telephone:
          this.ruleType >= 3
            ? this.selectedHaikang.telephone
            : this.info.telephone,
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
        .put('/api/rules', params)
        .then(() => {
          this.dialogVisible = false
          this.getTableData({
            pageNo: 1
          })
          this.getStatisticalData()
          this.confirmLoading = false
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    handleCancel() {
      // 弹窗-取消
      this.dialogVisible = false
    },
    handleCheckLicensePlate() {
      // 校验车牌号
      this.checkLicensePlateLoading = true
      axios
        .get(`/api/licenseplate/${this.auditForm.licensePlate}`)
        .then((res) => {
          const { data } = res
          if (this.ruleType >= 3) {
            // this.selectedHaikang.facePhoto = data.facePhoto
            // this.selectedHaikang.license = data.license
            // this.selectedHaikang.ruleName = data.ruleName
            // this.selectedHaikang.telephone = data.telephone
          } else {
            this.info.facePhoto = data.facePhoto
            this.info.license = data.license
            this.info.ruleName = data.ruleName
            this.info.telephone = data.telephone
          }
          this.defaultMessageObj.name = data.ruleName
          this.auditForm.message = this.defaultMessage()
          this.checkLicensePlateLoading = false
        })
        .catch(() => {
          this.checkLicensePlateLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.ruleType-buttons {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
  .el-button {
    margin-right: 20px;
  }
}
.table_pagination {
  margin-top: 20px;
}
.table-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  &-block {
    border-radius: 4px;
    text-align: center;
    background: rgb(229, 233, 242);
    line-height: 40px;
    height: 40px;
    width: 32%;
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
          flex: 1;
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
      .evidence-block {
        display: flex;
        &-imgDiv {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 196px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
          video {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        &-imgDiv:last-child{
          background-color: #000;
        }
      }
      .similarity-block {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #ccc;
        border-right: none;
        border-top: none;
        &-imgDiv {
          position: relative;
          flex: 0 0 192px;
          height: 196px;
          text-align: center;
          cursor: pointer;
          border-right: 1px solid #ccc;
          border-top: 1px solid #ccc;
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
      .checkLicensePlate {
        display: flex;
        &Btn {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
