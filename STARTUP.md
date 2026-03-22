# 启动指南

## 方式一：使用启动脚本（推荐）

### 1. 启动后端服务
打开第一个终端窗口，执行：
```bash
cd /Users/wangshanshan/fresh-supermarket-demo
./start-server.sh
```

等待看到输出：
```
API server is running on http://localhost:3001
```

### 2. 启动前端服务
打开第二个终端窗口，执行：
```bash
cd /Users/wangshanshan/fresh-supermarket-demo
./start-web.sh
```

等待看到输出：
```
VITE v6.0.5  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### 3. 访问应用
打开浏览器，访问：http://localhost:3000

---

## 方式二：手动启动

### 启动后端
```bash
cd /Users/wangshanshan/fresh-supermarket-demo/server
node index.js
```

### 启动前端（新终端）
```bash
cd /Users/wangshanshan/fresh-supermarket-demo/web
npm install  # 首次运行需要安装依赖
npm run dev
```

---

## 已修复的问题

1. ✅ 移除了 `zustand` 的 `persist` 中间件依赖，避免持久化导致的潜在问题
2. ✅ 添加了启动脚本，简化启动流程
3. ✅ 确保所有依赖都已正确配置

---

## 常见问题

### 如果前端启动失败
1. 确保后端服务已启动（3001端口）
2. 删除 `web/node_modules` 文件夹，重新运行 `npm install`

### 如果端口被占用
修改 `server/index.js` 中的 `PORT` 和 `web/vite.config.ts` 中的 `port`

### 如果遇到 CORS 错误
确保后端已正确配置 `cors` 中间件
