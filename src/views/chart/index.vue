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
        一车多人 <span>{{ moreNum }}</span>
      </div>
      <div class="tipBlock">
        无头盔 <span>{{ noHelmetNum }}</span>
      </div>
      <div class="tipBlock">
        安装伞具 <span>{{ umbrellasNum }}</span>
      </div>
    </div>
    <div class="toDoDiv">
      目前还有<span>{{ toDoNum }}</span>条待处理，<router-link to="/check/index">进入处理</router-link>
    </div>
    <div class="chart-div">
      <div class="head">
        违法情况统计
        <div class="search-buttons">
          <el-button
            size="mini"
            :type="ssCondition1 === 0 ? 'primary' : ''"
            @click="handleChangeCondition('ssCondition1', 0)"
          >今日</el-button>
          <el-button
            size="mini"
            :type="ssCondition1 === 1 ? 'primary' : ''"
            @click="handleChangeCondition('ssCondition1', 1)"
          >本周</el-button>
          <el-button
            size="mini"
            :type="ssCondition2 === 0 ? 'primary' : ''"
            @click="handleChangeCondition('ssCondition2', 0)"
          >按路口</el-button>
          <el-button
            size="mini"
            :type="ssCondition2 === 1 ? 'primary' : ''"
            @click="handleChangeCondition('ssCondition2', 1)"
          >按时间段</el-button>
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
          v-for="(item, index) in contrastRatios"
          :key="index"
          :class="{
            number: true,
            positive_number: item > 0,
            negative_number: item < 0,
            zero_number: item === 0,
            last: index === contrastRatios.length - 1,
          }"
        >
          {{ item }}%
        </div>
      </div>
    </div>
    <el-dialog
      title="违法情况详细分析"
      :visible.sync="dialogVisible"
      width="600px"
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
        <span class="label">上期：</span><el-date-picker
          v-model="date1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="form-div">
        <span class="label">本期：</span><el-date-picker
          v-model="date2"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div class="form-div">
        <span class="label">路口：</span><el-select v-model="roadValue" filterable="" style="width: 100%" placeholder="请选择">
          <el-option
            v-for="item in roadOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveSet">保存</el-button>
        <el-button @click="setDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
import axios from '@/utils/request'

const data10 = [
  {
    id: 1,
    name: '路口A',
    value: 33
  },
  {
    id: 2,
    name: '路口B',
    value: 22
  },
  {
    id: 3,
    name: '路口C',
    value: 12
  },
  {
    id: 4,
    name: '路口D',
    value: 12
  },
  {
    id: 5,
    name: '路口E',
    value: 12
  },
  {
    id: 6,
    name: '路口F',
    value: 12
  },
  {
    id: 7,
    name: '路口G',
    value: 12
  },
  {
    id: 8,
    name: '路口H',
    value: 12
  },
  {
    id: 9,
    name: '路口I',
    value: 12
  },
  {
    id: 10,
    name: '路口J',
    value: 12
  },
  {
    id: 11,
    name: '路口K',
    value: 12
  },
  {
    id: 12,
    name: '路口L',
    value: 12
  },
  {
    id: 13,
    name: '路口M',
    value: 12
  },
  {
    id: 14,
    name: '路口N',
    value: 12
  }
]
const data11 = [
  {
    id: 1,
    name: '0点-1点',
    value: 24
  },
  {
    id: 2,
    name: '1点-2点',
    value: 23
  },
  {
    id: 3,
    name: '2点-3点',
    value: 22
  },
  {
    id: 4,
    name: '3点-4点',
    value: 21
  },
  {
    id: 5,
    name: '4点-5点',
    value: 20
  },
  {
    id: 6,
    name: '5点-6点',
    value: 19
  },
  {
    id: 7,
    name: '6点-7点',
    value: 18
  },
  {
    id: 8,
    name: '7点-8点',
    value: 17
  },
  {
    id: 9,
    name: '8点-9点',
    value: 16
  },
  {
    id: 10,
    name: '9点-10点',
    value: 15
  },
  {
    id: 11,
    name: '10点-11点',
    value: 14
  },
  {
    id: 12,
    name: '11点-12点',
    value: 13
  },
  {
    id: 13,
    name: '12点-13点',
    value: 12
  },
  {
    id: 14,
    name: '13点-14点',
    value: 11
  },
  {
    id: 15,
    name: '14点-15点',
    value: 10
  },
  {
    id: 16,
    name: '15点-16点',
    value: 9
  },
  {
    id: 17,
    name: '16点-17点',
    value: 8
  },
  {
    id: 18,
    name: '17点-18点',
    value: 7
  },
  {
    id: 19,
    name: '18点-19点',
    value: 6
  },
  {
    id: 20,
    name: '19点-20点',
    value: 5
  },
  {
    id: 21,
    name: '20点-21点',
    value: 4
  },
  {
    id: 22,
    name: '21点-22点',
    value: 3
  },
  {
    id: 23,
    name: '22点-23点',
    value: 2
  },
  {
    id: 24,
    name: '23点-24点',
    value: 1
  }
]
const dataMini10 = [
  {
    id: 1,
    name: '闯红灯',
    value: 33
  },
  {
    id: 2,
    name: '越线',
    value: 22
  },
  {
    id: 3,
    name: '逆行',
    value: 12
  },
  {
    id: 4,
    name: '一车多人',
    value: 12
  },
  {
    id: 5,
    name: '无头盔',
    value: 12
  },
  {
    id: 6,
    name: '安装伞具',
    value: 12
  }
]
const data20 = [
  {
    id: 1,
    name: '闯红灯',
    value1: 33,
    value2: 10
  },
  {
    id: 2,
    name: '越线',
    value1: 22,
    value2: 10
  },
  {
    id: 3,
    name: '逆行',
    value1: 12,
    value2: 11
  },
  {
    id: 4,
    name: '一车多人',
    value1: 12,
    value2: 7
  },
  {
    id: 5,
    name: '无头盔',
    value1: 12,
    value2: 6
  },
  {
    id: 6,
    name: '安装伞具',
    value1: 12,
    value2: 33
  }
]

const weekOfday = moment().weekday() // 计算今天是周几

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
      toDoNum: 11,
      chart1: null,
      chart2: null,
      ssCondition1: 0, // 今日0 或 本周1
      ssCondition2: 0, // 按路口0 或 按时间段1
      data1: data10, // 违法情况统计图表数据
      dataMini: dataMini10, // 违法情况详细分析
      data2: data20, // 违法情况详细分析
      dialogVisible: false,
      setDialogVisible: false,
      contrastRatios: [-10, 10, 0, 11, -17, 10], // 对比率
      roadOptions: [], // 路口下拉框数据
      date1: [`${moment().subtract(weekOfday + 6, 'days').format('YYYY-MM-DD')} 00:00:00`, `${moment().subtract(weekOfday, 'days').format('YYYY-MM-DD')} 23:59:59`], // 上周一至上周日
      date2: [`${moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')} 00:00:00`, moment().format('YYYY-MM-DD HH:mm:ss')], // 这周一至今天
      roadValue: undefined // 所选路口
    }
  },
  computed: {
    chartData1() {
      const dataX = []
      const dataY = []
      const dataMap = new Map()
      this.data1.map(item => ({
        ...item,
        value: (Math.random() * 10 + 1).toFixed()
      })).forEach(({ id, name, value }) => {
        dataX.push(name)
        dataY.push(value)
        dataMap.set(name, id)
      })
      return {
        dataX,
        dataY,
        dataMap
      }
    },
    chartDataMini() {
      const dataX = []
      const dataY = []
      this.dataMini.map(item => ({
        ...item,
        value: (Math.random() * 10 + 1).toFixed()
      })).forEach(({ id, name, value }) => {
        dataX.push(name)
        dataY.push(value)
      })
      return {
        dataX,
        dataY
      }
    },
    chartData2() {
      const dataX = []
      const dataY1 = []
      const dataY2 = []
      this.data2.map(item => ({
        ...item,
        value1: (Math.random() * 10 + 1).toFixed(),
        value2: (Math.random() * 10 + 1).toFixed()
      })).forEach(({ id, name, value1, value2 }) => {
        dataX.push(name)
        dataY1.push(value1)
        dataY2.push(value2)
      })
      return {
        dataX,
        dataY1,
        dataY2
      }
    }
  },
  watch: {
    ssCondition1() {
      if (this.ssCondition1 === 0) { // 本周
        this.data1 = this.ssCondition2 === 0 ? data10.map(item => ({
          ...item,
          value1: (Math.random() * 10 + 1).toFixed(),
          value2: (Math.random() * 10 + 1).toFixed()
        })) : data11.map(item => ({
          ...item,
          value1: (Math.random() * 10 + 1).toFixed(),
          value2: (Math.random() * 10 + 1).toFixed()
        }))
      } else { // 本周
        this.data1 = this.ssCondition2 === 0 ? data10.map(item => ({
          ...item,
          value1: (Math.random() * 10 + 1).toFixed(),
          value2: (Math.random() * 10 + 1).toFixed()
        })) : data11.map(item => ({
          ...item,
          value1: (Math.random() * 10 + 1).toFixed(),
          value2: (Math.random() * 10 + 1).toFixed()
        }))
      }
      this.renderChart1()
    },
    ssCondition2() {
      if (this.ssCondition2 === 0) { // 按路口
        this.data1 = data10.map(item => ({
          ...item,
          value1: (Math.random() * 10 + 1).toFixed(),
          value2: (Math.random() * 10 + 1).toFixed()
        }))
      } else { // 按时间
        this.data1 = data11.map(item => ({
          ...item,
          value1: (Math.random() * 10 + 1).toFixed(),
          value2: (Math.random() * 10 + 1).toFixed()
        }))
      }
      this.renderChart1()
    }
  },
  mounted() {
    axios.post('/api/crossings/search', {
      pageNo: 1,
      pageSize: 1000
    }).then(res => {
      const { data = {}} = res
      const { data: resData } = data
      this.roadOptions = resData.map(item => ({
        label: item.crossingName,
        value: item.crossingId
      }))
    })
    this.chart1 = echarts.init(this.$refs.chart1)
    this.chart2 = echarts.init(this.$refs.chart2)
    this.renderChart1()
    this.renderChart2()
    this.chart1.on('click', (params) => {
      this.dialogVisible = true
      this.$nextTick(() => {
        echarts.init(this.$refs.miniChart).setOption({
          color: ['#3398DB'],
          grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '10%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              data: this.chartDataMini.dataX,
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0
              }
            }
          ],
          yAxis: [
            {
              name: '违法数',
              type: 'value'
            }
          ],
          series: [
            {
              name: '违法数',
              type: 'bar',
              barWidth: '50%',
              legendHoverLink: true,
              label: {
                show: true,
                position: 'top',
                color: '#333'
              },
              data: this.chartDataMini.dataY
            }
          ]
        })
      })
    })
  },
  methods: {
    renderChart1() {
      // 绘制图表
      this.chart1.setOption({
        color: ['#3398DB'],
        grid: {
          left: '38px',
          right: '38px',
          bottom: '0%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData1.dataX,
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              verticalAlign: 'top'
            }
          }
        ],
        yAxis: [
          {
            name: '违法数',
            type: 'value'
          }
        ],
        series: [
          {
            name: '违法数',
            type: 'bar',
            barWidth: '50%',
            legendHoverLink: true,
            label: {
              show: true,
              position: 'top',
              color: '#333'
            },
            data: this.chartData1.dataY
          }
        ]
      })
    },
    renderChart2() {
      // 绘制图表
      this.chart2.setOption({
        color: ['#3398DB', '#f60'],
        grid: {
          left: '38px',
          right: '38px',
          bottom: '0%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['上期', '本期'],
          itemWidth: 14
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData2.dataX,
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            name: '违法数',
            type: 'value'
          }
        ],
        series: [
          {
            name: '上期',
            type: 'bar',
            barWidth: '20%',
            legendHoverLink: true,
            label: {
              show: true,
              position: 'top',
              color: '#333'
            },
            data: this.chartData2.dataY1
          },
          {
            name: '本期',
            type: 'bar',
            barWidth: '20%',
            legendHoverLink: true,
            label: {
              show: true,
              position: 'top',
              color: '#333'
            },
            data: this.chartData2.dataY2
          }
        ]
      })
    },
    handleChangeCondition(key, value) {
      if (this[key] !== value) {
        this[key] = value
        this.renderChart1()
      }
    },
    handleSet() {
      this.setDialogVisible = true
    },
    handleSaveSet() {
      if (this.data1 && this.data1.length === 0) {
        this.$message.error('请选择上期时间')
        return
      }
      if (this.data2 && this.data2.length === 0) {
        this.$message.error('请选择本期时间')
        return
      }
      if (!(this.roadValue || this.roadValue === 0)) {
        this.$message.error('请选择路口')
        return
      }
      console.log(this.date1, this.date2, this.roadValue)
      this.data2 = data20.map(item => ({
        ...item,
        value1: (Math.random() * 10 + 1).toFixed(),
        value2: (Math.random() * 10 + 1).toFixed()
      }))
      this.renderChart2()
      this.setDialogVisible = false
    }
  }
}
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
.form-div{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .label{
    flex: 0 0 50px;
  }
}
</style>
