<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" class="aside">
      <div class="logo-container">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
      </div>
      <div class="menu-top-space"></div>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color="#f5f5f5"
        text-color="#333"
        active-text-color="#409EFF"
      >
        <el-menu-item index="1">个人信息管理</el-menu-item>
        <el-menu-item index="2">企业基本信息管理</el-menu-item>
        <el-menu-item index="3">仓库管理</el-menu-item>
        <el-menu-item index="4">货品信息</el-menu-item>
        <el-menu-item index="5">货品管理</el-menu-item>
        <el-menu-item index="6">出入库管理</el-menu-item>
        <el-menu-item index="7">转移记录</el-menu-item>
        <el-menu-item index="8">出入库分析</el-menu-item> <!-- 新增菜单项 -->
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">夏理小仓库管理系统-欢迎，信息管理员！</el-header>
      <el-main class="main">
        <h1>信息管理员视图</h1>
        <p>欢迎，信息管理员！</p>
        
        <div v-if="selectedMenu === '1'">
          <user-profile></user-profile>
        </div>
        <div v-if="selectedMenu === '2'">
          <h2>企业基本信息管理</h2>
          <el-table :data="enterprises" style="width: 100%">
            <el-table-column prop="enterpriseName" label="企业名称"></el-table-column>
            <el-table-column prop="address" label="具体地址"></el-table-column>
            <el-table-column prop="contactPerson" label="联系人"></el-table-column>
            <el-table-column prop="contactNumber" label="联系方式"></el-table-column>
          </el-table>
        </div>
        <div v-if="selectedMenu === '3'">
          <h2>仓库管理</h2>
          <el-input v-model="newWarehouseName" placeholder="输入仓库名称"></el-input>
          <el-button type="primary" @click="addWarehouse">添加仓库</el-button>
          <el-table :data="warehouses" style="width: 100%">
            <el-table-column prop="id" label="仓库 ID"></el-table-column>
            <el-table-column prop="name" label="仓库名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="deleteWarehouse(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="selectedMenu === '4'">
          <h2>货品信息</h2>
          <el-table :data="products" style="width: 100%">
            <el-table-column prop="id" label="货品 ID"></el-table-column>
            <el-table-column prop="name" label="货品名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
            <el-table-column prop="category" label="类别"></el-table-column>
            <el-table-column label="仓库名称">
              <template slot-scope="scope">
                <span>{{ scope.row.warehouseName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img :src="getImageUrl(scope.row.image)" alt="Product Image" style="width: 50px; height: 50px;" />
              </template>
            </el-table-column>
          </el-table>
          <h2>各仓库产品类别库存分布</h2>
          <warehouse-category-pie-chart :products="products" />
        </div>
        <div v-if="selectedMenu === '5'">
          <product-management></product-management>
        </div>
        <div v-if="selectedMenu === '6'">
          <h2>出入库管理</h2>
          <el-input v-model="transferProductId" placeholder="输入产品 ID" style="margin-bottom: 10px;"></el-input>
          <el-input v-model="newWarehouseId" placeholder="输入新仓库 ID" style="margin-bottom: 10px;"></el-input>
          <el-button type="primary" @click="updateProductWarehouse">更新产品仓库</el-button>
          <p v-if="transferMessage">{{ transferMessage }}</p>
        </div>
        <div v-if="selectedMenu === '7'">
          <h2>转移记录</h2>
          <div v-if="transferRecords.length === 0">没有转移记录</div>
          <div v-for="record in transferRecords" :key="record.id" class="transfer-record">
            <p>记录 ID: {{ record.id }}</p>
            <p>产品 ID: {{ record.productId }}</p>
            <p>来源仓库 ID: {{ record.fromWarehouseId }}</p>
            <p>目标仓库 ID: {{ record.toWarehouseId }}</p>
            <p>操作人: {{ record.operator }}</p>
            <p>转移时间: {{ record.transferTime }}</p>
            <p>转移数量: {{ record.quantity }}</p>
            <hr />
          </div>
        </div>
        <div v-if="selectedMenu === '8'">
          <stock-analysis></stock-analysis> <!-- 显示出入库分析组件 -->
        </div>
      </el-main>
      <el-footer class="footer">xmut-2024-web+spingboot+javaEE+JWT+MYsql</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import api from '@/utils/api'; // 确保正确导入 api.js
import UserProfile from '@/components/UserProfile.vue'; // 引入个人信息管理组件
import ProductManagement from '@/components/ProductManagement.vue'; // 引入货品管理组件
import WarehouseCategoryPieChart from '@/components/WarehouseCategoryPieChart.vue'; // 引入饼图组件
import StockAnalysis from '@/components/StockAnalysis.vue'; // 引入出入库分析组件

export default {
  name: 'SuperAdminView',
  components: {
    UserProfile, // 注册组件
    ProductManagement, // 注册货品管理组件
    WarehouseCategoryPieChart, // 注册饼图组件
    StockAnalysis // 注册出入库分析组件
  },
  data() {
    return {
      selectedMenu: '1', // 默认选中第一个菜单项
      enterprises: [], // 存储企业信息
      warehouses: [], // 存储仓库信息
      products: [], // 存储货品信息
      transferRecords: [], // 存储转移记录
      newWarehouseName: '', // 新仓库名称
      transferProductId: '', // 转移的产品 ID
      newWarehouseId: '', // 新仓库 ID
      transferMessage: '', // 转移操作的反馈信息
      newProduct: { // 新产品信息
        name: '',
        price: null,
        stock: null,
        category: '',
        image: '',
        warehouse: { // 重置仓库对象
          id: 1, // 重置为默认值
          name: ''
        }
      }
    };
  },
  mounted() {
    this.fetchProducts(); // 组件挂载后立即获取货品信息
    this.fetchTransferRecords(); // 获取转移记录
    this.fetchWarehouses(); // 获取仓库信息
  },
  methods: {
    handleSelect(index) {
      this.selectedMenu = index; // 更新选中的菜单项
      if (index === '2') {
        this.fetchEnterprises(); // 选择企业基本信息管理时获取企业信息
      } else if (index === '3') {
        this.fetchWarehouses(); // 选择仓库管理时获取仓库信息
      } else if (index === '4') {
        this.fetchProducts(); // 选择货品信息时获取货品信息
      } else if (index === '7') {
        this.fetchTransferRecords(); // 选择转移记录时获取转移记录
      }
    },
    fetchEnterprises() {
      api.enterprise.getAllEnterprises().then(response => {
        this.enterprises = response.data; // 更新企业信息
      }).catch(error => {
        console.error("获取企业信息失败:", error);
      });
    },
    fetchWarehouses() {
      api.warehouse.getAllWarehouses().then(response => {
        this.warehouses = response.data; // 更新仓库信息
      }).catch(error => {
        console.error("获取仓库信息失败:", error);
      });
    },
    fetchProducts() {
      api.product.getAllProducts().then(response => {
        this.products = response.data; // 更新货品信息
        // 获取每个产品的仓库名称
        this.products.forEach(product => {
          api.product.getWarehouseNameByProductId(product.id).then(warehouseResponse => {
            product.warehouseName = warehouseResponse.data; // 将仓库名称添加到产品对象
          }).catch(error => {
            console.error(`获取产品 ${product.id} 的仓库名称失败:`, error);
            product.warehouseName = '未知仓库'; // 如果获取失败，设置为未知仓库
          });
        });
      }).catch(error => {
        console.error("获取货品信息失败:", error);
      });
    },
    fetchTransferRecords() {
      api.transferRecord.fetchAllTransferRecords().then(response => {
        this.transferRecords = response.data; // 更新转移记录
      }).catch(error => {
        console.error("获取转移记录失败:", error);
      });
    },
    getImageUrl(imagePath) {
      return require(`@/assets/${imagePath}`); // 根据实际路径调整
    },
    addWarehouse() {
      if (this.newWarehouseName) {
        api.warehouse.addWarehouse({ name: this.newWarehouseName }).then(response => {
          this.warehouses.push(response.data); // 添加新仓库到列表
          this.newWarehouseName = ''; // 清空输入框
        }).catch(error => {
          console.error("添加仓库失败:", error);
        });
      }
    },
    deleteWarehouse(id) {
      api.warehouse.deleteWarehouse(id).then(() => {
        this.warehouses = this.warehouses.filter(warehouse => warehouse.id !== id); // 从列表中移除
      }).catch(error => {
        console.error("删除仓库失败:", error);
      });
    },
    resetNewProduct() {
      this.newProduct = { // 重置新产品信息
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
    },
    updateProductWarehouse() {
      const transferRequest = {
        productId: this.transferProductId,
        newWarehouseId: this.newWarehouseId // 使用新仓库 ID
      };

      // 调用更新产品仓库的 API
      api.product.updateProductWarehouse(transferRequest).then(response => {
        this.transferMessage = response.data; // 显示转移记录
        this.transferProductId = ''; // 清空输入框
        this.newWarehouseId = ''; // 清空输入框
      }).catch(error => {
        console.error("更新产品仓库失败:", error);
        this.transferMessage = "更新失败: " + (error.response.data.message || "未知错误"); // 显示错误信息
      });
    }
  }
};
</script>

<style scoped>
.aside {
  background-color: #f5f5f5; /* 左侧菜单背景色 */
}

.logo-container {
  text-align: center; /* Logo 居中 */
  padding: 10px 0; /* Logo 上下内边距 */
}

.logo {
  width: 100%; /* Logo 宽度为 100% */
  max-width: 180px; /* Logo 最大宽度 */
  height: auto; /* 高度自适应 */
}

.menu-top-space {
  height: 20px; /* 设置空白区域的高度 */
}

.header {
  background-color: #409EFF; /* Header 背景色 */
  color: white; /* Header 字体颜色 */
  text-align: center; /* Header 文本居中 */
  line-height: 60px; /* Header 高度 */
}

.main {
  background-color: #ffffff; /* Main 内容区域背景色 */
  padding: 20px; /* Main 内边距 */
}

.footer {
  background-color: #f0f0f0; /* Footer 背景色 */
  text-align: center; /* Footer 文本居中 */
  line-height: 60px; /* Footer 高度 */
}

.transfer-record {
  margin-bottom: 20px; /* 每条记录之间的间距 */
  padding: 10px; /* 内边距 */
  border: 1px solid #e0e0e0; /* 边框 */
  border-radius: 5px; /* 圆角 */
  background-color: #f9f9f9; /* 背景色 */
}
</style>