<template>
  <div>
    <el-button type="primary" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="sc">
          {{ sc.row.add_time * 1000 | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size='small' @click="edit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size='small' @click="del(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      query: '',
      tableData: []
    }
  },
  methods: {
    async getList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      // console.log(res.data)
      let { data: { goods, total }, meta: { status } } = res.data
      if (status === 200) {
        this.tableData = goods
        this.total = total
      }
    },
    // 修改了每页的条数
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getList()
    },
    // 修改了当前页的页码
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    indexMethod(idx) {
      return (this.current - 1) * this.pageSize + idx + 1
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style>
</style>
