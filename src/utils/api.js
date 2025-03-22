import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true
});

// 设置默认的 Authorization 头
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // 从 localStorage 获取 token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // 设置 Authorization 头
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 导出 API 方法
export default {
  // 验证码相关
  captcha: {
    get() {
      return request.get('/captcha', {
        responseType: 'arraybuffer',
        withCredentials: true
      });
    },
    verify(captcha) {
      return request.post('/captcha/verify', null, {
        params: { captcha },
        withCredentials: true
      });
    }
  },

  // 用户登录
  login(data) {
    return request.post('/user/login', data);
  },

  // 企业管理相关
  enterprise: {
    getAllEnterprises() {
      return request.get('/enterprise/all');
    }
  },

  // 用户管理相关
  user: {
    getEnabledUsers() {
      return request.get('/user/enabled');
    },
    getDisabledUsers() {
      return request.get('/user/disabled');
    },
    getAllUsers() {
      return request.get('/user/all');
    },
    getUserById(id) {
      return request.get(`/user/${id}`);
    },
    enableUser(id) {
      return request.post(`/user/enable/${id}`);
    },
    disableUser(id) {
      return request.post(`/user/disable/${id}`);
    },
    resetPassword(id, newPassword) {
      return request.post(`/user/reset-password/${id}`, { newPassword });
    },
    deleteUser(id) {
      return request.delete(`/user/delete/${id}`);
    },
    addUser(user) {
      return request.post('/user/add', user);
    },
    updateUser(user) {
      return request.put('/user/update', user);
    },
    changePassword(id, newPassword) {
      // 直接传递新密码字符串
      return request.post(`/user/reset-password/${id}`, newPassword, {
        headers: {
          'Content-Type': 'text/plain' // 设置请求头为文本类型
        }})
      },
    changeUserType(id, newType) {
      return request.post(`/user/change-type/${id}`, { newType });
    }
  },

  // 货品管理相关
  product: {
    getAllProducts() {
      return request.get('/products/all'); // 获取所有产品
    },
    getWarehouseNameByProductId(productId) { // 根据产品ID获取仓库名称
      return request.get(`/products/${productId}/warehouse`);
    },
    addProduct(product) {
      return request.post('/products/add', product); // 添加产品
    },
    deleteProduct(id) {
      return request.delete(`/products/${id}`); // 删除产品
    },
    updateProductWarehouse(transferRequest) {
      return request.post('/products/update-warehouse', transferRequest); // 更新产品仓库
    }
  },

  // 仓库管理相关
  warehouse: {
    getAllWarehouses() {
      return request.get('/warehouses');
    },
    addWarehouse(warehouse) {
      return request.post('/warehouses', warehouse);
    },
    deleteWarehouse(id) {
      return request.delete(`/warehouses/${id}`);
    }
  },

  // 转移记录相关
  transferRecord: {
    fetchAllTransferRecords() {
        return request.get('/transfer-records/all'); // 获取所有转移记录
    }
  }
};