<template>
    <div>
        <div class="chart-wrapper" v-if ="sumCount">
          <pie-chart :pieData="pieDataOwner"></pie-chart>
        </div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-select clearable v-model="searchTypeid" placeholder="请选择缴费类型">
                    <el-option v-for="item in typeList" :key="item.id"
                               :label="item.typename" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker clearable
                    v-model="rangeTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="changeFun">
                </el-date-picker>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="search()">查询</el-button>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="dialogFormVisible = true;pojo={};id=null">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list">
            <el-table-column prop="typeid" label="缴费类型">
                <template slot-scope="scope">
                    {{scope.row.typeid | typeInfo}}
                </template>
            </el-table-column>
            <el-table-column prop="paycount" label="缴费金额"></el-table-column>
            <!-- <el-table-column prop="userid" label="缴费人">
                <template slot-scope="scope">
                    {{scope.row.userid | uInfo}}
                </template>
            </el-table-column> -->
            <el-table-column prop="paytime" label="缴费日期"></el-table-column>
            <el-table-column prop="remark" label="缴费备注"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-button @click="findById(scope.row.id)" type="primary" size="mini">修改</el-button>
                    <el-button @click="deleteById(scope.row.id)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="currentPageSize" @current-change="search"
                    :current-page.sync="page" :page-sizes="[5, 10, 20, 30]"
                    :page-size="size" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>

        <el-dialog title="新增缴费" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form label-width="100px">
            <el-form-item label="缴费类型" >
                <el-select v-model="pojo.typeid" placeholder="请选择">
                    <!--v-for: 循环迭代 
                        :label : 对应的数据里存放城市的属性名称,这里是name
                        :value : 存放城市的id
                        :key : 也是对应的id
                    -->
                    <el-option v-for="item in typeList" :key="item.id"
                                :label="item.typename" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="缴费日期" >
                <el-date-picker
                    v-model="pojo.paytime"
                    type="date"
                    :editable="false"
                    placeholder="选择缴费日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="缴费金额" >
                <el-input v-model="pojo.paycount" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" >
                <el-input v-model="pojo.remark" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import paymoneyApi from "@/api/paymoney"
import PieChart from '@/components/ECharts/PieChart'

export default {
    data() {
        return {
            pieDataOwner: {
                topic: '个人缴费',
                sum: 0,
                tit: [],
                sData: []
            },
            list:null,
            searchTypeid: '',
            rangeTime: '',
            startTime: '',
            endTime: '',
            moneyList:null,
            dialogFormVisible :false,
            pojo:{},
            id:null,
            page:1,
            size:10,
            total:0,
            sumCount:0
        }
    },
    components: {
        PieChart
    },
    computed: {
        userList() {
           return this.$store.getters.uListArrs 
        },
        typeList() {
           return this.$store.getters.typeArrs
        },
        UID() {
            return this.$store.getters.userid
        },
        roles() {
            return this.$store.getters.roles
        }
    },
    created() {
        this.search()
        this.getOwnerAllCosts()
    },
    methods: {
        changeFun(val) {
            if (val) {
                this.startTime = val[0]
                this.endTime = val[1]
            }
        },
        //保存新增活动
        saveOrUpdate() {
            this.pojo.userid = this.UID
            paymoneyApi.saveOrUpdateOwner(this.id,this.pojo).then( response => {
                this.$message({
                    showClose: true,
                    message: response.message,
                    type: response.flag?'success':'error'
                });
                //保存成功(flag=true),关闭弹出框,并刷新列表
                if(response.flag){
                    this.dialogFormVisible = false  //关闭弹出框
                    this.search()
                    this.getOwnerAllCosts()
                }
            })       
        },
        findById(id) {
            this.id = id;
            paymoneyApi.findByIdOwner(id).then(response => {
                this.pojo = response.data;
                this.dialogFormVisible = true
            })
        },
        //根据id删除活动
        deleteById(id) {
            this.$confirm('确定要删除吗?', '提示', {
            type: 'warning'
            }).then(() => {  //点击确定,进入then()方法,删除活动
                paymoneyApi.deleteByIdOwner(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search()
                        this.getOwnerAllCosts()
                    }
                })  
            })  
        },
         //分页查询的方法
        search() {
            paymoneyApi.searchOwner({
              userid: this.UID,
              typeid: this.searchTypeid,
              startTime: this.startTime,
              endTime: this.endTime,
              page: this.page,
              size: this.size
            }).then( response => {
                this.list = response.data.rows //获取列表数据
                //console.log(response.data.rows)
                this.total = response.data.total
            })
        },
        currentPageSize(val){
            this.size = val
            this.search()
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
            this.pieDataOwner.tit = titArr
            this.pieDataOwner.sData = arrObjOwner
        }
    }
}
</script>

<style scoped>
    .chart-wrapper{
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
    }
</style>
