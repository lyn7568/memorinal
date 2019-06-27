<template>
  <box>
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
      暂无个人缴费记录
    </div>
    <div class="add-group" @click="$router.push({name:'editOwnerPay'})">
      <svg-icon icon-class="add" />
    </div>
  </box>
</template>

<script>
import { FormPreview } from "vux";
import paymoneyApi from "@/api/paymoney";
import { messageFun } from "@/utils/msg";

export default {
  components: {
    FormPreview
  },
  data() {
    return {
      pojo: null,
      searchTypeid: '',
      rangeTime: '',
      startTime: '',
      endTime: '',
      page: 1,
      size: 10
    };
  },
  computed: {
    UID() {
      return this.$store.getters.userid;
    }
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      paymoneyApi.searchOwner({
        userid: this.UID,
        typeid: this.searchTypeid,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page,
        size: this.size
      }).then( response => {
          this.pojo = response.data.rows
          this.total = response.data.total
      })
    },
    deleteById(id) {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要删除吗?',
        onConfirm : () => {
          groupApi.deleteByIdOwner(id).then(response => {
            messageFun(response)
            if (response.flag) {
              this.search();
            }
          })
        }
      })
    }
  }
};
</script>
