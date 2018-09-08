<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="add">用户添加</el-button>
    <!-- 用户列表 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size='small'></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size='small'></el-button>
          <el-button type="success" icon="el-icon-check" plain size='small'>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[2, 4, 6, 8, 16]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      current: 1,
      query: '',
      pageSize: 2,
      total: 0
    }
  },
  methods: {
    getList() {
      axios({
        url: 'http://localhost:8888/api/private/v1/users',
        type: 'get',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.data.users
        this.total = res.data.data.total
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.current = 1
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.getList()
    },
    search() {
      this.current = 1
      this.getList()
    },
    add() {}
  },
  created() {
    this.getList()
  }
}
</script>

<style>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-input {
  width: 300px;
  margin-bottom: 20px;
}
</style>
