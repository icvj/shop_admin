<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules' status-icon>
      <img src="../../assets/avatar.jpg" alt="">
      <el-form-item label="账户" prop='username'>
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入 密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        } else {
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 200) {
              this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'success',
                duration: 1000
              })

              this.$router.push('home')
            } else {
              this.$message.error('用户名或者密码错误')
            }
          })
        }
      })
    },
    onReset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped lang='less'>
.login {
  background-color: #2D434C;
  height: 100%;
  overflow: hidden;

  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 74px 40px 15px;
    border-radius: 20px;
    position: relative;

    img {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }

    .el-button + .el-button {
      margin-left: 80px;
    }
  }
}
</style>
