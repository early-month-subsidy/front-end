<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i>餐馆列表</el-breadcrumb-item>
                <el-breadcrumb-item>餐馆 {{ restaurant_id }}：</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="orders" border stripe class="table" ref="multipleTable" height="540">
                <el-table-column prop="id" label="订单ID" sortable>
                </el-table-column>
                <el-table-column prop="created_time" label="订单创建时间" sortable>
                </el-table-column>
                <el-table-column prop="status" label="订单状态" sortable>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="total_cost" label="订单总价">
                </el-table-column>
                <el-table-column label="订单小项" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <ul v-if="scope.row">
                                <li v-for="i in scope.row.items" :key="i.id" class="item-li">
                                    <span class="li-span">餐桌：{{ i.board.name }}</span>
                                    <span class="li-span">菜品：{{ i.food.name }}</span>
                                    <span class="li-span">数量：{{ i.quantity }}</span>
                                </li>
                            </ul>
                            <el-button slot="reference" icon="el-icon-tickets" circle></el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-success" class="green" @click="handleConfirm(scope.$index, scope.row)" v-if="scope.row.status==='UNPAID'">确认付款</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 确认提示框 -->
        <el-dialog title="提示" :visible.sync="confirmVisible" width="300px" center>
            <div class="del-dialog-cnt" v-if="selectedOrder">确定餐桌{{ selectedOrder.items[0].board.name }}已付款？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmRow">确 定</el-button>
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
        name: "Order",
        data() {
            return {
                restaurant_id: 0,
                orders: [],
                confirmVisible: false,
                selectedOrder: null,
                idx: 0,
                delVisible: false
            }
        },
        methods: {
            getData() {
                this.restaurant_id = this.$route.params.restaurant_id;
                this.url = '/api/seller/restaurants/' + this.restaurant_id + '/orders';
                this.$axios.get(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.orders = res.data.orders
                }).catch(err => {
                    console.log(err.message)
                })
            },
            handleConfirm(index, row) {
                this.idx = index;
                this.selectedOrder = row;
                this.confirmVisible = true;
            },
            confirmRow() {
                this.url = '/api/seller/orders/' + this.selectedOrder.id;
                this.$axios.put(this.url, {}, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.orders[this.idx].status = 'FINISHED';
                    this.confirmVisible = false
                }).catch(err => {
                    console.log(err.message)
                })
            },
            handleDelete(index, row) {
                this.idx = index;
                this.selectedOrder = row;
                this.delVisible = true;
            },
            deleteRow() {
                this.url = '/api/seller/orders/' + this.selectedOrder.id;
                this.$axios.delete(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.orders.splice(this.idx, 1);
                    this.$message.success('删除成功');
                    this.delVisible = false
                }).catch(err => {
                    console.log(err.message)
                })
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
    .table {
        width: 100%;
        font-size: 14px;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .red {
        color: #ff0000;
    }

    .green {
        color: chartreuse;
    }

    .li-span {
        margin-right: 10px;
    }

    .item-li {
        list-style-type: none;
        margin-bottom: 10px;
    }
</style>
