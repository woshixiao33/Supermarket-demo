# 鲜生活超市 Demo

基于 React + Vite + TypeScript（前端）和 Node.js + Express（后端）的移动端生鲜超市 Demo 项目。

## 项目结构

```
fresh-supermarket-demo/
├── server/                 # 后端服务
│   ├── index.js           # 主服务器文件
│   ├── uploads/           # 上传文件存储目录
│   └── package.json
├── web/                    # 前端项目
│   ├── src/
│   │   ├── api/           # API 请求封装
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── store/         # 状态管理
│   │   ├── types/         # TypeScript 类型定义
│   │   ├── App.tsx        # 应用入口
│   │   ├── main.tsx
│   │   └── index.css      # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── API.md                  # 接口文档
```

## 技术栈

### 前端
- **框架**: React 18
- **构建工具**: Vite 6
- **语言**: TypeScript
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP 请求**: Axios
- **UI**: 自定义移动端样式（类似 Ant Design Mobile / Vant）

### 后端
- **框架**: Node.js + Express 5
- **跨域**: CORS
- **文件上传**: Multer
- **数据存储**: 内存（模拟数据库）

## 功能模块

### 用户中心
- 用户信息展示（头像、用户名、会员等级）
- 头像上传/修改（支持图片裁剪）
- 资产统计（积分、优惠券、余额）
- 快捷功能入口

### 订单管理
- 订单列表（支持状态筛选）
- 订单状态：待付款、待收货、待评价、退换/售后
- 订单详情展示

### 收货地址
- 地址列表
- 新增/编辑/删除地址
- 设置默认地址

### 消息中心
- 消息列表（分类筛选）
- 标记已读
- 批量删除已读消息

### 我的收藏
- 收藏商品列表
- 取消收藏

### 客服中心
- 常见问题（FAQ）
- 在线聊天

### 商品购物
- 首页（分类、商品推荐）
- 分类页（侧边栏分类导航）
- 商品详情
- 购物车管理
- 订单结算

## 快速开始

### 后端启动

```bash
cd server
npm install
node index.js
```

后端服务将运行在 `http://localhost:3001`

### 前端启动

```bash
cd web
npm install
npm run dev
```

前端服务将运行在 `http://localhost:3000`

访问 `http://localhost:3000` 即可查看应用。

## 开发说明

### API 配置

前端通过 Vite 代理配置将 `/api` 请求代理到后端服务：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

### 状态管理

使用 Zustand 进行状态管理，主要有两个 store：

1. **cartStore**: 购物车数量管理（持久化到 localStorage）
2. **userStore**: 用户信息管理

### 路由配置

使用 React Router v6 进行页面路由管理，主要路由：

| 路径 | 页面 | 说明 |
|------|------|------|
| /home | 首页 | 商品展示、分类导航 |
| /category | 分类页 | 侧边栏分类导航 |
| /product/:id | 商品详情 | 商品信息、加入购物车 |
| /cart | 购物车 | 购物车列表、结算 |
| /profile | 我的 | 用户中心 |
| /messages | 消息中心 | 消息列表 |
| /orders | 订单列表 | 支持状态筛选 |
| /address | 收货地址 | 地址列表 |
| /address/new | 新增地址 | 地址表单 |
| /address/:id/edit | 编辑地址 | 地址表单 |
| /favorites | 我的收藏 | 收藏列表 |
| /customer-service | 客服中心 | FAQ、在线聊天 |
| /payment-result/:orderId | 支付结果 | 支付成功页面 |

## 接口文档

详细接口文档请查看 [API.md](./API.md)

## 注意事项

1. 当前 Demo 使用内存存储数据，重启后端服务会清空所有数据
2. 头像上传的文件存储在 `server/uploads/` 目录
3. 部分高级功能（如图片裁剪）使用浏览器原生功能简化实现
4. 生产环境建议使用真实的数据库（MySQL）和对象存储服务

## 未来优化

- [ ] 集成真实的数据库（MySQL）
- [ ] 实现完整的用户认证（JWT）
- [ ] 集成支付宝/微信支付
- [ ] 优化图片上传（裁剪、压缩）
- [ ] 添加更多商品数据
- [ ] 实现搜索功能
- [ ] 添加订单评价功能
- [ ] 实现优惠券系统
- [ ] 添加积分商城
