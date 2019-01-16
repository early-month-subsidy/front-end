<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i>餐馆列表</el-breadcrumb-item>
                <el-breadcrumb-item>餐馆 {{ restaurant_id }}：</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="20" class="session-row">
                <el-card class="box-card">
                    <div slot="header">
                        <span>图片管理</span>
                        <el-button class="btn-card" type="primary">添加图片</el-button>
                    </div>
                    <el-row>
                        <el-col :span="8" v-for="(img, index) in images" :key="img.id" :offset="index > 0 ? 2 : 0">
                            <el-card :body-style="{ padding: '0px' }">
                                <img :src="img.image_url" class="image-card">
                                <div style="padding: 14px;">
                                    <div>
                                        <span>ID:&nbsp;{{ img.id }}</span>
                                        <el-button type="danger" class="btn-card">删除</el-button>
                                    </div>
                                    <span>Piority:&nbsp;{{ img.order_id }}</span>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-row>
            <el-row :gutter="20" class="session-row">
                <el-card class="box-card">
                    <div slot="header">
                        <span>座位管理</span>
                        <el-button class="btn-card" type="primary" @click="handleCreate">添加座位</el-button>
                    </div>
                    <div>
                        <ul>
                            <li v-for="(b, index) in boards" :key="index" class="board-li">
                                <div :class="b.occupation ? 'board-li-content-red' : 'board-li-content-green'">
                                    <p class="board-name-font">{{ b.name }}</p>
                                    <p style="font-size: small; margin: 5px;">人数：&nbsp{{ b.seat_num }}</p>
                                    <el-row>
                                        <el-button type="warning" :icon="b.occupation ? 'el-icon-lx-unlock' : 'el-icon-lx-lock'" circle @click="handleChangeBoard(index, b)"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" circle @click="handleBoardDelete(index, b)"></el-button>
                                    </el-row>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-card>
            </el-row>
            <el-row :gutter="20" class="session-row">
                <el-card class="box-card">
                    <div slot="header">
                        <span>菜单管理</span>
                        <el-button class="btn-card" type="primary" @click="handleCategoryCreate">添加品类</el-button>
                    </div>
                    <div>
                        <el-tabs type="card" closable @tab-remove="handleCategoryDelete">
                            <el-tab-pane
                                    v-for="(category, index) in categories"
                                    :key="category.id"
                                    :label="category.name"
                                    :name="String(category.id)"
                            >
                                <div class="handle-box">
                                    <el-button type="primary" icon="create" @click="handleFoodCreate(category.id)">新增菜品</el-button>
                                </div>
                                <el-table :data="category.foods" border stripe class="table" ref="multipleTable" height="320">
                                    <el-table-column prop="id" label="菜品ID" sortable width="100">
                                    </el-table-column>
                                    <el-table-column prop="name" label="菜品名称" sortable width="120">
                                    </el-table-column>
                                    <el-table-column prop="description" label="菜品介绍" width="200">
                                    </el-table-column>
                                    <el-table-column prop="price" label="单价" sortable>
                                    </el-table-column>
                                    <el-table-column prop="likes" label="赞数" sortable>
                                    </el-table-column>
                                    <el-table-column prop="sales" label="销量" sortable>
                                    </el-table-column>
                                    <el-table-column label="图片" align="center">
                                        <template slot-scope="scope">
                                            <el-popover placement="top-start" trigger="hover">
                                                <img :src="scope.row.image" class="image-card">
                                                <el-button slot="reference" icon="el-icon-picture" circle></el-button>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="240" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="text" icon="el-icon-upload" @click="void(0)">上传图片</el-button>
                                            <el-button type="text" icon="el-icon-delete" class="red" @click="handleFoodDelete(scope.$index, scope.row, category.id)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-card>
            </el-row>
        </div>

        <!-- 创建餐桌弹出框 -->
        <el-dialog title="创建餐桌" :visible.sync="createBoardVisible" width="30%">
            <el-form ref="createBoardForm" :model="createBoardForm" :rules="board_rules" label-width="120px">
                <el-form-item prop="name" label="餐桌序号名称">
                    <el-input v-model="createBoardForm.name" placeholder="请输入餐桌序号名称"></el-input>
                </el-form-item>
                <el-form-item prop="seat_num" label="座位数">
                    <el-input type="number" v-model="createBoardForm.seat_num" placeholder="请输入座位数量"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createBoardVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveBoardCreate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除餐桌提示框 -->
        <el-dialog title="提示" :visible.sync="delBoardVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delBoardVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteBoard">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 改变餐桌提示框 -->
        <el-dialog title="提示" :visible.sync="changeBoardVisible" width="300px" center>
            <div class="del-dialog-cnt" v-if="selectedBoard === null">确定解锁餐桌?</div>
            <div class="del-dialog-cnt" v-else-if="selectedBoard.occupation">确定解锁餐桌{{ selectedBoard.name }}?</div>
            <div class="del-dialog-cnt" v-else>确定锁定餐桌{{ selectedBoard.name }}?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeBoardVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeBoard">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 创建品类弹出框 -->
        <el-dialog title="创建品类" :visible.sync="createCategoryVisible" width="30%">
            <el-form ref="createCategoryForm" :model="createCategoryForm" :rules="category_rules" label-width="120px">
                <el-form-item prop="name" label="品类名称">
                    <el-input v-model="createCategoryForm.name" placeholder="请输入品类名称"></el-input>
                </el-form-item>
                <el-form-item prop="priority" label="显示优先级">
                    <el-input type="number" v-model="createCategoryForm.priority" placeholder="请输入优先级"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createCategoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCategoryCreate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除品类提示框 -->
        <el-dialog title="提示" :visible.sync="delCategoryVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delCategoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeTab">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 创建菜品弹出框 -->
        <el-dialog title="创建菜品" :visible.sync="createFoodVisible" width="30%">
            <el-form ref="createFoodForm" :model="createFoodForm" :rules="food_rules" label-width="120px">
                <el-form-item prop="name" label="菜品名称">
                    <el-input v-model="createFoodForm.name" placeholder="请输入菜品名称"></el-input>
                </el-form-item>
                <el-form-item prop="description" label="菜品描述">
                    <el-input type="textarea" :row="2" v-model="createFoodForm.description" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="price" label="菜品单价">
                    <el-input type="number" v-model="createFoodForm.price" placeholder="请输入菜品单价"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createFoodVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveFoodCreate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除菜品提示框 -->
        <el-dialog title="提示" :visible.sync="delFoodVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delFoodVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteFood">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Management",
        data() {
            return {
                url: '',
                restaurant_id: 0,
                images: [],
                boards: [],
                categories: [],
                createBoardVisible: false,
                createBoardForm: {
                    name: '',
                    seat_num: 0
                },
                board_rules: {
                    name: [
                        {required: true, message: '请输入餐桌序号名称', trigger: 'blur'},
                        {maxLength: 32, message: '名称不超过32个字符', trigger: 'blur'}
                    ],
                    seat_num: [
                        {required: true, message: '请输入座位数量', trigger: 'blur'},
                    ]
                },
                delBoardVisible: false,
                selectedBoard: null,
                idx: 0,
                changeBoardVisible: false,
                createCategoryVisible: false,
                createCategoryForm: {
                    name: '',
                    priority: 0
                },
                category_rules: {
                    name: [
                        {required: true, message: '请输入品类名称', trigger: 'blur'},
                        {maxLength: 32, message: '名称不超过32个字符', trigger: 'blur'}
                    ],
                    priority: [
                        {required: true, message: '请输入优先级', trigger: 'blur'},
                    ]
                },
                removeTagName: '',
                delCategoryVisible: false,
                createFoodVisible: false,
                createFoodForm: {
                    name: '',
                    description: '',
                    price: 0,
                },
                food_rules: {
                    name: [
                        {required: true, message: '请输入菜品名称', trigger: 'blur'},
                        {maxLength: 32, message: '名称不超过32个字符', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入菜品描述', trigger: 'blur'},
                        {maxLength: 128, message: '介绍不超过128个字符', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '请输入菜品单价', trigger: 'blur'}
                    ]
                },
                selectedCategoryId: 0,
                delFoodVisible: false,
                selectedFood: null
            }
        },
        methods: {
            getData() {
                this.restaurant_id = this.$route.params.restaurant_id;
                this.url = '/api/seller/restaurants/' + this.restaurant_id;
                this.$axios.get(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    let restaurant = res.data.restaurant;
                    this.images = restaurant.images;
                    this.boards = restaurant.boards;
                    this.categories = restaurant.categories;
                }).catch(err => {
                    console.log(err.message)
                })
            },
            handleCreate() {
                this.createBoardForm = {
                    name: '',
                    seat_num: 2
                };
                this.createBoardVisible = true;
            },
            saveBoardCreate() {
                this.$refs['createBoardForm'].validate((valid) => {
                    if (valid) {
                        this.url = '/api/seller/restaurants/' + this.restaurant_id + '/boards';
                        this.$axios.post(this.url, {
                            name: this.createBoardForm.name,
                            seat_num: this.createBoardForm.seat_num
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('access_token')
                            }
                        }).then((res) => {
                            this.boards.push(res.data.board);
                            this.createBoardVisible = false;
                        }).catch(err => {
                            console.log(err.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleBoardDelete(index, board) {
                this.selectedBoard = board;
                this.idx = index;
                this.delBoardVisible = true;
            },
            deleteBoard() {
                this.url = '/api/api/restaurants/' + this.restaurant_id + '/boards/' + this.selectedBoard.id;
                this.$axios.delete(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.boards.splice(this.idx, 1);
                    this.$message.success('删除成功');
                    this.delBoardVisible = false;
                }).catch(err => {
                    console.log(err.message)
                })
            },
            handleChangeBoard(index, board) {
                this.idx = index;
                this.selectedBoard = board;
                this.changeBoardVisible = true;
            },
            changeBoard() {
                this.url = '/api/api/restaurants/' + this.restaurant_id + '/boards/' + this.selectedBoard.id;
                this.$axios.put(this.url, {
                    action: this.selectedBoard.occupation ? 'unlock': 'lock'
                }, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    this.boards[this.idx].occupation = !this.boards[this.idx].occupation;
                    this.$message.success('更改成功');
                    this.changeBoardVisible = false;
                }).catch(err => {
                    console.log(err.message)
                })
            },
            handleCategoryCreate() {
                this.createCategoryForm = {
                    name: '',
                    priority: 0
                };
                this.createCategoryVisible = true;
            },
            saveCategoryCreate() {
                this.$refs['createCategoryForm'].validate((valid) => {
                    if (valid) {
                        this.url = '/api/seller/restaurants/' + this.restaurant_id + '/categories';
                        this.$axios.post(this.url, {
                            name: this.createCategoryForm.name,
                            priority: this.createCategoryForm.priority
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('access_token')
                            }
                        }).then((res) => {
                            this.categories.push(res.data.category);
                            this.createCategoryVisible = false;
                        }).catch(err => {
                            console.log(err.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleCategoryDelete(targetName) {
                this.removeTagName = targetName;
                this.delCategoryVisible = true;
            },
            removeTab() {
                let targetName = Number(this.removeTagName);
                let len = this.categories.length;
                for (let index = 0; index < len; index++) {
                    let c = this.categories[index];
                    if (c.id === targetName) {
                        this.url = '/api/api/restaurants/' + this.restaurant_id + '/categories/' + c.id;
                        this.$axios.delete(this.url, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('access_token')
                            }
                        }).then(res => {
                            this.categories.splice(index, 1);
                            this.$message.success('删除成功');
                            this.delCategoryVisible = false;
                        }).catch(err => {
                            console.log(err.message)
                        });
                    }
                }
            },
            handleFoodCreate(category_id) {
                this.selectedCategoryId = category_id;
                this.createFoodForm =  {
                    name: '',
                    description: '',
                    price: 0.0
                };
                this.createFoodVisible = true
            },
            saveFoodCreate() {
                this.$refs['createFoodForm'].validate((valid) => {
                    if (valid) {
                        this.url = '/api/seller/categories/' + this.selectedCategoryId + '/foods';
                        this.$axios.post(this.url, {
                            name: this.createFoodForm.name,
                            description: this.createFoodForm.description,
                            price: this.createFoodForm.price
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('access_token')
                            }
                        }).then((res) => {
                            let len = this.categories.length;
                            for (let index = 0; index < len; index++) {
                                if (this.categories[index].id === this.selectedCategoryId) {
                                    this.categories[index].foods.push(res.data.food);
                                }
                            }
                            this.createFoodVisible = false;
                        }).catch(err => {
                            console.log(err.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleFoodDelete(index, food, category_id) {
                this.idx = index;
                this.selectedFood = food;
                this.selectedCategoryId = category_id;
                this.delFoodVisible = true
            },
            deleteFood() {
                this.url = '/api/api/categories/' + this.selectedCategoryId + '/foods/' + this.selectedFood.id;
                this.$axios.delete(this.url, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                }).then(res => {
                    let len = this.categories.length;
                    for (let index = 0; index < len; index++) {
                        if (this.categories[index].id === this.selectedCategoryId) {
                            this.categories[index].foods.splice(this.idx, 1)
                        }
                    }
                    this.$message.success('删除成功');
                    this.delFoodVisible = false;
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
    .session-row {
        margin-bottom: 20px;
    }

    .box-card {
        width: 100%;
    }

    .btn-card {
        float: right;
    }

    .image-card {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }

    .board-li {
        display: inline-block;
        padding: 10px;
        margin: 5px auto;
        width: 120px;
        height: 120px;
    }

    .board-li-content-red {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #ff413e;
        border-radius: 10px;
        background: #ff413e;
    }

    .board-li-content-green {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #45b21f;
        border-radius: 10px;
        background: #45b21f;
    }

    .board-name-font {
        font-size: 1.875em;
        font-weight: bold;
        margin: 5px;
    }

    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

    .handle-box {
        margin-bottom: 10px;
    }

    .table{
        width: 100%;
        font-size: 14px;
    }

    .red{
        color: #ff0000;
    }

</style>
