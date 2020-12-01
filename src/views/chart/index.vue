<template>
  <div class="app-container">
    <div class="tipDiv">
      <div class="tipBlock">
        今日违法总数 <span>{{ totalNum }}</span>
      </div>
      <div class="tipBlock">
        闯红灯 <span>{{ redNum }}</span>
      </div>
      <div class="tipBlock">
        越线 <span>{{ crossLineNum }}</span>
      </div>
      <div class="tipBlock">
        逆行 <span>{{ retrogradeNum }}</span>
      </div>
      <div class="tipBlock">
        载人 <span>{{ moreNum }}</span>
      </div>
      <div class="tipBlock">
        未带头盔 <span>{{ noHelmetNum }}</span>
      </div>
      <div class="tipBlock">
        安装伞具 <span>{{ umbrellasNum }}</span>
      </div>
    </div>
    <div class="toDoDiv">
      目前还有<span>{{ toDoNum }}</span
      >条待处理，<router-link to="/check/index">进入处理</router-link>
    </div>
    <div class="chart-div">
      <div class="head">
        违法情况统计
        <div class="head-right">
          统计时间:{{ getStartTime }}至{{ getEndTime }}
        </div>
        <div class="search-buttons">
          <el-button size="mini" @click="handleSetFiest">设置</el-button>
        </div>
      </div>
      <div ref="chart1" class="chart" />
    </div>
    <div class="chart-div">
      <div class="head">
        违法行为趋势图
        <div class="search-buttons">
          <el-button size="mini" @click="handleSet">设置</el-button>
        </div>
      </div>
      <div ref="chart2" class="chart" />
      <div class="contrast">
        <div class="title">对比率</div>
        <div
          v-for="(item, index) in contrastRatiosData"
          :key="index"
          :class="{
            number: true,
            positive_number: item > 0,
            negative_number: item < 0,
            zero_number: item === 0,
            last: index === contrastRatiosData.length - 1,
          }"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <el-dialog
      title="违法情况详细分析"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <div ref="miniChart" class="miniChart" />
    </el-dialog>

    <el-dialog
      title="设置"
      :visible.sync="setDialogVisible"
      width="500px"
      center
    >
      <div class="form-div">
        <span class="label">上期：</span
        ><el-date-picker
          v-model="date1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
           value-format="yyyy-MM-dd HH:mm:ss"
        />
      </div>
      <div class="form-div">
        <span class="label">本期：</span
        ><el-date-picker
          v-model="date2"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
           value-format="yyyy-MM-dd HH:mm:ss"
        />
      </div>
      <div class="form-div">
        <span class="label">路口：</span
        ><el-select
          v-model="roadValue"
          filterable=""
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in roadOptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveSet">保存</el-button>
        <el-button @click="setDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!--新增设置按钮-->
    <el-dialog
      title="设置"
      :visible.sync="setFirstDialogVisible"
      width="500px"
      center
    >
      <div class="form-div">
        <span class="label" style="flex: 0 0 70px">开始时间：</span>
        <el-date-picker
          v-model="datetime1"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </div>
      <div class="form-div">
        <span class="label" style="flex: 0 0 70px">结束时间：</span>
        <el-date-picker
          v-model="datetime2"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </div>
      <div class="form-div">
        <span class="label" style="flex: 0 0 70px">统计维度</span>
        <el-radio v-model="classify" label="1">按路口</el-radio>
        <el-radio v-model="classify" label="0">按时间段</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFirstSaveSet">保存</el-button>
        <el-button @click="setFirstDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import axios from "@/utils/request";

const data10 = [
  {
    id: 1,
    name: "路口A",
    value: 33,
  },
  {
    id: 2,
    name: "路口B",
    value: 22,
  },
  {
    id: 3,
    name: "路口C",
    value: 12,
  },
  {
    id: 4,
    name: "路口D",
    value: 12,
  },
  {
    id: 5,
    name: "路口E",
    value: 12,
  },
  {
    id: 6,
    name: "路口F",
    value: 12,
  },
  {
    id: 7,
    name: "路口G",
    value: 12,
  },
  {
    id: 8,
    name: "路口H",
    value: 12,
  },
  {
    id: 9,
    name: "路口I",
    value: 12,
  },
  {
    id: 10,
    name: "路口J",
    value: 12,
  },
  {
    id: 11,
    name: "路口K",
    value: 12,
  },
  {
    id: 12,
    name: "路口L",
    value: 12,
  },
  {
    id: 13,
    name: "路口M",
    value: 12,
  },
  {
    id: 14,
    name: "路口N",
    value: 12,
  },
];
const data11 = [
  {
    id: 1,
    name: "0点-1点",
    value: 24,
  },
  {
    id: 2,
    name: "1点-2点",
    value: 23,
  },
  {
    id: 3,
    name: "2点-3点",
    value: 22,
  },
  {
    id: 4,
    name: "3点-4点",
    value: 21,
  },
  {
    id: 5,
    name: "4点-5点",
    value: 20,
  },
  {
    id: 6,
    name: "5点-6点",
    value: 19,
  },
  {
    id: 7,
    name: "6点-7点",
    value: 18,
  },
  {
    id: 8,
    name: "7点-8点",
    value: 17,
  },
  {
    id: 9,
    name: "8点-9点",
    value: 16,
  },
  {
    id: 10,
    name: "9点-10点",
    value: 15,
  },
  {
    id: 11,
    name: "10点-11点",
    value: 14,
  },
  {
    id: 12,
    name: "11点-12点",
    value: 13,
  },
  {
    id: 13,
    name: "12点-13点",
    value: 12,
  },
  {
    id: 14,
    name: "13点-14点",
    value: 11,
  },
  {
    id: 15,
    name: "14点-15点",
    value: 10,
  },
  {
    id: 16,
    name: "15点-16点",
    value: 9,
  },
  {
    id: 17,
    name: "16点-17点",
    value: 8,
  },
  {
    id: 18,
    name: "17点-18点",
    value: 7,
  },
  {
    id: 19,
    name: "18点-19点",
    value: 6,
  },
  {
    id: 20,
    name: "19点-20点",
    value: 5,
  },
  {
    id: 21,
    name: "20点-21点",
    value: 4,
  },
  {
    id: 22,
    name: "21点-22点",
    value: 3,
  },
  {
    id: 23,
    name: "22点-23点",
    value: 2,
  },
  {
    id: 24,
    name: "23点-24点",
    value: 1,
  },
];
const dataMini10 = [
  {
    id: 1,
    name: "0点-1点",
    value: 33,
  },
  {
    id: 2,
    name: "1点-2点",
    value: 22,
  },
  {
    id: 3,
    name: "2点-3点",
    value: 12,
  },
  {
    id: 4,
    name: "3点-4点",
    value: 12,
  },
  {
    id: 5,
    name: "4点-5点",
    value: 12,
  },
  {
    id: 6,
    name: "5点-6点",
    value: 12,
  },
  {
    id: 7,
    name: "6点-7点",
    value: 33,
  },
  {
    id: 8,
    name: "7点-8点",
    value: 22,
  },
  {
    id: 9,
    name: "8点-9点",
    value: 12,
  },
  {
    id: 10,
    name: "9点-10点",
    value: 12,
  },
  {
    id: 11,
    name: "10点-11点",
    value: 12,
  },
  {
    id: 12,
    name: "11点-12点",
    value: 12,
  },
  {
    id: 13,
    name: "12点-13点",
    value: 33,
  },
  {
    id: 14,
    name: "13点-14点",
    value: 22,
  },
  {
    id: 15,
    name: "14点-15点",
    value: 12,
  },
  {
    id: 16,
    name: "15点-16点",
    value: 12,
  },
  {
    id: 17,
    name: "16点-17点",
    value: 12,
  },
  {
    id: 18,
    name: "17点-18点",
    value: 12,
  },
  {
    id: 19,
    name: "18点-19点",
    value: 33,
  },
  {
    id: 20,
    name: "19点-20点",
    value: 22,
  },
  {
    id: 21,
    name: "20点-21点",
    value: 12,
  },
  {
    id: 22,
    name: "21点-22点",
    value: 12,
  },
  {
    id: 23,
    name: "22点-23点",
    value: 12,
  },
  {
    id: 24,
    name: "23点-24点",
    value: 12,
  },
];
const data20 = [
  {
    id: 1,
    name: "闯红灯",
    value1: 33,
    value2: 10,
  },
  {
    id: 2,
    name: "越线",
    value1: 22,
    value2: 10,
  },
  {
    id: 3,
    name: "逆行",
    value1: 12,
    value2: 11,
  },
  {
    id: 4,
    name: "载人",
    value1: 12,
    value2: 7,
  },
  {
    id: 5,
    name: "未带头盔",
    value1: 12,
    value2: 6,
  },
  {
    id: 6,
    name: "安装伞具",
    value1: 12,
    value2: 33,
  },
];

var data50 = [
  {
    id: 1,
    name: "建安北路-西口",
    sum: 1,
  },
]; // 大图的原始数据

var data100 = [
  {
    id: 1,
    name: "",
    sum: 1,
  },
]; // 小图的原始数据

var data200 = [
  {
    ruleName: "逆行",
    upSum: 1,
    loSum: 1,
    contrastRatio: "0.00%",
  },
]; // 对比图原始数据

const weekOfday = moment().weekday(); // 计算今天是周几
const now = moment().locale("zh-cn").format("YYYY-MM-DD "); // 获取当天的日期
const rule_name = ["闯红灯", "越线", "伞具", "未带头盔", "载人", "逆行"];
export default {
  data() {
    return {
      totalNum: 113,
      redNum: 113,
      crossLineNum: 113,
      retrogradeNum: 113,
      moreNum: 113,
      noHelmetNum: 113,
      umbrellasNum: 113,
      toDoNum: "",
      chart1: null,
      chart2: null,
      ssCondition1: 0, // 今日0 或 本周1
      ssCondition2: 0, // 按路口1 或 按时间段0
      data1: data10, // 违法情况统计图表数据
      dataMini: dataMini10, // 违法情况详细分析
      data2: data20, // 违法情况详细分析
      dialogVisible: false,
      setDialogVisible: false,
      setFirstDialogVisible: false,
      radio: "1",
      contrastRatiosData: [-10, 10, 0, 11, -17, 10], // 对比率
      roadOptions: [], // 路口下拉框数据
      date1: [
        `${moment()
          .subtract(weekOfday + 6, "days")
          .format("YYYY-MM-DD")} 00:00:00`,
          `${moment().subtract(weekOfday, "days").format("YYYY-MM-DD")} 23:59:59`,
      ], // 上周一至上周日
      date2: [
        `${moment()
          .subtract(weekOfday - 1, "days")
          .format("YYYY-MM-DD")} 00:00:00`,
        moment().format("YYYY-MM-DD HH:mm:ss"),
      ], // 这周一至今天
      roadValue: undefined, // 所选路口

      datetime1: now + "00:00:00", // 当天传入开始时间
      datetime2: now + "23:59:59", // 当天传入结束时间
      classify: "1", // 分类 1是路口  0是时间段
      getStartTime: "", // 后端返回的开始时间
      getEndTime: "", // 后端返回的结束时间
      chartData1: null, // 大图的数据
      chartDataMini1: null, //小图的数据
      chartData2: null,
      dataArray: [], //详细数据
    };
  },

  mounted() {
    axios
      .post("/api/rule/search_screen", {
        startTime: now + "00:00:00",
        endTime: now + "23:59:59",
        screenType: parseInt(this.classify),
      })
      .then((res) => {
        this.getStartTime = res.data.startTime;
        this.getEndTime = res.data.endTime;

        this.getWd = res.data.screenInfo;

        data50 = this.getWd;

        this.chartData11(); // 大图数据
        // this.chartData22(); // 对比图数据
        this.renderChart1(); // 大图绘制方法
        // this.renderChart2(); // 绘制对比图方法

        this.drawSmallMap(); // 小图点击
      });




    axios
      .post("/api/rule/search-illegal-trend", {
        upStartTime: this.date1[0],
        upEndTime: this.date1[1],
        loStartTime: this.date2[0],
        loEndTime: this.date2[1],
        // intersection: this.roadValue,
      })
      .then((res) => {
  
        this.contrastData = res.data;
        data200 = this.contrastData;
    
    

data200.info.forEach(({ruleName,contrastRatio})=>{

  switch (ruleName) {
          case "逆行":
            this.contrastRatiosData[0] = contrastRatio;
            break;
          case "闯红灯":
            this.contrastRatiosData[1] = contrastRatio;
            break;
          case "越线":
           this.contrastRatiosData[2]= contrastRatio;
            break;
          case "载人":
          this.contrastRatiosData[3] = contrastRatio;
            break;
          case "伞具":
           this.contrastRatiosData[4] = contrastRatio;
            break;
          case "未带头盔":
           this.contrastRatiosData[5] = contrastRatio;
            break;

        }
})


        // this.chartData11(); // 大图数据
        this.chartData22(); // 对比图数据
        // this.renderChart1(); // 大图绘制方法
        this.renderChart2(); // 绘制对比图方法

        // this.drawSmallMap(); // 小图点击
      });

    axios
      .post("/api/crossings/search", {
        pageNo: 1,
        pageSize: 1000,
      })
      .then((res) => {
        // console.log(res.data)
        const { data = {} } = res;
        const { data: resData } = data;
        this.roadOptions = resData.map((item) => ({
          label: item.crossingName,
          value: item.crossingId,
        }));
  
        this.roadOptions.push({label:'全部',value:'-1'})
       
      }); // 路口数据

    this.chart1 = echarts.init(this.$refs.chart1);
    this.chart2 = echarts.init(this.$refs.chart2);
    // this.renderChart1();
    // this.renderChart2();

    // 渲染真实数据
    axios.get("/api/rule/search-illegal-list").then((res) => {
      const truthful = res.data;

      truthful.info.forEach(({ ruleName, sum }) => {
 
        switch (ruleName) {
          case "闯红灯":
            this.redNum = sum;
            break;
          case "越线":
            this.crossLineNum = sum;
            break;
          case "载人":
            this.moreNum = sum;
            break;
          case "伞具":
            this.umbrellasNum = sum;
            break;
          case "未带头盔":
            this.noHelmetNum = sum;
            break;
          case "逆行":
            this.retrogradeNum = sum;
            break;
          case "今日违法总数":
            this.totalNum = sum;
            break;
        }
      });
    });

    // 未处理数据
    axios.get("/api/rule/search-illegal-sum").then((res) => {

      this.toDoNum = res.data.sum;
    });
  },
  methods: {
    drawSmallMap() {
      this.chart1.on("click", (params) => {
        for (var i = 0; i < rule_name.length; i++) {
          //二维数组

          this.dataArray[i] = new Array();
        }

        data50.forEach(({ id, name, sum, intersectionInfo }) => {
          if (name === params.name) {
            data100 = intersectionInfo;
        

            this.chartDataMini11();
          }
        });

        this.dialogVisible = true;
        this.$nextTick(() => {
          echarts.init(this.$refs.miniChart).setOption({
            // 小图

            color: ["#38a7f0"],
            grid: {
              left: "38px",
              right: "38px",
              bottom: "0%",
              top: "10%",
              containLabel: true,
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999",
                },
              },
            },
            xAxis: [
              {
                type: "category",
                data: this.chartDataMini1.dataX,
                axisTick: {
                  show: false,
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
                name: "违法数",
                type: "value",
              },
            ],
            series: [
              {
                name: "闯红灯",
                type: "bar",
                stack: "总量",
                label: {
                  show: true,
                  position: "insideRight",
                },
                data: this.dataArray[0],
              },
              {
                name: "越线",
                type: "bar",
                stack: "总量",
                label: {
                  show: true,
                  position: "insideRight",
                },
                data: this.dataArray[1],
              },
              {
                name: "伞具",
                type: "bar",
                stack: "总量",
                label: {
                  show: true,
                  position: "insideRight",
                },
                data: this.dataArray[2],
              },
              {
                name: "未带头盔",
                type: "bar",
                stack: "总量",
                label: {
                  show: true,
                  position: "insideRight",
                },
                data: this.dataArray[3],
              },
              {
                name: "载人",
                type: "bar",
                stack: "总量",
                label: {
                  show: true,
                  position: "insideRight",
                },
                data: this.dataArray[4],
              },
              {
                name: "逆行",
                type: "bar",
                stack: "总量",
                label: {
                  show: true,
                  position: "insideRight",
                },
                data: this.dataArray[5],
              },
            ],
          });
        });
      });
    },
    chartData11() {
      this.getNumber = data50;

      let dataX = [];
      let dataY = [];
      let dataMap = new Map();

      let arr = this.getNumber.map((item) => ({ ...item }));
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (parseInt(arr[j].id) > parseInt(arr[j + 1].id)) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      } //按照id大小排序返回的数据

      arr.forEach(({ id, name, sum }) => {
        dataX.push(name);
        dataY.push(sum);
        dataMap.set(name, id);
      });

      this.chartData1 = {
        dataX,
        dataY,
        dataMap,
      };

    }, // 绘画大图的数据

    chartDataMini11() {
      let dataX = [];
      let dataY = [];

      let smallDataX = [];
      let smallDataY = [];

      this.getNumber1 = data100;

      this.getNumber1
        .map((item) => ({
          ...item,
        }))
        .forEach(({ id, name, sum, detailedInfo }) => {
 
          for (let i = 0; i < this.dataArray.length; i++) {
            this.dataArray[i].push("");
          }

          detailedInfo
            .map((item) => ({
              ...item,
            }))
            .forEach(({ ruleTypeName, sum }) => {
     
              smallDataX.push(ruleTypeName);
              smallDataY.push(sum);

              for (let i = 0; i < rule_name.length; i++) {
                if (rule_name[i] === ruleTypeName) {
                  this.dataArray[i].pop();
                  this.dataArray[i].push(sum);
                }
              }
            });

          dataX.push(name);
          dataY.push(sum);
        });

      this.chartDataMini1 = {
        dataX,
        dataY,
        smallDataX,
        smallDataY,
      };

    }, // 绘制小图的数据

    chartData22() {


      let dataX = [];
      let dataY1 = [];
      let dataY2 = [];
      // data20
      //   .map((item) => ({
      //     ...item,
      //     value1: (Math.random() * 10 + 1).toFixed(),
      //     value2: (Math.random() * 10 + 1).toFixed(),
      //   }))
      //   .forEach(({ id, name, value1, value2 }) => {
      //     dataX.push(name);
      //     dataY1.push(value1);
      //     dataY2.push(value2);
      //   });
      // this.chartData2 = {
      //   dataX,
      //   dataY1,
      //   dataY2,
      // };
       data200.info
        .map((item) => ({
          ...item,
        }))
       .forEach(({ ruleName, upSum, loSum, contrastRatio }) => {
        dataX.push(ruleName);
        dataY1.push(upSum);
        dataY2.push(loSum);
      });
      this.chartData2 = {
        dataX,
        dataY1,
        dataY2,
      };
 
      

      //    ruleName: "逆行",
      // upSum: 1,
      // loSum: 1,
      // contrastRatio: "0.00%",
    }, // 绘制对比图的数据

    renderChart1() {
      // 绘制大图表

      this.chart1.setOption({
        color: ["#38a7f0"],
        grid: {
          left: "38px",
          right: "38px",
          bottom: "0%",
          top: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        xAxis: [
          {
            type: "category",
            data: this.chartData1.dataX,
            axisTick: {
              show: false,
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
            name: "违法数据",
            type: "value",
          },
        ],
        series: [
          {
            name: "违法数",
            type: "bar",
            barWidth: "50%",
            legendHoverLink: true,
            label: {
              show: true,
              position: "top",
              color: "#333",
            },
            data: this.chartData1.dataY,
          },
        ],
      });
    },

    renderChart2() {
      // 绘制对比图表
      this.chart2.setOption({
        color: ["#3398DB", "#f60"],
        grid: {
          left: "38px",
          right: "38px",
          bottom: "0%",
          top: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["上期", "本期"],
          itemWidth: 14,
        },
        xAxis: [
          {
            type: "category",
            data: this.chartData2.dataX,
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            name: "违法数",
            type: "value",
          },
        ],
        series: [
          {
            name: "上期",
            type: "bar",
            barWidth: "20%",
            legendHoverLink: true,
            label: {
              show: true,
              position: "top",
              color: "#333",
            },
            data: this.chartData2.dataY1,
          },
          {
            name: "本期",
            type: "bar",
            barWidth: "20%",
            legendHoverLink: true,
            label: {
              show: true,
              position: "top",
              color: "#333",
            },
            data: this.chartData2.dataY2,
          },
        ],
      });
    },

    handleSet() {
      this.setDialogVisible = true;
    },
    handleSetFiest() {
      this.setFirstDialogVisible = true;
    },

    // 对比图数据按钮的方法
    handleSaveSet() {
      if (this.date1 === null) {
        this.$message.error("请选择上期时间");
        return;
      }
      if (this.date2  === null) {
        this.$message.error("请选择本期时间");
        return;
      }
      if (!(this.roadValue || this.roadValue === 0)) {
        this.$message.error("请选择路口");
        return;
      }


      this.setDialogVisible = false;

     if(this.roadValue === '全部'){
       this.roadValue = ''
     }
      axios
        .post("/api/rule/search-illegal-trend", {
          upStartTime: this.date1[0],
          upEndTime: this.date1[1],
          loStartTime: this.date2[0],
          loEndTime: this.date2[1],
          intersection: this.roadValue,
        })
        .then((res) => {
          const comparison = res.data;

          data200 = comparison;
     
          // this.getStartTime = res.data.startTime;
          // this.getEndTime = res.data.endTime;
          // this.saveDate = res.data.screenInfo;

          // data50 = this.saveDate;

          // this.chartData11(); // 大图数据

          // // this.chartDataMini11(); // 小图数据

          this.chartData22(); // 对比图数据

          // this.renderChart1(); // 大图绘制方法

          this.renderChart2(); // 绘制对比图方法

          // this.drawSmallMap(); // 小图的点击事件
        });

      // this.data2 = data20.map((item) => ({
      //   ...item,
      //   value1: (Math.random() * 10 + 1).toFixed(),
      //   value2: (Math.random() * 10 + 1).toFixed(),
      // }));
      // this.renderChart2(); // 绘制对比图方法
    },

    // 设置按钮的方法
    handleFirstSaveSet() {
      if (this.datetime1 === null) {
        this.$message.error("请选择开始时间");
        return;
      } else if (this.datetime2 === null) {
        this.$message.error("请选择结束时间");
        return;
      } else if (this.datetime1 && this.datetime2 != null) {
        this.setFirstDialogVisible = false;
        axios
          .post("/api/rule/search_screen", {
            startTime: this.datetime1,
            endTime: this.datetime2,
            screenType: parseInt(this.classify),
          })
          .then((res) => {
     
            this.getStartTime = res.data.startTime;
            this.getEndTime = res.data.endTime;
            this.saveDate = res.data.screenInfo;

            data50 = this.saveDate;

            this.chartData11(); // 大图数据

            // this.chartDataMini11(); // 小图数据

            this.chartData22(); // 对比图数据

            this.renderChart1(); // 大图绘制方法

            this.renderChart2(); // 绘制对比图方法

            this.drawSmallMap(); // 小图的点击事件
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  .tipDiv {
    display: flex;
    .tipBlock {
      border: 1px solid #bbb;
      padding: 10px;
      border-radius: 4px;
      margin-right: 10px;
      span {
        color: #f60;
      }
    }
  }
  .toDoDiv {
    padding: 8px 30px 8px 0;
    text-align: right;
    span {
      color: #f00;
    }
    a {
      color: #00f;
    }
  }
  .chart-div {
    .head {
      width: 100%;
      text-align: center;
      position: relative;
      height: 34px;
      font-size: 20px;
      margin-top: 20px;
      line-height: 34px;
      .search-buttons {
        position: absolute;
        right: 30px;
        top: -3px;
      }
    }
    .head-right {
      font-size: 16px;
      position: absolute;
      right: 250px;
      top: 20px;
    }
    .chart {
      width: 100%;
      height: 400px;
    }
    .contrast {
      display: flex;
      align-items: center;
      height: 40px;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      margin-right: 30px;
      border: 1px solid #333;
      .title {
        border-right: 1px solid #333;
        height: 40px;
        line-height: 40px;
        text-align: center;
        flex: 0 0 60px;
      }
      .number {
        border-right: 1px solid #333;
        height: 40px;
        line-height: 40px;
        text-align: center;
        flex: 1;
      }
      .last {
        border-right: none;
      }
      .positive_number {
        color: #f00;
      }
      .negative_number {
        color: #67c23a;
      }
      .zero_number {
        color: #333;
      }
    }
  }
}
.miniChart {
  width: 100%;
  height: 400px;
  margin-top: -30px;
}
.form-div {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .label {
    flex: 0 0 50px;
  }
}
</style>
