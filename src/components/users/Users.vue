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
    <el-button type="success" plain @click="addDialogVisible = true">用户添加</el-button>
    <!-- 用户列表 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        :index="indexMethod">
      </el-table-column>
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
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size='small' @click="edit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size='small' @click="del(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size='small' @click="showAssignRole(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[2, 4, 6, 8, 16]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新增用户 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="新增用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="editForm">
        <el-form-item label="用户">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="新增用户"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-form :model="assignForm" :rules="rules" ref="assignForm" label-width="100px" class="assignForm">
        <el-form-item label="用户">
          <el-tag type="info">{{ assignForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in assignForm.options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      current: 1,
      query: '',
      pageSize: 2,
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入 密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机', trigger: 'change' }
        ]
      },
      editForm: {},
      assignDialogVisible: false,
      assignForm: {
        username: '',
        rid: '',
        uid: '',
        options: []
      }
    }
  },
  methods: {
    indexMethod(index) {
      return index
    },
    getUserList() {
      this.axios({
        url: 'users',
        type: 'get',
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
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.getUserList()
    },
    search() {
      this.current = 1
      this.getUserList()
    },
    async changeState(row) {
      let res = await this.axios.put(`users/${row.id}/state/${row.mg_state}`)
      // console.log(res)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败')
      }
    },
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.post('users', this.addForm)
          let { meta: { status } } = res.data
          if (status === 201) {
            this.$refs.addForm.resetFields()
            let lastPageNum = Math.ceil(++this.total / this.pageSize)
            this.current = lastPageNum
            this.getUserList()
            this.$message.success('添加成功')
            this.addDialogVisible = false
          } else {
            this.$message.error('添加失败')
          }
        } else {
          return false
        }
      })
    },
    del(row) {
      // console.log('deluser', row)
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.axios.delete(`users/${row.id}`)
        let {meta: {status}} = res.data
        if (status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.tableData.length === 1 && this.current > 1) {
            this.current--
          }
          this.getUserList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    edit(row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          let {meta: {status}} = res.data
          if (status === 200) {
            this.$message.success('更新成功')
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getUserList()
          } else {
            this.$message.error('更新失败')
          }
        } else {
          return false
        }
      })
    },
    async showAssignRole(user) {
      this.assignDialogVisible = true
      let res = await this.axios.get(`users/${user.id}`)
      let {data, meta: {status}} = res.data
      if (status === 200) {
        console.log(data)
        this.assignForm.uid = user.id
        this.assignForm.rid = data.rid !== -1 ? data.rid : ''
        this.assignForm.username = user.username
      }
      this.getRoleList()
    },
    async getRoleList() {
      let res1 = await this.axios.get('roles')
      let {data: data1, meta: {status: status1}} = res1.data
      if (status1 === 200) {
        console.log(data1)
        this.assignForm.options = data1
      }
    },
    async assignRole() {
      let res = await this.axios.put(`users/${+this.assignForm.uid}/role`, {rid: this.assignForm.rid})
      let {meta: {status}} = res.data
      console.log(res.data)
      if (status === 200) {
        this.assignDialogVisible = false
        this.$message.success('成功')
        this.getUserList()
      } else {
        this.$message.error('失败')
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style>
.el-breadcrumb {
  margin-bottom: 20px;
}
.input-with-select {
  width: 300px;
  margin-bottom: 20px;
}
</style>
