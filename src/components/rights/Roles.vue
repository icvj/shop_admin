<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-button type="success" plain @click="addDialogVisible = true">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table
      :data="rolesList"
      stripe
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="level1 in props.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag
                type="success"
                closable
                @close="delSpecificRight(props.row, level1.id)">
                {{level1.authName}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    type="warn"
                    closable
                    @close="delSpecificRight(props.row, level2.id)">
                    {{level2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    type="danger"
                    closable
                    @close="delSpecificRight(props.row, level3.id)">
                    {{level3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size='small' @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size='small' @click="del(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size='small' @click="showAssignDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="addForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="新增角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="editForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%"
      @closed="clear">
      <el-tree
        :data="allRightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleId: '',
      assignDialogVisible: false,
      allRightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let {data, meta: {status}} = res.data
      console.log(data)
      if (status === 200) {
        this.rolesList = data
      }
    },
    async add() {
      let res = await this.axios.post('roles', this.addForm)
      let {meta: {status}} = res.data
      if (status === 201) {
        this.$message.success('添加角色成功')
        this.getRoleList()
      } else {
        this.$message.error('添加角色失败')
      }
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editRoleId = row.id
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
    },
    async edit() {
      let res = await this.axios.put(`roles/${this.editRoleId}`, this.editForm)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.editDialogVisible = false
        this.$refs.editForm.resetFields()
        this.$message.success('修改成功')
        this.getRoleList()
      } else {
        this.$message.success('修改失败')
      }
    },
    async del(row) {
      let res = await this.axios.delete(`roles/${row.id}`)
      let {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('删除成功')
        this.getRoleList()
      } else {
        this.$message.error('删除失败')
      }
    },
    async showAssignDialog(row) {
      this.assignDialogVisible = true
      this.editRoleId = row.id
      let res = await this.axios.get('rights/tree')
      let {data, meta: {status}} = res.data
      console.log(data)
      if (status === 200) {
        this.allRightList = data

        let temp = []
        row.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              temp.push(level3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      }
    },
    async assign() {
      let arr = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      let rids = arr.join()
      console.log(rids)
      let res = await this.axios.post(`roles/${this.editRoleId}/rights`, {rids})
      let {meta: {status}} = res.data
      if (status === 200) {
        this.assignDialogVisible = false
        this.$message.success('成功')
        this.getRoleList()
      } else {
        this.$message.error('失败')
      }
    },
    clear() {
      this.$refs.tree.setCheckedKeys([])
    },
    async delSpecificRight(row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let {data, meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('成功')
        row.children = data
      } else {
        this.$message.error('失败')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
