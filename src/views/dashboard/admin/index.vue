<template>
  <div class="dashboard-editor-container">

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group> -->

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row> -->

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :pieData="pieData"></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :pieData="pieDataOwner"></pie-chart>
        </div>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col> -->
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card></box-card>
      </el-col>
    </el-row> -->

  </div>
</template>


<script>
import typeApi from "@/api/type"
import paymoneyApi from "@/api/paymoney"

// import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    // PanelGroup,
    LineChart,
    // RaddarChart,
    PieChart,
    BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      pieData: {
        topic: '群组缴费',
        sum: 0,
        tit: [],
        sData: []
      },
      pieDataOwner: {
        topic: '个人缴费',
        sum: 0,
        tit: [],
        sData: []
      }
    }
  },
  computed: {
    UID() {
      return this.$store.getters.userid
    },
    typeList() {
      return this.$store.getters.typeArrs
    }
  },
  created() {
    this.getGroupAllCosts()
    this.getOwnerAllCosts()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    async getGroupAllCosts() {
      var titArr = []
      var arrObj = []
      paymoneyApi.findSumCount().then( response => {
          this.pieData.sum = response.data
      })
      var typeList = this.typeList
      for (let i = 0; i < typeList.length; ++i) {
        titArr.push(typeList[i].typename)
        let typeResult = await paymoneyApi.findSumCountByType(typeList[i].id)
        if (typeResult.flag) {
          let cur = {
            value: typeResult.data || 0,
            name: typeList[i].typename
          }
          arrObj.push(cur)
        }
      }
      this.pieData.tit = titArr
      this.pieData.sData = arrObj
    },
    async getOwnerAllCosts() {
      var titArr = []
      var arrObjOwner = []
      paymoneyApi.findSumCountOwner(this.UID).then( response => {
          this.pieDataOwner.sum = response.data
      })
      var typeList = this.typeList
      for (let i = 0; i < typeList.length; ++i) {
        titArr.push(typeList[i].typename)
        let typeResultOwner = await paymoneyApi.findSumCountByTypeOwner(this.UID, typeList[i].id)
        if (typeResultOwner.flag) {
          let curO = {
            value: typeResultOwner.data || 0,
            name: typeList[i].typename
          }
          arrObjOwner.push(curO)
        }
      }
      this.pieDataOwner.tit = titArr
      this.pieDataOwner.sData = arrObjOwner
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
