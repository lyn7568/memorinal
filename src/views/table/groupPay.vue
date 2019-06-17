<template>
    <el-row :gutter="16">
      <el-col :xs="12" :sm="8" :lg="8" v-for="item in pojo" :key="item.index">
        <el-card shadow="always" @click.native="clickCurGroup(item.id)" style="margin: 8px 0">
            {{item.groupname}}
        </el-card>
      </el-col>
    </el-row>
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
        clickCurGroup(id) {
            this.$router.push({
                name: 'groupItem',
                query: {
                    id: id
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

