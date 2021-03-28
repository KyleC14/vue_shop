<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button @click="showAddCateDialog" type="primary"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类列表区 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag
            v-else-if="scope.row.cat_level === 2"
            type="warning"
            size="mini"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" size="mini" type="danger"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addDialogClosed()"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- cascader中options指定数据源 -->
          <!-- props用于指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //添加分类表单的数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: '',
        //父级分类id
        cat_pid: 0,
        //分类等级 默认一级分类
        cat_level: 0,
      },
      //添加分类表单的规则验证对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //cascader级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //级联选择器选中父级分类id数组
      selectedKeys: [],
      //父级分类列表
      parentCateList: [],
      //添加分类对话框可见标志位
      addCateDialogVisible: false,
      //商品分类列表数据 默认空
      catelist: [],
      //总数据条数
      total: 0,
      //请求获取商品列表数据的参数 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //为表格指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //当前列定义为模板列
          type: 'template',
          //当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          //当前列定义为模板列
          type: 'template',
          //当前列使用的模板名称
          template: 'order',
        },
        {
          label: '操作',
          //当前列定义为模板列
          type: 'template',
          //当前列使用的模板名称
          template: 'opt',
        },
      ],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      console.log(res.data)
      //获取商品列表数据
      this.catelist = res.data.result
      //获取总数据条数
      this.total = res.data.total
    },
    //监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听 pagenum 改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    //添加分类对话框关闭时
    addDialogClosed() {
      //重置表单数据
      this.$refs.addCateFormRef.resetFields()
      //级联选择器重置
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //点击按钮显示添加分类对话框
    showAddCateDialog() {
      //先获取父级分类数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      //   console.log(res.data)
      this.parentCateList = res.data
    },
    //级联选择器选择项发生变化触发
    parentCateChange() {
      console.log(this.selectedKeys)
      //selectedKeys长度>0,则选择中了父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //点击按钮添加新的分类
    addCate() {
      //   console.log(this.addCateForm)
      //预校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
  },
}
</script>

<style lang='less' scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>