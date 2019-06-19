<template>
  <div>
    <el-row :gutter="16" v-if="pojo && pojo.length">
      <el-col :xs="12" :sm="8" :lg="8" v-for="item in pojo" :key="item.index">
        <el-card shadow="always" @click.native="clickCurGroup(item)" style="margin: 8px 0">
            {{item.groupname}}
        </el-card>
      </el-col>
    </el-row>
    <div v-else style="font-size:13px;text-align:center;line-height:100px;color: #999">暂无群组数据</div>
  </div>
</template>

<script>
import userApi from "@/api/user"

export default {
    data() {
        return {
            pojo:{}
        }
    },
    computed: {
        UID() {
            return this.$store.getters.userid
        }
    },
    created() {
        this.findAllGroup()
    },
    methods: {
        findAllGroup() {
            userApi.findAllGroup(this.UID).then(response => {
                this.pojo = response.data;
            })
        },
        clickCurGroup(val) {
            sessionStorage.setItem('GROUPName', val.groupname)
            this.$router.push({
                name: 'groupItem',
                query: {
                    id: val.id
                }
            })
        }
    }
}
</script>

<style scoped>
    .el-card{
        cursor: pointer;
    }
</style>

