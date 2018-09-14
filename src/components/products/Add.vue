<template>
  <div>
    <el-steps ref="steps" :active="active">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品描述"></el-step>
    </el-steps>
    <el-tabs tab-position="left" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="基本信息" name="base">
        <el-form ref="form" :modal="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              change-on-select
              :props="props"
              v-model="form.goods_cat">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promote" label="1">是</el-radio>
            <el-radio v-model="form.is_promote" label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="go('pic', 1)">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload"
          :action="axios.defaults.baseURL + 'upload'"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="headers">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品描述" name="desc">
        <quill-editor class="myEditor" v-model="form.goods_introduce"></quill-editor>
        <el-button size="small" type="primary" @click="createProduct">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        is_promote: '2'
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id'
      },
      activeName: 'base',
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    tabClick(tab) {
      this.active = +tab.index
    },
    async getCategories() {
      console.log('st')
      let res = await this.axios.get('categories?type=3')
      let { data, meta: { status } } = res.data
      console.log(data)
      if (status === 200) {
        this.options = data
      }
    },
    go(activeName, active) {
      this.activeName = activeName
      this.active = active
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      let { data: { tmp_path: tmpPath }, meta: { status } } = response
      if (status === 200) {
        console.log(tmpPath)
        this.form.pics.push(tmpPath)
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      let tmpPath = file.response.data.tmp_path
      this.form.pics.splice(this.form.pics.indexOf(tmpPath), 1)
    },
    async createProduct() {
      let res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      let { meta: { status } } = res.data
      if (status === 201) {
        this.$message.success('成功')
        this.$router.push('/goods')
      } else {
        this.$message.error('失败')
      }
    }
  },
  created() {
    this.getCategories()
  }
}
</script>

<style lang="less" scoped>
.myEditor {
  background-color: #fff;
  .ql-editor {
    height: 300px;
  }
}
</style>
