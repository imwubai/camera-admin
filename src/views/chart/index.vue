<template>
  <div class="app-container">
    <!--饼图-->
    <div class="left-top">
      <div id="pie-chart" style="width: 100%; height: 400px"></div>
    </div>

    <!--柱状图-->
    <!-- <div>古河南路</div> -->
    <div class="right-top">
      <div id="columnar-chart-E" style="width: 100%; height: 100%"></div>
      <div id="columnar-chart-S" style="width: 100%; height: 100%"></div>
      <div id="columnar-chart-W" style="width: 100%; height: 100%"></div>
      <div id="columnar-chart-N" style="width: 100%; height: 100%"></div>
    </div>

    <!--实时数据表格-->
    <div class="left-down">
      <el-table
        v-loading="tableLoading"
        row-key="id"
        :data="dataSource"
        style="width: 100%"
        border
        height="400px"
      >
        <el-table-column label="操作" width="92">
          <template slot-scope="scope">
            <el-button
              v-if="
                verifyedStatusMap.get(scope.row.verifyed_status) === '未审核'
              "
              type="primary"
              size="small"
              @click="handleShowDialog(true, scope.row.id, scope.row.rule_type)"
              >审核</el-button
            >
            <el-button
              v-if="
                ['已审核', '已作废'].includes(
                  verifyedStatusMap.get(scope.row.verifyed_status)
                )
              "
              :type="miStatusColor"
              size="small"
              @click="handleShowDialog(false, scope.row.id, scope.row.rule_type)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column type="index" label="序号" width="50">
        <template scope="scope"><span>{{ scope.$index+(pageNo - 1) * pageSize + 1 }} </span></template>
      </el-table-column> -->
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="rule_at" sortable label="采集时间" />
        <el-table-column prop="rule_place" sortable label="违法地点" />
        <el-table-column prop="rule_type" sortable label="违法类型">
          <template slot-scope="scope">{{
            ruleTypeMap.get(scope.row.rule_type)
          }}</template>
        </el-table-column>
        <!-- <el-table-column prop="similarity" sortable label="相似度" /> -->
        <!-- <el-table-column prop="licensePlate" sortable label="车牌号" /> -->
        <el-table-column prop="verifyed_status" sortable label="审核状态">
          <template slot-scope="scope">{{
            scope.row.verifyed_status
              ? verifyedStatusMap.get(scope.row.verifyed_status)
              : ""
          }}</template>
        </el-table-column>
        <!-- <el-table-column sortable label="当事人处理结果" width="150">
          <template slot-scope="scope">{{
            scope.row.handledStatus
              ? handledStatusMap.get(scope.row.handledStatus)
              : ""
          }}</template>
        </el-table-column> -->
        <!-- <el-table-column prop="verifyedAt" sortable label="审核时间" />
        <el-table-column prop="verifyedName" sortable label="审核人" /> -->
      </el-table>
    </div>

    <!--折线图-->
    <div class="left-down">
      <div id="line-chart" style="width: 100%; height: 400px"></div>
    </div>
       <!--放大图片的对话框-->
    <el-dialog
      title
      :visible.sync="imgViewDialogVisible"
      class="imgView-dialog"
      :modal="false"
      style="width: 130%"
    >
      <div class="main">
        <img class="img" width="100%" :src="imgViewDialog_imgSrc" />
      </div>
    </el-dialog>
    <!--审核的对话框-->
    <el-dialog
      class="audit-dialog"
      :title="isAudit ? '审核' : '查看'"
      :visible.sync="dialogVisible"
      width="1200px"
      :destroy-on-close="true"
      :lock-scroll="false"
      @close="closeCheckDialog()"
    >
      <div v-if="redType">
        <div class="audit-dialog-content">
          <div class="audit-dialog-content-left">
                  <div style="height:28px;"  v-if="ruleType < 3"></div>
            <div class="evidence-block">
         
              <!--1图-->
              <div class="evidence-block-imgDiv" style="position: relative">
         
                <img
                  :src="`${imgOrigin}/${info.evidenceBigPhoto1}`"
                  class="avatar"
                  @click="imgViewDialog_show()"
                  id="downloadImage"
                  style="width: 100%"
                />
                <el-button
                  type="primary"
                  style="position: absolute; bottom: 1%; left: 0%"
                  @click="downPic(imgsrc)"
                  >下载<i class="el-icon-download"></i
                ></el-button>
              </div>
              <!--2图-->
              <div
                v-if="ruleType < 3"
                class="evidence-block-imgDiv"
                style="position: relative"
              >
                <video
                  :src="`${imgOrigin}/${info.evidenceVedio}`"
                  controls="controls"
                >
                  您的浏览器不支持。
                </video>
                <!-- <img
                  :src="`${imgOrigin}/${info.evidenceBigPhoto2}`"
                  @click="imgViewDialog_show1()"
                  id="downloadImage1"
                />
                <el-button
                  type="primary"
                  style="position: absolute; bottom: 1%; left: 70%"
                  @click="downPic1(imgsrc)"
                  >下载<i class="el-icon-download"></i
                ></el-button> -->
              </div>
            </div>

            <div class="license-block"  v-if="ruleType >= 3">
              <div class="license-block-imgDiv" style="position: relative">
                <div class="title">当事人</div>
                <img
                  :src="`${imgOrigin}/${info.evidencePhoto}`"
                  id="downloadImage3"
                  alt
                />
              </div>
              <div class="license-block-imgDiv" style="position: relative">
                <div class="title">推荐/车主</div>
                <img
                  :src="`${imgOrigin}/${
                    isAudit && ruleType >= 3
                      ? selectedHaikang.facePhoto
                      : info.facePhoto
                  }`"
                  id="downloadImage4"
                  alt
                />
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
              <div class="license-block"  v-if="ruleType < 3">
            
              
              <div class="license-block-imgDiv" style="position: relative">
                <div class="title">当事人</div>
                <img
                  :src="`${imgOrigin}/${info.evidencePhoto}`"
                  id="downloadImage3"
                  alt
                />
              </div>
              <div class="license-block-imgDiv" style="position: relative">
                <div class="title">推荐/车主</div>
                <img
                  :src="`${imgOrigin}/${
                    isAudit && ruleType >= 3
                      ? selectedHaikang.facePhoto
                      : info.facePhoto
                  }`"
                  id="downloadImage4"
                  alt
                />
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
              <!--图3-->
            <!-- <div v-if="ruleType < 3" class="evidence-block">
            
              <div class="evidence-block-imgDiv" style="position: relative">
                
                <img
                  :src="`${imgOrigin}/${info.evidenceSmallPhoto}`"
                  alt
                  id="downloadImage2"
                  @click="imgViewDialog_show2()"
                />

                <el-button
                  type="primary"
                  style="position: absolute; bottom: 1%; left: 70%"
                  @click="downPic2(imgsrc)"
                  >下载<i class="el-icon-download"></i
                ></el-button>
              </div>
              <div class="evidence-block-imgDiv">
                <video
                  :src="`${imgOrigin}/${info.evidenceVedio}`"
                  controls="controls"
                >
                  您的浏览器不支持。
                </video>
              </div>
            </div> -->
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
                <img :src="`${imgOrigin}/${item.facePhoto}`" alt />
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
                      info.rule_at
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
                          >校验</el-button
                        >
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
            >审核</el-button
          >
          <el-button
            :loading="confirmLoading"
            @click="handleAuditOrInvaild(false)"
            >作废</el-button
          >
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import axios from "@/utils/request";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import { apiDomain } from "@/utils/config";
const now = moment().locale("zh-cn").format("YYYY-MM-DD "); // 获取当天的日期
const pieData = [
  {
    name: "闯红灯",
    value: 1,
    itemStyle: {
      color: "#6699CC",
    },
  },
  {
    name: "闯红灯",
    value: 1,
    itemStyle: {
      color: "#66CCCC",
    },
  },
  {
    name: "闯红灯",
    value: 1,
    itemStyle: {
      color: "#666699",
    },
  },
  {
    name: "闯红灯",
    value: 1,
    itemStyle: {
      color: "#336699",
    },
  },
  {
    name: "闯红灯",
    value: 1,
    itemStyle: {
      color: "#663399",
    },
  },
  {
    name: "闯红灯",
    value: 1,
    itemStyle: {
      color: "#003399	",
    },
  },
]; // 饼图假数据

export default {
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  data() {
    return {
      dataArray: [], //详细数据
      replaceData: [], // 代替折线图的数据
      direction: [], // 方向
      defaultMessageObj: {
        name: "",
        time: "",
        address: "",
        licensePlate: "",
        ruleType: "",
        travelMode: "",
      },
      imgOrigin: apiDomain,
      ruleTypeMap: new Map([
        [0, "全部"],
        [1, "闯红灯"],
        [2, "越线"],
        [6, "逆行"],
        [3, "载人"],
        [5, "无头盔"],
        [4, "安装伞具"],
      ]),
      verifyedStatusMap: new Map([
        [0, "全部"],
        [1, "未审核"],
        [2, "已审核"],
        [3, "已作废"],
      ]),
      handledStatusMap: new Map([
        [0, "全部"],
        [1, "未处理"],
        [2, "已处理"],
        [3, "无需处理"],
      ]),
      travelModeMap: new Map([
        [0, "全部"],
        [1, "电动自行车"],
        [2, "三轮车"],
        [3, "手推车"],
        [4, "残疾人专用车"],
        [5, "畜力车"],
        [6, "助力自行车"],
        [7, "其他非机动车"],
      ]),
      isFastCheck: false, // 是否快速审核中
      searchLoading: false,
      tableLoading: false,
      confirmLoading: false,
      hasNextPageData: true, // 下一页是否还有数据
      pageNo: 1,
      pageSize: 20,
      total: 4,
      dataSource: [],
      count1: 0,
      count2: 0,
      count3: 0,
      form: {
        ruleType: 0,
        verifyed_status: 0,
        handledStatus: 0,
        licensePlateStatus: false,
      },
      auditForm: {
        travelMode: 1,
      },
      selectedRowKey: 0,
      ruleType: 0,
      isAudit: false,
      dialogVisible: false,
      info: {},
      selectedHaikangKey: 0,
      checkLicensePlateLoading: false,
      imgsrc: [
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2933817164,3846927131&fm=26&gp=0.jpg",
      ],
      statusOptions: [],
      imgViewDialogVisible: false, // 控制dialog显示隐藏
      imgViewDialog_imgSrc: "", // 控制图片src
      miStatusColor: "info", // 查看按钮颜色
      redType: false, // 闯红灯
      dataType: false, // 载人,未戴头盔,逆行
    };
  },
  computed: {
    ruleTypeOptions() {
      const searchOptions = [];
      const operateOptions = [];
      this.ruleTypeMap.forEach((key, value) => {
        const o = {
          label: key,
          value,
        };
        if (value) {
          operateOptions.push(o);
        }
        searchOptions.push(o);
      });
      return {
        searchOptions,
        operateOptions,
      };
    }, // 违法类型
    travelModeOptions() {
      const searchOptions = [];
      const operateOptions = [];
      this.travelModeMap.forEach((key, value) => {
        const o = {
          label: key,
          value,
        };
        if (value) {
          operateOptions.push(o);
        }
        searchOptions.push(o);
      });
      return {
        searchOptions,
        operateOptions,
      };
    }, // 出行方式
    // searchParams() {
    //   const result = {};
    //   Object.keys(this.form).forEach((key) => {
    //     if (
    //       this.form[key] ||
    //       this.form[key] === 0 ||
    //       this.form[key] === false
    //     ) {
    //       if (key === "rule_at" && this.form[key] && this.form[key].length > 0) {
    //         const [begin, end] = this.form[key];
    //         result.ruleBeginAt = moment(begin).format("YYYY-MM-DD HH:mm:ss");
    //         result.ruleEndAt = moment(end).format("YYYY-MM-DD HH:mm:ss");
    //       } else if (key === "similarity") {
    //         result[key] = Number(this.form[key]);
    //       } else if (key === "licensePlateStatus") {
    //         result[key] = this.form[key] ? 2 : 0;
    //       } else {
    //         result[key] = this.form[key];
    //       }
    //     }
    //   });
    //   return result;
    // },
    selectedHaikang() {
      let result = {};
      (this.info.haikang || []).forEach((item) => {
        if (item.id === this.selectedHaikangKey) {
          result = item;
          this.defaultMessageObj.name = item.ruleName;
          this.auditForm.message = this.defaultMessage();
        }
      });
      return result;
    },
  },
  watch: {
    dialogVisible(value) {
      if (!value) {
        this.auditForm = {
          travelMode: 1,
          message: "",
        };
      }
    },
  },

  mounted() {
    this.chartPieData(); // 饼图
    this.chartLineData(); //折线
    this.chartColumnarData(); // 柱状

  //  setInterval( ()=> {
      // this.getTableData(); // 实时数据
     
  //     }, 300);
  //    setInterval( ()=> {
  //       this.chartPieData(); // 饼图
  //     this.chartLineData(); //折线
  //     this.chartColumnarData(); // 柱状
  //     }, 30000);

  //   axios
  //     .get("/api/crossings")
  //     .then((res) => {
  //       this.statusOptions = res.data.map((i) => {
  //         return i;
  //       });

  //       // console.log(this.statusOptions)
  //       // 第一个追加全部
  //       this.statusOptions.unshift({
  //         crossingId: 0,
  //         crossingName: "全部",
  //       });
  //     })
  //     .catch(() => {
  //       this.$message.error("获取违法地点失败");
  //     });

     
  },
  methods: {
    drawingPie() {
      var myChart = echarts.init(document.getElementById("pie-chart"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "违法数据统计",
          // subtext: "纯属虚构",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.dataArray,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      }; // 使用刚指定的配置项和数据显示图表。
      // setInterval(function(){
      option.series[0].data[0] = pieData[0];
      option.series[0].data[1] = pieData[1];
      option.series[0].data[2] = pieData[2];
      option.series[0].data[3] = pieData[3];
      option.series[0].data[4] = pieData[4];
      option.series[0].data[5] = pieData[5];

      myChart.setOption(option);
      //  },30000);
    }, // 画饼图方法
    chartPieData() {
      axios
        .post("/api/browser-search ", {
          startTime: now + "00:00:00", // 部署
          endTime: now + "23:59:59",
          // startTime: "2021-01-02 00:00:00", // 测试
          // endTime: "2021-01-02 23:59:59",
          searchType: 0,
        })
        .then((res) => {
          // console.log(res.data);
          res.data.forEach(({ ruleType, sum, proportion }) => {
            switch (ruleType) {
              case "逆行":
                pieData[0].name = ruleType;
                pieData[0].value = sum;

                break;
              case "闯红灯":
                pieData[1].name = ruleType;
                pieData[1].value = sum;

                break;
              case "越线":
                pieData[2].name = ruleType;
                pieData[2].value = sum;

                break;
              case "载人":
                pieData[3].name = ruleType;
                pieData[3].value = sum;

                break;
              case "伞具":
                pieData[4].name = ruleType;
                pieData[4].value = sum;

                break;
              case "未戴头盔":
                pieData[5].name = ruleType;
                pieData[5].value = sum;

                break;
            }
          });
          this.drawingPie();
        }); // 饼图接口
    }, // 饼图数据
    drawingColumnarE() {
      var myChartE = echarts.init(document.getElementById("columnar-chart-E")); // 东-南-西-北

      // 指定图表的配置项和数据
      var optionE = {
        title: {
          text: this.direction[0],
          left: "top",
          textStyle: {
            color: "#333333",
            // fontWeight: 'bold',
            fontSize: 14,
          },
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   // 坐标轴指示器，坐标轴触发有效
          //   type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          // },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.EastData.dataX,

            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              verticalAlign: "top",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: this.EastData.dataY,
          },
        ],
      };

      myChartE.setOption(optionE);
    }, // 画柱状图方法1
    drawingColumnarS() {
      var myChartS = echarts.init(document.getElementById("columnar-chart-S"));

      // 指定图表的配置项和数据

      var optionS = {
        title: {
          text: this.direction[1],
          left: "top",
          textStyle: {
            color: "#333333",
            fontSize: 14,
          },
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   // 坐标轴指示器，坐标轴触发有效
          //   type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          // },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.SouthData.dataX1,

            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              verticalAlign: "top",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: this.SouthData.dataY1,
          },
        ],
      };

      myChartS.setOption(optionS);
    }, // 画柱状图方法2
    drawingColumnarW() {
      var myChartW = echarts.init(document.getElementById("columnar-chart-W"));

      // 指定图表的配置项和数据

      var optionW = {
        title: {
          text: this.direction[2],
          left: "top",
          textStyle: {
            color: "#333333",
            // fontWeight: 'bold',
            fontSize: 14,
          },
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   // 坐标轴指示器，坐标轴触发有效
          //   type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          // },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.WestData.dataX2,

            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              verticalAlign: "top",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: this.WestData.dataY2,
          },
        ],
      };

      myChartW.setOption(optionW);
    }, // 画柱状图方法2
    drawingColumnarN() {
      var myChartN = echarts.init(document.getElementById("columnar-chart-N"));

      // 指定图表的配置项和数据

      var optionN = {
        title: {
          text: this.direction[3],
          left: "top",
          textStyle: {
            color: "#333333",
            // fontWeight: 'bold',
            fontSize: 14,
          },
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   // 坐标轴指示器，坐标轴触发有效
          //   type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          // },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.NorthData.dataX3,

            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              verticalAlign: "top",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: this.NorthData.dataY3,
          },
        ],
      };

      myChartN.setOption(optionN);
    }, // 画柱状图方法2
    chartColumnarData() {
      let dataX = [];
      let dataY = [];
      let dataX1 = [];
      let dataY1 = [];
      let dataX2 = [];
      let dataY2 = [];
      let dataX3 = [];
      let dataY3 = [];
      this.EastData = {
        dataX,
        dataY,
      };
      this.SouthData = {
        dataX1,
        dataY1,
      };
      this.WestData = {
        dataX2,
        dataY2,
      };
      this.NorthData = {
        dataX3,
        dataY3,
      };

      axios
        .post("/api/browser-search ", {
          startTime: now + "00:00:00", // 部署
          endTime: now + "23:59:59",
          // startTime: "2021-01-02 00:00:00", // 测试
          // endTime: "2021-01-02 23:59:59",
          searchType: 4,
          intersection: "",
        })
        .then((res) => {
          // console.log(res.data[0].info);
          res.data[0].info.forEach(
            ({ id, illegalInfo, intersectionPositionName }) => {
              switch (id) {
                case 1:
                  this.direction[0] = intersectionPositionName;

                  illegalInfo.forEach(({ ruleType, sum }) => {
                    switch (ruleType) {
                      case "闯红灯":
                        this.EastData.dataX.push("闯红灯");

                        this.EastData.dataY.push(sum);
                        break;
                      case "逆行":
                        this.EastData.dataX.push("逆行");
                        this.EastData.dataY.push(sum);
                        break;
                      case "越线":
                        this.EastData.dataX.push("越线");
                        this.EastData.dataY.push(sum);
                        break;
                      case "载人":
                        this.EastData.dataX.push("载人");
                        this.EastData.dataY.push(sum);
                        break;
                      case "伞具":
                        this.EastData.dataX.push("伞具");
                        this.EastData.dataY.push(sum);
                        break;
                      case "未戴头盔":
                        this.EastData.dataX.push("未戴头盔");
                        this.EastData.dataY.push(sum);
                        break;
                    }
                  });
                  this.drawingColumnarE();
                  // this.chartE = true;
                  // this.chartS = false;
                  // this.chartW = false;
                  // this.chartN = false;

                  break;
                case 2:
                  // console.log(illegalInfo, intersectionPositionName);
                  this.direction[1] = intersectionPositionName;
                  illegalInfo.forEach(({ ruleType, sum }) => {
                    switch (ruleType) {
                      case "闯红灯":
                        this.SouthData.dataX1.push("闯红灯");

                        this.SouthData.dataY1.push(sum);
                        break;
                      case "逆行":
                        this.SouthData.dataX1.push("逆行");
                        this.SouthData.dataY1.push(sum);
                        break;
                      case "越线":
                        this.SouthData.dataX1.push("越线");
                        this.SouthData.dataY1.push(sum);
                        break;
                      case "载人":
                        this.SouthData.dataX1.push("载人");
                        this.SouthData.dataY1.push(sum);
                        break;
                      case "伞具":
                        this.SouthData.dataX1.push("伞具");
                        this.SouthData.dataY1.push(sum);
                        break;
                      case "未戴头盔":
                        this.SouthData.dataX1.push("未戴头盔");
                        this.SouthData.dataY1.push(sum);
                        break;
                    }
                  });
                  this.drawingColumnarS();
                  // this.chartE = false;
                  // this.chartS = true;
                  // this.chartW = false;
                  // this.chartN = false;
                  break;
                case 3:
                  // console.log(illegalInfo, intersectionPositionName);
                  this.direction[2] = intersectionPositionName;
                  illegalInfo.forEach(({ ruleType, sum }) => {
                    switch (ruleType) {
                      case "闯红灯":
                        this.WestData.dataX2.push("闯红灯");

                        this.WestData.dataY2.push(sum);
                        break;
                      case "逆行":
                        this.WestData.dataX2.push("逆行");
                        this.WestData.dataY2.push(sum);
                        break;
                      case "越线":
                        this.WestData.dataX2.push("越线");
                        this.WestData.dataY2.push(sum);
                        break;
                      case "载人":
                        this.WestData.dataX2.push("载人");
                        this.WestData.dataY2.push(sum);
                        break;
                      case "伞具":
                        this.WestData.dataX2.push("伞具");
                        this.WestData.dataY2.push(sum);
                        break;
                      case "未戴头盔":
                        this.WestData.dataX2.push("未戴头盔");
                        this.WestData.dataY2.push(sum);
                        break;
                    }
                  });
                  this.drawingColumnarW();
                  // this.chartE = false;
                  // this.chartS = false;
                  // // this.chartW = true;
                  // this.chartN = false;
                  break;
                case 4:
                  //  this.chartN = true;
                  // console.log(illegalInfo, intersectionPositionName);
                  this.direction[3] = intersectionPositionName;
                  illegalInfo.forEach(({ ruleType, sum }) => {
                    switch (ruleType) {
                      case "闯红灯":
                        this.NorthData.dataX3.push("闯红灯");

                        this.NorthData.dataY3.push(sum);
                        break;
                      case "逆行":
                        this.NorthData.dataX3.push("逆行");
                        this.NorthData.dataY3.push(sum);
                        break;
                      case "越线":
                        this.NorthData.dataX3.push("越线");
                        this.NorthData.dataY3.push(sum);
                        break;
                      case "载人":
                        this.NorthData.dataX3.push("载人");
                        this.NorthData.dataY3.push(sum);
                        break;
                      case "伞具":
                        this.NorthData.dataX3.push("伞具");
                        this.NorthData.dataY3.push(sum);
                        break;
                      case "未戴头盔":
                        this.NorthData.dataX3.push("未戴头盔");
                        this.NorthData.dataY3.push(sum);
                        break;
                    }
                  });
                  this.drawingColumnarN();
                  // this.chartE = false;
                  // this.chartS = false;
                  // this.chartW = false;
                  // this.chartN = true;

                  break;
              }
            }
          );
          // console.log(this.direction);
        });
    }, // 绘制柱状图的数据
    drawingLine() {
      var myChart = echarts.init(document.getElementById("line-chart"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "违法数据月报",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["闯红灯", "越线", "载人", "伞具", "未戴头盔", "逆行"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.chartData2.dataX[0],
          axisLabel: {
            interval: 0,
            rotate: 45,
            verticalAlign: "top",
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "闯红灯",
            type: "line",
            stack: "总量",
            data: this.chartData2.dataY[0],
          },
          {
            name: "越线",
            type: "line",
            stack: "总量",
            data: this.chartData2.dataY[1],
          },
          {
            name: "载人",
            type: "line",
            stack: "总量",
            data: this.chartData2.dataY[2],
          },
          {
            name: "伞具",
            type: "line",
            stack: "总量",
            data: this.chartData2.dataY[3],
          },
          {
            name: "未戴头盔",
            type: "line",
            stack: "总量",
            data: this.chartData2.dataY[4],
          },
          {
            name: "逆行",
            type: "line",
            stack: "总量",
            data: this.chartData2.dataY[5],
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }, // 画折线图方法
    chartLineData() {
      let dataX = [];
      let dataY = [];

      axios
        .post("/api/browser-search ", {
          startTime: "",
          endTime: "",
          searchType: 5,
          intersection: "",
        })
        .then((res) => {
          // console.log(res.data);

          res.data
            .map((item) => ({
              ...item,
            }))
            .forEach(({ dateX, ruleY, ruleType, num }) => {
              this.replaceData[num - 1] = ruleY;

              // switch (num) {
              //   case 1:
              //     this.replaceData[0] = ruleY;
              //     break;
              //   case 2:
              //     this.replaceData[1] = ruleY;
              //     break;
              //   case 3:
              //     this.replaceData[2] = ruleY;
              //     break;
              //   case 4:
              //     this.replaceData[3] = ruleY;
              //     break;
              //   case 5:
              //     this.replaceData[4] = ruleY;
              //     break;
              //   case 6:
              //     this.replaceData[5] = ruleY;
              //     break;
              // }

              dataX.push(dateX);
              dataY = this.replaceData;
              // console.log(dataY)
              this.chartData2 = {
                dataX,
                dataY,
              };
            });

          this.drawingLine();
        });
    }, // 绘制折线图的数据
    /**
     * 图片放大效果
     */
    imgViewDialog_show: function (src) {
      console.log(document.getElementById("downloadImage").src);

      this.imgViewDialogVisible = true;
      this.imgViewDialog_imgSrc = document.getElementById("downloadImage").src;
    }, // 第一张图放大

    imgViewDialog_show1: function (src) {
      console.log(document.getElementById("downloadImage1").src);

      this.imgViewDialogVisible = true;
      this.imgViewDialog_imgSrc = document.getElementById("downloadImage1").src;
    }, // 第二张图放大

    imgViewDialog_show2: function (src) {
      console.log(document.getElementById("downloadImage2").src);

      this.imgViewDialogVisible = true;
      this.imgViewDialog_imgSrc = document.getElementById("downloadImage2").src;
    }, // 第三张图放大

    /**
     * 图片dialog_关闭
     */
    imgViewDialog_close: function () {
      this.imgViewDialogVisible = false;
      var self = this;
      setTimeout(function () {
        self.imgViewDialog_imgSrc = "";
      }, 100);
    },

    downPic(src) {
      src = document.getElementById("downloadImage").src;
      let imgName = decodeURIComponent(src.substring(31));
      var canvas = document.createElement("canvas");
      var img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = imgName;
          link.click();
        }, "image/jpeg");
      };
      img.crossOrigin = "Anonymous";
      img.src = src;
    }, // 下载图片

    downPic1(src) {
      src = document.getElementById("downloadImage1").src;
      let imgName = decodeURIComponent(src.substring(31));
      var canvas = document.createElement("canvas");
      var img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = imgName;
          link.click();
        }, "image/jpeg");
      };
      img.crossOrigin = "Anonymous";
      img.src = src;
    }, // 下载图片1

    downPic2(src) {
      src = document.getElementById("downloadImage2").src;
      let imgName = decodeURIComponent(src.substring(31));
      var canvas = document.createElement("canvas");
      var img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = imgName;
          link.click();
        }, "image/jpeg");
      };
      img.crossOrigin = "Anonymous";
      img.src = src;
    }, // 下载图片2

    downPic3(src) {
      src = document.getElementById("downloadImage3").src;
      let imgName = decodeURIComponent(src.substring(31));
      var canvas = document.createElement("canvas");
      var img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = imgName;
          link.click();
        }, "image/jpeg");
      };
      img.crossOrigin = "Anonymous";
      img.src = src;
    }, // 下载图片3

    downPic4(src) {
      src = document.getElementById("downloadImage4").src;
      let imgName = decodeURIComponent(src.substring(31));
      var canvas = document.createElement("canvas");
      var img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = imgName;
          link.click();
        }, "image/jpeg");
      };
      img.crossOrigin = "Anonymous";
      img.src = src;
    }, // 下载图片4


    idCard(text) {
      return text ? `******${String(text).substr(6, 8)}****` : "";
    },// 身份证号
    getTableData() {
      //  axios
      // .get("http://192.168.1.65:14000/api/v1/rule/news")
      // .then((res) => {
      //   console.log(res.data)
      //  this.dataSource  = res.data
      // //  this.searchParams
      //  console.log( this.dataSource)
      //  })
      //  .catch(() => {
      //    this.$message.error("获取最新数据失败");
      //  });



//  searchParams() {
      // const result = {};
      // Object.keys(this.form).forEach((key) => {
      //   if (
      //     this.form[key] ||
      //     this.form[key] === 0 ||
      //     this.form[key] === false
      //   ) {
      //     if (key === "rule_at" && this.form[key] && this.form[key].length > 0) {
      //       const [begin, end] = this.form[key];
            // result.ruleBeginAt = moment(begin).format("YYYY-MM-DD HH:mm:ss");
            // result.ruleEndAt = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //     } else if (key === "similarity") {
      //       result[key] = Number(this.form[key]);
      //     } else if (key === "licensePlateStatus") {
      //       result[key] = this.form[key] ? 2 : 0;
      //     } else {
      //       result[key] = this.form[key];
      //     }
      //   }
      // });
      // return result;
    // }


      //  this.tableLoading = true;
      // axios
      //   .post("/api/rules/search", 
      //   {
      //     pageNo: this.pageNo,
      //     pageSize: this.pageSize,
      //     ...this.searchParams,
      //   })
      //   .then((res) => {
      //     const { data, pageNo, pageSize, totalCount } = res.data;
      //     // this.pageNo = pageNo;
      //     // this.pageSize = pageSize;
      //     // this.total = totalCount;

      //     // 判断是否还有下一页数据
      //     // if (data.length < pageSize) {
      //     //   this.hasNextPageData = false;
      //     // }
      //     // // 第一页时候重置当前表格数据
      //     // if (this.pageNo === 1) {
      //       this.dataSource = data;
      //       console.log(this.dataSource)
      //     // } else {
      //     //   this.dataSource = this.dataSource.concat(data);
      //     // }
      //     // 页码自增
      //     // this.pageNo = this.pageNo + 1;
      //     // this.tableLoading = false;
      //   })
      //   .catch(() => {
      //     this.$message.error("获取违法数据失败");
      //     // this.tableLoading = false;
      //   });
    }, // 表格数据


    // async handleSearch() {
    //   // 查询
    //   this.hasNextPageData = true;
    //   this.pageNo = 1;
    //   this.searchLoading = true;
    //   await this.getTableData();
    //   this.searchLoading = false;
    // },
    // loadNextPage() {
    //   if (this.hasNextPageData) {
    //     this.getTableData();
    //   }
    // },
    closeCheckDialog() {
      this.isFastCheck = false;
    },
    handleFastCheck() {
      // 快速审核
      this.isFastCheck = true;
      axios
        .get("/api/rule/unverified")
        .then((res) => {
          const { id, ruleType } = res.data;
          this.handleShowDialog(true, id, ruleType);
        })
        .catch((err) => {
          this.isFastCheck = false;
          // 最后一条审核完后关闭弹框
          this.dialogVisible = false;
          const { returnMessage } = err.response.data;
          this.$message.error(returnMessage || "没有需要审核的数据了");
        });
    },
    // handleCurrentChange(value) {
    //   // 改变页码
    //   this.pageNo = value;
    //   this.getTableData();
    // },
    auditRuleTypeChange(e) {
      this.defaultMessageObj.ruleType = this.ruleTypeMap.get(e);
      this.auditForm.message = this.defaultMessage();
    },
    auditTravelModeChange(e) {
      this.defaultMessageObj.travelMode = this.travelModeMap.get(e);
      this.auditForm.message = this.defaultMessage();
    },
    auditLicensePlateChange(e) {
      this.defaultMessageObj.licensePlate = e;
      this.auditForm.message = this.defaultMessage();
    },
    defaultMessage() {
      const {
        name,
        time,
        address,
        licensePlate,
        ruleType,
        travelMode,
      } = this.defaultMessageObj;
      return `${name}，您于${time}在${address}驾驶${licensePlate}${travelMode}，被电子警察记录了${ruleType}的违法行为，请及时接受处理。`;
    },
    handleShowDialog(isAudit, id, ruleType) {
      if (isAudit === true && ruleType === 1) {
        this.redType = true;
        // this.dataType = false;
      } else if (isAudit === true && ruleType !== 1) {
        // this.dataType = true;
        // this.redType = false;
        this.redType = true;
      } else {
        this.redType = true;
        // this.dataType = false;
      }

      this.tableLoading = true;
      this.selectedRowKey = id;
      this.ruleType = ruleType;
      this.isAudit = isAudit;
      axios
        .get(`/api/rules/${this.selectedRowKey}`)
        .then((res) => {
          const { data } = res;
          if (isAudit) {
            if (this.ruleType >= 3) {
              axios
                .get(`/api/rules/${this.selectedRowKey}/faces`)
                .then((res2) => {
                  const { data: data2 } = res2;
                  this.info = {
                    ...data,
                    haikang: (data2 || []).map((item, index) => ({
                      ...item,
                      id: index + 1,
                    })),
                  };
                  this.selectedHaikangKey =
                    data2 && data2.length > 0 ? data2[0].id : 0;
                  this.defaultMessageObj = {
                    name: this.selectedHaikang.ruleName,
                    time: this.info.rule_at,
                    address: this.info.rule_place || "",
                    licensePlate: this.info.licensePlate || "",
                    ruleType: this.ruleTypeMap.get(data.ruleType || 1), // 违法类型 默认闯红灯
                    travelMode: this.travelModeMap.get(data.travelMode || 1), // 出行方式 默认电动自行车
                  };
                  this.auditForm = {
                    ruleType: data.ruleType || 1, // 违法类型 默认闯红灯
                    travelMode: data.travelMode || 1, // 出行方式 默认电动自行车
                    licensePlate: data.licensePlate,
                    message: this.defaultMessage(),
                  };
                  this.dialogVisible = true;
                  this.tableLoading = false;
                })
                .catch(() => {
                  this.tableLoading = false;
                });
            } else {
              this.info = {
                ...data,
              };
              this.defaultMessageObj = {
                name: this.info.ruleName,
                time: this.info.rule_at,
                address: this.info.rule_place || "",
                licensePlate: this.info.licensePlate || "",
                ruleType: this.ruleTypeMap.get(data.ruleType || 1), // 违法类型 默认闯红灯
                travelMode: this.travelModeMap.get(data.travelMode || 1), // 出行方式 默认电动自行车
              };
              this.auditForm = {
                ruleType: data.ruleType || 1, // 违法类型 默认闯红灯
                travelMode: data.travelMode || 1, // 出行方式 默认电动自行车
                licensePlate: data.licensePlate,
                message: this.defaultMessage(),
              };
              this.dialogVisible = true;
              this.tableLoading = false;
            }
          } else {
            this.info = data;
            this.auditForm = {
              ruleType: data.ruleType,
              travelMode: data.travelMode || 1,
              licensePlate: data.licensePlate,
              message: data.message || "",
            };
            this.dialogVisible = true;
            this.tableLoading = false;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    handleSelectFaceImg(value) {
      // 选择相似信息
      this.selectedHaikangKey = value;
    },
    handleAuditOrInvaild(isAudit) {
      if (isAudit === true) {
        // 弹窗-审核/作废
        if (!this.auditForm.licensePlate && this.ruleType < 3) {
          this.$message.error("车牌号不能为空");
          return;
        }
        if (!this.auditForm.message) {
          this.$message.error("短信模板不能为空");
          return;
        }
      }

      /**
       * this.info.facePhoto = data.facePhoto
            this.info.license = data.license
            this.info.ruleName = data.ruleName
            this.info.telephone = data.telephone
       */
      const params = {
        id: this.selectedRowKey,
        verifyed_status: isAudit ? 2 : 3,
        verifyedName: localStorage.getItem("username"),
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
        verifyedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      if (isAudit) {
        params.verifyed_status = 2;
      } else {
        params.verifyed_status = 3;
      }
      this.confirmLoading = true;
      axios
        .put("/api/rules", params)
        .then(() => {
          // 重置初始条件
          this.hasNextPageData = true;
          this.pageNo = 1;
          // this.getTableData();

          this.confirmLoading = false;
          // 如果是快速审核装状态
          if (this.isFastCheck) {
            this.handleFastCheck();
          } else {
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          this.confirmLoading = false;
        });
    },
    handleCancel() {
      // 弹窗-取消
      this.dialogVisible = false;
    },
    handleCheckLicensePlate() {
      // 校验车牌号
      this.checkLicensePlateLoading = true;
      axios
        .get(`/api/licenseplate/${this.auditForm.licensePlate}`)
        .then((res) => {
          const { data } = res;
          if (this.ruleType >= 3) {
            // this.selectedHaikang.facePhoto = data.facePhoto
            // this.selectedHaikang.license = data.license
            // this.selectedHaikang.ruleName = data.ruleName
            // this.selectedHaikang.telephone = data.telephone
          } else {
            this.info.facePhoto = data.facePhoto;
            this.info.license = data.license;
            this.info.ruleName = data.ruleName;
            this.info.telephone = data.telephone;
          }
          this.defaultMessageObj.name = data.ruleName;
          this.auditForm.message = this.defaultMessage();
          this.checkLicensePlateLoading = false;
        })
        .catch(() => {
          this.checkLicensePlateLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-wrap: wrap;

  .left-top {
    width: 50%;
    height: 50%;
    border: 1px solid #304156;
  } // 左上
  .right-top {
    display: flex;
    width: 50%;
    // height: 50%;
    border: 1px solid #304156;
  } // 右上
  .left-down {
    width: 50%;
    height: 50%;
    border: 1px solid #304156;
  } // 左下
  .right-down {
    width: 50%;
    height: 50%;
    border: 1px solid #304156;
  } // 右下
}
.miniChart {
  width: 100%;
  height: 100%;
  // margin-top: -30px;
}
.form-div {
  display: flex;
  align-items: center;
  // margin-bottom: 10px;
  .label {
    flex: 0 0 50px;
  }
}
.el-table td,
.el-table th {
  padding: 5px 0;
}
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
.fastCheck {
  margin-bottom: 20px;
}
.audit-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .audit-dialog-content {
    display: flex;
    &-left {
      // padding-top: 25px;
      flex: 0 0 580px;
      .evidence-block {
        display: flex;
        &-imgDiv {
          display: flex;
          // align-items: center;
          justify-content: center;
          flex: 1;
          height: 198px;
          img {
            display: block;
            max-width: 100%;
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
        // &-imgDiv:last-child {
        //   // background-color: #000;
        // }
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
  .dialog-footer {
    position: relative;
    left: 900px;
  }
}
</style>
