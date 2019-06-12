<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <!--<el-form-item label="缴费类型">
                <el-select v-model="searchMap.typeid" placeholder="请选择">
                    <el-option v-for="item in typeList" :key="item.id"
                               :label="item.typename" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择缴费时间">
                <el-date-picker v-model="searchMap.createtime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
             <el-form-item >
                <el-button type="primary" @click="search()">查询</el-button>
            </el-form-item>-->
            
            <el-form-item >
                <el-button type="primary" @click="dialogFormVisible = true;pojo={};id=null">新增</el-button>
            </el-form-item>
            <el-form-item >
                总金额: {{sumCount}}
            </el-form-item>
        </el-form>
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="缴费id" with="450"></el-table-column>
            <el-table-column prop="typename" label="缴费类型" with="50"></el-table-column>
            <el-table-column prop="paycount" label="缴费金额" with="50"></el-table-column>
            <el-table-column prop="payusername" label="缴费人姓名" with="50"></el-table-column>
            <el-table-column prop="createtime" label="缴费时间" with="280"></el-table-column>
            <el-table-column prop="remark" label="缴费备注" with="180"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="findById(scope.row.id)" type="text" size="small">修改</el-button>
                    <el-button @click="deleteById(scope.row.id)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="currentPageSize" @current-change="search"
                    :current-page.sync="page" :page-sizes="[5, 10, 20, 30]"
                    :page-size="size" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>

        <el-dialog title="新增缴费" :visible.sync="dialogFormVisible">
        <el-form label-width="100px">
            <el-form-item label="选择缴费类型" >
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
            <el-form-item label="选择缴费人" >
                <el-select v-model="pojo.payuserid" placeholder="请选择">
                    <!--v-for: 循环迭代 
                        :label : 对应的数据里存放城市的属性名称,这里是name
                        :value : 存放城市的id
                        :key : 也是对应的id
                    -->
                    <el-option v-for="item in userList" :key="item.id"
                                :label="item.username" :value="item.id">
                    </el-option>
                </el-select>
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
import typeApi from "@/api/type"
import userApi from "@/api/user"

export default {
    data() {
        return {
            list:null,
            searchMap:{},
            typeList :null,
            userList:null,
            moneyList:null,
            dialogFormVisible :false,
            pojo:{},
            id:null,
            page:1,
            size:10,
            total:0,
            sumCount:null
        }
    },
    created() {
        this.search()
        this.fetchTypeList()
        this.fetchUserList()
        this.findSumCount()
    },
    methods: {
        fetchData() {
            paymoneyApi.getList().then(response => {
                this.list = response.data;
            })
        },
        fetchTypeList() {
            typeApi.getList().then(response => {
                this.typeList = response.data;
            })
        },
        fetchUserList() {
            userApi.getList().then(response => {
                this.userList = response.data;
            })
        },
        //保存新增活动
        saveOrUpdate() {
            paymoneyApi.saveOrUpdate(this.id,this.pojo).then( response => {
                this.$message({
                    showClose: true,
                    message: response.message,
                    type: response.flag?'success':'error'
                });
                //保存成功(flag=true),关闭弹出框,并刷新列表
                if(response.flag){
                    this.dialogFormVisible = false  //关闭弹出框
                    this.search()              //再次加载活动列表
                }
            })       
        },
        findById(id) {
            this.id = id;
            paymoneyApi.findById(id).then(response => {
                this.pojo = response.data;
                this.dialogFormVisible = true
            })
        },
        //根据id删除活动
        deleteById(id) {
            this.$confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {  //点击确定,进入then()方法,删除活动
                paymoneyApi.deleteById(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search() ;    //如果删除执行成功,重新加载页面
                    }
                })  
            })  
        },
         //分页查询的方法
        search() {
            paymoneyApi.search(this.page,this.size).then( response => {
                this.list = response.data.rows //获取列表数据
                //console.log(response.data.rows)
                this.total = response.data.total
            })
        },
        currentPageSize(val){
            this.size = val
            this.search()
        },
        findSumCount() {
            paymoneyApi.findSumCount().then( response => {
                this.sumCount = response.data;
            })
        },  
    }
}
</script>

