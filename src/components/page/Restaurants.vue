<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i>餐管列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="create" class="handle-del mr10" @click="handleCreate">新增餐馆</el-button>
                <el-input v-model="select_word" placeholder="输入筛选词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search">搜索</el-button>
            </div>
            <el-table :data="data" border stripe class="table" ref="multipleTable" height="540">
                <el-table-column prop="id" label="餐馆ID" sortable width="100">
                </el-table-column>
                <el-table-column prop="name" label="餐馆名称" sortable width="120">
                </el-table-column>
                <el-table-column prop="introduction" label="餐馆介绍">
                </el-table-column>
                <el-table-column prop="opening_time" label="营业时间">
                </el-table-column>
                <el-table-column prop="address" label="地址">
                </el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-menu" @click="jumpToManagement(scope.row)">餐厅管理</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="jumpToOrder(scope.row)">订单管理</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 创建弹出框 -->
        <el-dialog title="创建餐馆" :visible.sync="createVisible" width="30%">
            <el-form ref="createForm" :model="createForm" :rules="rules" label-width="120px">
                <el-form-item prop="name" label="餐馆名称">
                    <el-input v-model="createForm.name" placeholder="请输入餐馆名称"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="餐馆介绍">
                    <el-input type="textarea" :row="2" v-model="createForm.introduction" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="opening_time" label="营业时间">
                    <el-input v-model="createForm.opening_time" placeholder="请输入营业时间"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="地址">
                    <el-input v-model="createForm.address" placeholder="请输入餐馆地址"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCreate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Restaurant",
        data() {
            return {
                url: '',
                tableData: [],
                select_word: '',
                is_search: false,
                createVisible: false,
                delVisible: false,
                createForm: {
                    name: '',
                    introduction: '',
                    opening_time: '',
                    address: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入餐馆名', trigger: 'blur'},
                        {maxLength: 32, message: '名称不超过32个字符', trigger: 'blur'}
                    ],
                    introduction: [
                        {required: true, message: '请输入餐馆介绍', trigger: 'blur'},
                        {maxLength: 128, message: '介绍不超过128个字符', trigger: 'blur'}
                    ],
                    opening_time: [
                        {required: true, message: '请输入营业时间', trigger: 'blur'},
                        {maxLength: 32, message: '营业时间不超过32个字符', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入地址', trigger: 'blur'},
                        {maxLength: 64, message: '地址不超过32个字符', trigger: 'blur'}
                    ],
                },
                idx: -1,
                delRow: null
            }
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    if ((d.name.indexOf(this.select_word) > -1 || d.address.indexOf(this.select_word) > -1)) {
                        return d;
                    }
                })
            }
        },
        methods: {
            search() {
                this.is_search = true;
            },
            handleCreate() {
                this.createForm = {
                    name: '',
                    introduction: '',
                    opening_time: '',
                    address: ''
                };
                this.createVisible = true;
            },
            getData() {
                this.url = '/api/seller/restaurants';
                this.$axios.get(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.tableData = res.data.restaurants
                }).catch(err => {
                    console.log(err.message)
                })
            },
            saveCreate() {
                this.$refs['createForm'].validate((valid) => {
                    if (valid) {
                        this.url = '/api/seller/restaurants';
                        this.$axios.post(this.url, {
                            name: this.createForm.name,
                            introduction: this.createForm.introduction,
                            opening_time: this.createForm.opening_time,
                            address: this.createForm.address
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('access_token')
                            }
                        }).then((res) => {
                            this.tableData.push(res.data.restaurant);
                            this.createVisible = false;
                        }).catch(err => {
                            console.log(err.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delRow = row;
                this.delVisible = true;
            },
            deleteRow(){
                this.url = '/api/seller/restaurants/' + this.delRow.id;
                this.$axios.delete(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.tableData.splice(this.idx, 1);
                    this.$message.success('删除成功');
                    this.delVisible = false;
                }).catch(err => {
                    console.log(err.message)
                })
            },
            jumpToManagement(row) {
                this.$router.push('/restaurants/' + row.id)
            },
            jumpToOrder(row) {
                this.$router.push('/orders/' + row.id)
            }
        },
        created() {
            this.getData();
        },
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

    .table{
        width: 100%;
        font-size: 14px;
    }

    .red{
        color: #ff0000;
    }

    .mr10{
        margin-right: 10px;
    }
</style>
