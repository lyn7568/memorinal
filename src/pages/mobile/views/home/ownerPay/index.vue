<template>
  <div>
    <box gap="10px 0">
      <button-tab v-model="curTab">
        <button-tab-item>统计</button-tab-item>
        <button-tab-item>记录</button-tab-item>
      </button-tab>
    </box>
    <template v-if="curTab===0">
      <div class="chart-wrapper" v-if ="sumCount">
        <pie-chart :pieData="pieDataOwner" :height="'400px'" :channel="true"></pie-chart>
      </div>
      <div v-else class="nodata">
        暂无缴费记录
      </div>
    </template>
    <v-scroll v-if="curTab===1" :onLoadMore="onLoadMore" :dataList="scrollData" :topVal="'140'">
      <div v-if="pojo && pojo.length">
        <div v-for="item in pojo" :key="item.index">
          <form-preview
            header-label="缴费金额"
            :header-value="'￥'+item.paycount"
            :body-items="[
              {
                label: '缴费类型',
                value: item.typeid
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
            :footer-buttons="[
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
                  $router.push({name:'editOwnerPay',query:{id:item.id}})
                }
              }
            ]">
            </form-preview>
            <br/>
        </div>
      </div>
      <div v-else class="nodata">
        暂无缴费记录
      </div>
    </v-scroll>
    <div class="add-group" @click="$router.push({name:'editOwnerPay'})">
      <svg-icon icon-class="add" />
    </div>
  </div>
</template>

<script>
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
      curTab: 0,
      scrollData:{
        noFlag: false,
        loading: false
      },
      pojo: [],
      searchTypeid: '',
      rangeTime: '',
      startTime: '',
      endTime: '',
      page: 1,
      size: 10,
      pieDataOwner: {
          topic: '个人缴费',
          sum: 0,
          tit: [],
          sData: []
      },
      sumCount:0
    };
  },
  computed: {
    typeList() {
      return this.$store.getters.typeArrs
    },
    UID() {
      return this.$store.getters.userid;
    }
  },
  created() {
    this.search();
    this.getOwnerAllCosts()
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
    search() {
      paymoneyApi.searchOwner({
        userid: this.UID,
        typeid: this.searchTypeid,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page,
        size: this.size
      }).then( response => {
        if(response.flag && response.data) {
          const oj = response.data.rows
          if(oj.length > 0) {
            this.$nextTick(() => {
              this.pojo = this.pojo.concat(oj)
            })
            if (oj.length < this.size) {
              this.scrollData.noFlag = true
            }
          }
        }
        this.scrollData.loading = false
      })
    },
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onConfirm : () => {
          paymoneyApi.deleteByIdOwner(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    },
    async getOwnerAllCosts() {
        var titArr = []
        var arrObjOwner = []
        paymoneyApi.findSumCountOwner(this.UID).then( response => {
            if (response.flag && response.data) {
                this.pieDataOwner.sum = response.data
                this.sumCount = response.data
            }
        })
        var typeList = this.typeList
        for (let i = 0; i < typeList.length; ++i) {
            let typeResultOwner = await paymoneyApi.findSumCountByTypeOwner(this.UID, typeList[i].id)
            if (typeResultOwner.flag && typeResultOwner.data) {
                titArr.push(typeList[i].typename)
                let curO = {
                    value: typeResultOwner.data || 0,
                    name: typeList[i].typename
                }
                arrObjOwner.push(curO)
            }
        }
        this.$nextTick(() => {
          this.pieDataOwner.tit = titArr
          this.pieDataOwner.sData = arrObjOwner
        })
    }
  }
};
</script>
