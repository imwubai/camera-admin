<template>
  <div class="app-container">
    <div class="tipDiv">
      <div class="tipBlock">今日违法总数 <span>{{ totalNum }}</span></div>
      <div class="tipBlock">闯红灯 <span>{{ redNum }}</span></div>
      <div class="tipBlock">越线 <span>{{ crossLineNum }}</span></div>
      <div class="tipBlock">逆行 <span>{{ retrogradeNum }}</span></div>
      <div class="tipBlock">一车多人 <span>{{ moreNum }}</span></div>
      <div class="tipBlock">无头盔 <span>{{ noHelmetNum }}</span></div>
      <div class="tipBlock">安装伞具 <span>{{ umbrellasNum }}</span></div>
    </div>
    <div class="toDoDiv">目前还有<span>{{toDoNum}}</span>条待处理，<router-link to="/check/index">进入处理</router-link></div>
  </div>
</template>

<script>
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
      toDoNum: 11
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    padding: 20px;
    .tipDiv{
      display: flex;
      .tipBlock{
        border: 1px solid #bbb;
        padding: 10px;
        border-radius: 4px;
        margin-right: 10px;
        span{
          color: #f60
        }
      }
    }
    .toDoDiv{
      padding: 8px 0 8px 590px;
      span{
        color: #f00;
      }
      a{
        color: #00f;
      }
    }
  }
</style>
