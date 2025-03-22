<template>
  <div>
    <h2>货品管理</h2>
    <el-form :model="newProduct" ref="productForm" label-width="120px">
      <el-form-item label="货品名称" prop="name" :rules="[{ required: true, message: '请输入货品名称', trigger: 'blur' }]">
        <el-input v-model="newProduct.name"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price" :rules="[
        { required: true, message: '请输入价格', trigger: 'blur' },
        { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
      ]">
        <el-input v-model.number="newProduct.price"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock" :rules="[
        { required: true, message: '请输入库存', trigger: 'blur' },
        { type: 'number', min: 1, message: '库存必须大于0', trigger: 'blur' }
      ]">
        <el-input v-model.number="newProduct.stock"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category" :rules="[{ required: true, message: '请输入类别', trigger: 'blur' }]">
        <el-input v-model="newProduct.category"></el-input>
      </el-form-item>
      <el-form-item label="图片路径" prop="image">
        <el-input v-model="newProduct.image"></el-input>
      </el-form-item>
      <!-- 新增仓库输入 -->
      <el-form-item label="仓库 ID" prop="warehouse_id">
        <el-input v-model.number="newProduct.warehouse.id"></el-input>
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouse_name">
        <el-input v-model="newProduct.warehouse.name"></el-input>
      </el-form-item>
      <!-- 新增当前仓库 ID -->
      <el-form-item label="当前仓库 ID" prop="current_warehouse_id">
        <el-input v-model.number="newProduct.currentWarehouseId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addProduct">添加货品</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="products" style="width: 100%">
      <el-table-column prop="id" label="货品 ID"></el-table-column>
      <el-table-column prop="name" label="货品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="category" label="类别"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '@/utils/api'; // 确保正确导入 api.js

export default {
  data() {
    return {
      newProduct: {
        name: '',
        price: null,
        stock: null,
        category: '',
        image: '',
        warehouse: { // 新增仓库对象
          id: 0, // 默认值为1
          name: ''
        }
      },
      currentWarehouseId: 0, // 当前仓库 ID，默认值为 1
      products: []
    };
  },
  mounted() {
    this.fetchProducts(); // 组件挂载后获取产品信息
  },
  methods: {
    fetchProducts() {
      api.product.getAllProducts().then(response => {
        this.products = response.data; // 更新货品信息
      }).catch(error => {
        console.error("获取货品信息失败:", error);
      });
    },
    addProduct() {
      console.log('提交的产品数据:', this.newProduct); // 调试输出

      // 检查仓库 ID 和当前仓库 ID 是否为空，为空则设置为默认值 1
      if (!this.newProduct.warehouse.id) {
        this.newProduct.warehouse.id = 1;
      }
      if (!this.newProduct.warehouse.name) {
        this.newProduct.warehouse.name = '默认仓库';
      }
      if (!this.currentWarehouseId) {
        this.currentWarehouseId = 1; // 设置当前仓库 ID 默认值
      }

      this.$refs.productForm.validate((valid) => {
        if (valid) {
          // 将当前仓库 ID 作为额外字段传递到后端
          const productData = {
            ...this.newProduct,
            currentWarehouseId: this.currentWarehouseId
          };

          api.product.addProduct(productData).then(response => {
            this.products.push(response.data); // 更新前端产品列表
            this.resetForm();
            this.$message.success('添加货品成功');
          }).catch(error => {
            console.error("添加产品失败:", error);
            this.$message.error('添加货品失败，请重试');
          });
        } else {
          this.$message.error('表单验证未通过');
        }
      });
    },
    deleteProduct(id) {
      this.$confirm('确定删除该货品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.product.deleteProduct(id).then(() => {
          this.products = this.products.filter(product => product.id !== id); // 从列表中移除
        }).catch(error => {
          console.error("删除产品失败:", error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    resetForm() {
      this.newProduct = {
        name: '',
        price: null,
        stock: null,
        category: '',
        image: '',
        warehouse: { // 重置仓库对象
          id: 1, // 重置为默认值
          name: ''
        }
      };
      this.currentWarehouseId = 1; // 重置当前仓库 ID 为默认值
      this.$refs.productForm.resetFields(); // 重置表单字段
    }
  }
};
</script>

<style scoped>
/* 添加样式 */
</style>