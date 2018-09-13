<template>
  <div class="categories">
    <el-button plain type="success" @click="showAddDialog">新增</el-button>
    <!-- 分类列表 -->
    <el-table
      :data="cateList"
      stripe
      style="width: 100%">
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="20">
      </el-table-tree-column>
      <el-table-column
        prop="cat_name"
        label="分类名称">
      </el-table-column>
      <el-table-column
        label="是否删除">
        <template slot-scope="scope">
          {{ scope.row['cat_deleted'] ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size='small' @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size='small' @click="del(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新增分类 -->
    <el-dialog
      title="新增"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form :model="addForm" :rules="rules" status-icon ref="addForm" label-width="100px" class="addForm">
        <el-form-item label="父级分类">
          <el-cascader
            ref="cas"
            :options="options"
            change-on-select
            :props="props"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="addForm.cateName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let ElTreeGrid = require('element-tree-grid')

export default {
  data() {
    return {
      cateList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      addDialogVisible: false,
      addForm: {
        cateName: ''
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id'
      },
      rules: {
        cateName: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getCateList() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      let { data: { result, total }, meta: { status } } = res.data
      if (status === 200) {
        this.cateList = result
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.current = 1
      this.pageSize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getCateList()
    },
    async showAddDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let { data, meta: { status } } = res.data
      console.log(data)
      if (status === 200) {
        this.options = data
      }
    },
    addCate() {
      console.log(this.$refs.cas.value)
      console.log(this.selectedOptions)
    }
  },
  async created() {
    this.getCateList()
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style>
</style>
