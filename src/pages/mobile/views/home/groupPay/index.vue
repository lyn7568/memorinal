<template>
  <div class="mian-con">
    <box gap="60px 0 10px">
      <button-tab v-model="curTab">
        <button-tab-item>统计</button-tab-item>
        <button-tab-item>记录</button-tab-item>
      </button-tab>
    </box>
    <template v-if="curTab===0">
      <div class="chart-wrapper" v-if ="sumCount">
        <pie-chart :pieData="pieData" :height="'400px'" :channel="true"></pie-chart>
      </div>
      <div v-else class="nodata">
        暂无缴费记录
      </div>
    </template>
    <v-scroll v-if="curTab===1" :onLoadMore="onLoadMore" :dataList="scrollData" :topVal="'110'">
      <div v-if="pojo && pojo.length">
        <div v-for="item in pojo" :key="item.index">
          <form-preview
            header-label="缴费金额"
            :header-value="'￥'+item.paycount"
            :body-items="[
              {
                label: '缴费类型',
                value: item.typeName || item.typeid
              },
              {
                label: '缴费人',
                value: item.payUserName || item.payuserid
              },
              {
                label: '平摊人',
                value: item.shareUserName || item.shareuserid
              },
              {
                label: '平摊金额',
                value: '￥'+ item.sharemoney || 0
              },
              {
                label: '缴费日期',
                value: item.paytime
              },
              {
                label: '备注',
                value: item.remark
              }
            ]"
            :footer-buttons="UID===item.payuserid?[
              {
                style: 'default',
                text: '删除',
                onButtonClick: () => {
                  deleteById(item.id)
                }
              },
              {
                style: 'primary',
                text: '修改',
                onButtonClick: () => {
                  $router.push({name:'editGroupPay',query:{id:item.id,gid: groupid}})
                }
              }
            ]:[]">
            </form-preview>
            <br/>
        </div>
      </div>
      <div v-else class="nodata">
        暂无缴费记录
      </div>
    </v-scroll>
    <div class="add-group" @click="$router.push({name:'editGroupPay',query: {gid: groupid}})">
      <svg-icon icon-class="add" />
    </div>
  </div>
</template>

<script>
import queryBase from '@/utils/queryBase'
import { strToArr, arrToStr } from '@/utils'
import { FormPreview, ButtonTab, ButtonTabItem } from "vux";
import paymoneyApi from "@/api/paymoney";
import { messageFun } from "@/utils/msg";
import VScroll from "@/components/ScrollMore";
import PieChart from '@/components/ECharts/PieChart'
export default {
  components: {
    FormPreview,
    ButtonTab,
    ButtonTabItem,
    VScroll,
    PieChart
  },
  data() {
    return {
      groupid: '',
      curTab: 0,
      scrollData:{
        noFlag: false,
        loading: false
      },
      pojo: [],
      searchPayuserid: '',
      searchTypeid: '',
      rangeTime: '',
      startTime: '',
      endTime: '',
      page: 1,
      size: 10,
      pieData: {
          topic: '当前群组缴费',
          subTopic: '本人均摊缴费： ￥0',
          sum: 0,
          tit: [],
          sData: []
      },
      sumCount:0
    };
  },
  computed: {
    userList() {
      return this.$store.getters.uListArrs 
    },
    typeList() {
      return this.$store.getters.typeArrs
    },
    UID() {
      return this.$store.getters.userid;
    }
  },
  created() {
    if (this.$route.query.id) {
        this.groupid = this.$route.query.id
        this.search()
        this.getGroupAllCosts()
    }
  },
  methods: {
    onLoadMore(done) {
      var that = this
      if (!that.scrollData.noFlag) {
        setTimeout(() => {
          that.page++;
          that.search()
          done();
        }, 10);
      }
    },
    async search() {
      let response = await paymoneyApi.findSearch({
        groupid: this.groupid,
        payuserid: this.searchPayuserid,
        typeid: this.searchTypeid,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page,
        size: this.size
      })
      if(response.flag && response.data) {
        const oj = response.data.rows
        if(oj.length > 0) {
          for (let i = 0; i < oj.length; ++i) {
            if (oj[i].typeid) {
              queryBase.getType(oj[i].typeid, function(sc, value) {
                if (sc) {
                  oj[i].typeName = value.typename
                }
              })
            }
            if (oj[i].payuserid) {
              queryBase.getUser(oj[i].payuserid, function(sc, value) {
                if (sc) {
                  oj[i].payUserName = value.username
                }
              })
            }
            if (oj[i].shareuserid) {
              var shareArr = strToArr(oj[i].shareuserid)
              var shareName = this.userList.map((lk, index) => {
                if (shareArr.indexOf(lk.id) > -1) {
                  return lk.username
                }
              }).filter(item => {
                if (item) {
                  return item
                }
              })
              oj[i].shareUserName = arrToStr(shareName)
            }
          }
          this.$nextTick(() => {
            this.pojo = this.pojo.concat(oj)
          })
          if (oj.length < this.size) {
            this.scrollData.noFlag = true
          }
        }
      }
      this.scrollData.loading = false
    },
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onConfirm : () => {
          paymoneyApi.deleteById(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    async getGroupAllCosts() {
      var titArr = []
      var arrObj = []
      paymoneyApi.findSumCount(this.groupid).then( response => {
          if (response.flag && response.data) {
              this.pieData.sum = response.data
              this.sumCount = response.data
          }
      })
      paymoneyApi.findSumCountShareByUser(this.groupid, this.UID).then( response => {
          if (response.flag && response.data) {
              this.pieData.subTopic = '本人均摊缴费： ￥' + response.data
          }
      })
      var typeList = this.typeList
      for (let i = 0; i < typeList.length; ++i) {
          let typeResult = await paymoneyApi.findSumCountByType(this.groupid,typeList[i].id)
          if (typeResult.flag && typeResult.data) {
              titArr.push(typeList[i].typename)
              let cur = {
                  value: typeResult.data || 0,
                  name: typeList[i].typename
              }
              arrObj.push(cur)
          }
      }
      this.$nextTick(() => {
        this.pieData.tit = titArr
        this.pieData.sData = arrObj
      })
    }
  }
};
</script>
