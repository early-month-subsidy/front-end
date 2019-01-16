<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">月初补贴点餐后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-input v-model="ruleForm.captcha" placeholder="captcha" @change="checkCaptchaValid">
                                <i slot="append" class="el-icon-success success" v-if="isCaptchaValid"></i>
                                <i slot="append" class="el-icon-error danger" v-else></i>
                            </el-input>
                        </el-col>
                        <el-col :span="12">
                            <img class="captcha-img" v-bind:src="captcha_url" @click="getCaptcha"/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <div class="login-btn">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-button type="primary" @click="signinForm('ruleForm')">登录</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="danger" @click="signupForm('ruleForm')">注册</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
        <!-- 信息提示框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="300px" center>
            <div class="log-dialog">
                <p>{{ log_message }}</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    captcha: '',
                    captcha_id: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {maxLength: 32, message: '用户名不超过32位', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {maxLength: 32, message: '密码不超过32位', trigger: 'blur'}
                    ],
                    captcha: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {maxLength: 4, message: '验证码不超过4位', trigger: 'blur'}
                    ]
                },
                captcha_url: '',
                isCaptchaValid: false,
                dialogVisible: false,
                log_message: ''
            }
        },
        methods: {
            signinForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.url = '/api/login';
                        this.$axios.post(this.url, {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        }).then((res) => {
                            localStorage.setItem('ms_username',this.ruleForm.username);
                            localStorage.setItem('access_token', res.data.access_token);
                            localStorage.setItem('refresh_token', res.data.refresh_token);
                            this.$router.push('/');
                        }).catch(err => {
                            console.log(err.message);
                            this.log_message = '账号或密码错误';
                            this.dialogVisible = true;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            signupForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.isCaptchaValid) {
                        this.url = '/api/registration';
                        this.$axios.post(this.url, {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password,
                            captcha: this.ruleForm.captcha,
                            captcha_id: this.ruleForm.captcha_id
                        }).then((res) => {
                            localStorage.setItem('ms_username',this.ruleForm.username);
                            localStorage.setItem('access_token', res.data.access_token);
                            localStorage.setItem('refresh_token', res.data.refresh_token);
                            this.$router.push('/');
                        }).catch(err => {
                            console.log(err.message);
                            if (err.status === 500)
                                this.log_message = '服务器出错';
                            else
                                this.log_message = '账号已存在';
                            this.dialogVisible = true;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getCaptcha() {
                this.url = '/api/captcha';
                this.$axios.get(this.url).then(res => {
                    this.captcha_url = res.data.url;
                    this.ruleForm.captcha_id = res.data.captcha_id;
                }).catch(err => {
                    console.log(err.message)
                })
            },
            checkCaptchaValid(newValue, oldValue) {
                this.url = '/api/captcha';
                this.$axios.post(this.url, {
                    captcha: this.ruleForm.captcha,
                    captcha_id: this.ruleForm.captcha_id
                }).then(res => {
                    this.isCaptchaValid = res.status === 200;
                }).catch(err => {
                    console.log(err.message)
                })
            }
        },
        created() {
            this.getCaptcha();
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .captcha-img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }
    .log-dialog{
        font-size: 16px;
        text-align: center
    }
</style>
