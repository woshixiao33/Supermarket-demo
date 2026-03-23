# 鲜生活超市 Demo

基于 Vue 3 + Vite + TypeScript（前端）和 Node.js + Express（后端）的移动端生鲜超市 Demo 项目。

## 项目结构

```
fresh-supermarket-demo/
├── server/                 # 后端服务
│   ├── index.js           # 主服务器文件（Express + REST API）
│   ├── uploads/           # 上传文件存储目录（头像等）
│   └── package.json
├── web/                    # 前端项目
│   ├── src/
│   │   ├── api/           # API 请求封装（Axios）
│   │   ├── components/    # Vue 组件（Layout 等）
│   │   ├── pages/         # 页面（Home、Profile、Cart 等）
│   │   ├── store/         # Pinia 状态管理
│   │   ├── router/        # Vue Router 路由配置
│   │   ├── App.vue        # 应用入口
│   │   └── index.css      # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── start-server.sh         # 后端启动脚本
├── start-web.sh            # 前端启动脚本
├── STARTUP.md             # 详细启动指南
└── API.md                 # 接口文档
```

## 技术栈

### 前端
- **框架**: Vue 3.5（Composition API）
- **构建工具**: Vite 5
- **语言**: TypeScript
- **路由**: Vue Router 4.4
- **状态管理**: Pinia 2.2
- **HTTP 请求**: Axios 1.7
- **UI**: 自定义移动端样式（参考美团外卖、饿了么等主流外卖App）

### 后端
- **框架**: Node.js + Express 5.2
- **跨域**: CORS 2.8
- **文件上传**: Multer 2.1
- **数据存储**: 内存（模拟数据库，重启后数据重置）

## 功能模块

### 首页（Home）
- **定位功能**：精确到小区/楼宇位置选择（如：三里屯SOHO · A座）
- **搜索框**：商品搜索功能
- **消息铃铛**：未读消息红点提醒
- **固定头部**：白色背景，固定在App容器顶部，不随内容滚动

### 用户中心（Profile）
- **绿色渐变头部**：用户信息展示区
- **头像上传**：点击头像打开上传弹窗，支持图片预览
- **用户名编辑**：点击用户名或铅笔图标打开编辑弹窗
- **资产统计**：积分、优惠券、余额展示
- **快捷功能**：消息、设置等入口

### 订单管理
- 订单列表（支持状态筛选）
- 订单状态：待付款、待收货、待评价、退换/售后
- 订单详情展示

### 收货地址
- 地址列表管理
- 新增/编辑/删除地址
- 设置默认地址

### 消息中心
- 消息列表（分类筛选：系统/订单/活动）
- 标记已读/批量删除已读
- 未读消息红点提醒

### 我的收藏
- 收藏商品列表
- 取消收藏

### 客服中心
- 常见问题（FAQ）
- 在线聊天模拟

### 商品购物
- 首页商品展示
- 分类页（侧边栏分类导航）
- 商品详情
- 购物车管理
- 订单结算/支付结果页面

## 快速开始

### 方式一：使用启动脚本（推荐）

#### 1. 启动后端服务
打开第一个终端窗口，执行：
```bash
./start-server.sh
```
等待看到输出：`API server is running on http://localhost:3001`

#### 2. 启动前端服务
打开第二个终端窗口，执行：
```bash
./start-web.sh
```
等待看到输出：`Local: http://localhost:3000/`

#### 3. 访问应用
打开浏览器，访问：http://localhost:3000

---

### 方式二：手动启动

#### 启动后端
```bash
cd server
npm install
node index.js
```
后端服务运行在 `http://localhost:3001`

#### 启动前端（新终端）
```bash
cd web
npm install
npm run dev
```
前端服务运行在 `http://localhost:3000`

---

详细启动说明请查看 [STARTUP.md](./STARTUP.md)

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

使用 Pinia 进行状态管理，主要 Store：

1. **cartStore**: 购物车数量管理
2. **userStore**: 用户信息管理
3. **messageStore**: 消息未读数管理

### 路由配置

使用 Vue Router 4 进行页面路由管理，主要路由：

| 路径 | 页面 | 说明 |
|------|------|------|
| / | 首页 | 商品展示、定位、搜索 |
| /home | 首页 | 商品展示、定位、搜索 |
| /category | 分类页 | 侧边栏分类导航 |
| /product/:id | 商品详情 | 商品信息、加入购物车 |
| /cart | 购物车 | 购物车列表、结算 |
| /profile | 我的 | 用户中心、头像上传 |
| /messages | 消息中心 | 消息列表、分类筛选 |
| /orders | 订单列表 | 支持状态筛选 |
| /address | 收货地址 | 地址列表 |
| /address/new | 新增地址 | 地址表单 |
| /address/:id/edit | 编辑地址 | 地址表单 |
| /favorites | 我的收藏 | 收藏列表 |
| /customer-service | 客服中心 | FAQ、在线聊天 |
| /payment-result/:orderId | 支付结果 | 支付成功页面 |

### 关键功能实现

#### 首页固定头部
使用 CSS `position: fixed` 实现固定头部，限制宽度在 App 容器内：
```css
position: fixed;
top: 0;
left: 50%;
transform: translateX(-50%);
max-width: 430px;
width: 100%;
z-index: 100;
```

#### 用户名编辑
- 点击用户名或铅笔图标打开编辑弹窗
- 使用统一的 Dialog 组件系统
- 后端接口：`PUT /api/user/username`

#### 头像上传
- 点击头像打开上传弹窗
- 支持图片预览（限制：JPG/PNG，最大 5MB）
- 使用 FormData 上传
- 后端接口：`POST /api/user/avatar`

## 接口文档

详细接口文档请查看 [API.md](./API.md)

### 新增接口
- `PUT /api/user/username` - 更新用户名
- `POST /api/user/avatar` - 上传用户头像

## 项目特色

### UI 设计
- 参考主流外卖App（美团外卖、饿了么）的设计风格
- 移动端优先，适配各种屏幕尺寸
- 统一的弹窗和提示组件系统
- 流畅的动画效果（fadeIn、slideUp）

### 用户体验
- 首页头部固定，内容可流畅滚动
- 未读消息红点实时提醒
- 用户名/头像编辑功能友好易用
- 加载状态清晰提示

## 注意事项

1. **数据存储**：当前 Demo 使用内存存储数据，重启后端服务会清空所有数据
2. **文件上传**：头像上传的文件存储在 `server/uploads/` 目录（已通过 `.gitignore` 忽略）
3. **图片限制**：头像上传仅支持 JPG/PNG 格式，最大 5MB
4. **端口配置**：前端默认 3000，后端默认 3001，如有冲突请自行修改

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

## 常见问题

### Q: 前端启动失败怎么办？
A: 确保后端服务已启动，尝试删除 `web/node_modules` 后重新 `npm install`

### Q: 修改用户名没生效？
A: 需要重启后端服务才能加载新的 API 路由

### Q: 上传的头像在哪里？
A: 上传的文件存储在 `server/uploads/` 目录，可通过 `http://localhost:3001/uploads/<filename>` 访问

### Q: 如何更改端口？
A: 修改 `server/index.js` 中的 `PORT` 和 `web/vite.config.ts` 中的 `server.port`
