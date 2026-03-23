# 鲜生活超市 API 文档

## 基础信息

- **基础URL**: `http://localhost:3001/api`
- **响应格式**: JSON
- **统一响应格式**:
```json
{
  "code": 200,
  "data": {},
  "message": "操作成功"
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |

---

## 商品相关接口

### 1. 获取商品分类列表

**请求**: `GET /categories`

**响应示例**:
```json
[
  { "id": "fruit", "name": "新鲜水果" },
  { "id": "vegetable", "name": "时令蔬菜" },
  { "id": "meat", "name": "肉禽蛋品" },
  { "id": "seafood", "name": "海鲜水产" },
  { "id": "snack", "name": "休闲零食" },
  { "id": "drink", "name": "酒水饮料" },
  { "id": "frozen", "name": "冷冻食品" },
  { "id": "daily", "name": "日配乳品" }
]
```

### 2. 获取商品列表

**请求**: `GET /products`

**查询参数**:
- `categoryId` (可选): 分类ID
- `q` (可选): 搜索关键词

**响应示例**:
```json
[
  {
    "id": "p1",
    "name": "新西兰奇异果 6个装",
    "price": 19.9,
    "stock": 100,
    "categoryId": "fruit",
    "image": "https://...",
    "tags": ["进口", "维C丰富"],
    "desc": "产地直采，新鲜多汁。"
  }
]
```

### 3. 获取商品详情

**请求**: `GET /products/:id`

**响应示例**: 同商品列表中的单个商品对象

---

## 购物车相关接口

### 1. 获取购物车

**请求**: `GET /cart`

**响应示例**:
```json
{
  "items": [
    {
      "productId": "p1",
      "quantity": 2,
      "product": { /* 商品详情 */ },
      "amount": 39.8
    }
  ],
  "totalAmount": 39.8
}
```

### 2. 添加/更新购物车

**请求**: `POST /cart`

**请求体**:
```json
{
  "productId": "p1",
  "quantity": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "cart": { "p1": 1 }
}
```

---

## 订单相关接口

### 1. 创建订单（结算）

**请求**: `POST /checkout`

**响应示例**:
```json
{
  "success": true,
  "orderId": "MOCK1234567890"
}
```

### 2. 获取订单列表

**请求**: `GET /orders`

**查询参数**:
- `status` (可选): 订单状态（pending/paid/shipped/received/refund）

**响应示例**:
```json
[
  {
    "orderId": "MOCK1234567890",
    "status": "已支付",
    "totalAmount": 39.8,
    "createdAt": 1710000000000,
    "previewImage": "https://...",
    "previewName": "新西兰奇异果 6个装",
    "itemCount": 2
  }
]
```

---

## 用户相关接口

### 1. 获取用户信息

**请求**: `GET /user/info`

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "id": "user001",
    "username": "鲜生活达人",
    "avatar": "https://...",
    "memberLevel": "黄金会员",
    "points": 28,
    "coupons": 12,
    "balance": 125
  }
}
```

### 2. 上传头像

**请求**: `POST /user/avatar`

**Content-Type**: `multipart/form-data`

**请求体**: FormData 字段 `avatar` (文件)

**文件限制**: 
- 类型: JPG/PNG
- 大小: 最大 5MB

**响应示例**:
```json
{
  "code": 200,
  "data": { "avatar": "http://localhost:3001/uploads/xxx.jpg" },
  "message": "头像修改成功"
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "请上传头像"
}
```

### 3. 更新用户名

**请求**: `PUT /user/username`

**请求体**:
```json
{
  "username": "新用户名"
}
```

**请求限制**:
- 用户名不能为空
- 用户名不能超过20个字符
- 自动去除首尾空格

**响应示例**:
```json
{
  "code": 200,
  "data": { "username": "新用户名" },
  "message": "用户名修改成功"
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "用户名不能为空"
}
```
```json
{
  "code": 400,
  "message": "用户名不能超过20个字符"
}
```

---

## 消息相关接口

### 1. 获取消息列表

**请求**: `GET /messages`

**查询参数**:
- `type` (可选): 消息类型（system/order/activity）

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "m1",
      "type": "system",
      "title": "系统通知",
      "content": "欢迎来到鲜生活！",
      "isRead": false,
      "createdAt": 1710000000000
    }
  ]
}
```

### 2. 标记消息为已读

**请求**: `PUT /messages/:id/read`

**响应示例**:
```json
{
  "code": 200,
  "message": "标记成功"
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "消息不存在"
}
```

### 3. 批量删除已读消息

**请求**: `DELETE /messages`

**请求体**:
```json
{
  "ids": ["m1", "m2"]
}
```

**说明**: 
- 不传 `ids` 参数则删除所有已读消息
- 只能删除已读的消息

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 收货地址相关接口

### 1. 获取地址列表

**请求**: `GET /addresses`

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "addr1",
      "name": "张三",
      "phone": "138****1234",
      "province": "上海市",
      "city": "浦东新区",
      "district": "张江镇",
      "detail": "科苑路88号",
      "isDefault": true
    }
  ]
}
```

**说明**: 默认地址排序在列表顶部

### 2. 新增地址

**请求**: `POST /addresses`

**请求体**:
```json
{
  "name": "张三",
  "phone": "13800138000",
  "province": "上海市",
  "city": "浦东新区",
  "district": "张江镇",
  "detail": "科苑路88号",
  "isDefault": false
}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "id": "addr1234567890",
    "name": "张三",
    "phone": "13800138000",
    "province": "上海市",
    "city": "浦东新区",
    "district": "张江镇",
    "detail": "科苑路88号",
    "isDefault": false
  },
  "message": "添加成功"
}
```

### 3. 编辑地址

**请求**: `PUT /addresses/:id`

**请求体**: 同新增地址（部分字段可更新）

**响应示例**:
```json
{
  "code": 200,
  "message": "修改成功"
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "地址不存在"
}
```

### 4. 删除地址

**请求**: `DELETE /addresses/:id`

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "地址不存在"
}
```

### 5. 设置默认地址

**请求**: `PUT /addresses/:id/default`

**响应示例**:
```json
{
  "code": 200,
  "message": "设置成功"
}
```

---

## 收藏相关接口

### 1. 获取收藏列表

**请求**: `GET /favorites`

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "productId": "p1",
      "createdAt": 1710000000000,
      "product": { /* 商品详情 */ }
    }
  ]
}
```

### 2. 添加收藏

**请求**: `POST /favorites`

**请求体**:
```json
{
  "productId": "p1"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "收藏成功"
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "已收藏"
}
```

### 3. 取消收藏

**请求**: `DELETE /favorites/:productId`

**响应示例**:
```json
{
  "code": 200,
  "message": "取消收藏成功"
}
```

**错误响应**:
```json
{
  "code": 404,
  "message": "收藏不存在"
}
```

---

## 客服相关接口

### 1. 获取常见问题

**请求**: `GET /customer-service/faq`

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "q1",
      "question": "如何联系客服？",
      "answer": "您可以点击页面底部的\"联系在线客服\"按钮，或拨打客服热线400-888-8888。"
    },
    {
      "id": "q2",
      "question": "如何申请退换货？",
      "answer": "进入订单详情页，点击\"申请售后\"按钮，填写退换货原因即可。"
    },
    {
      "id": "q3",
      "question": "配送时间是多久？",
      "answer": "同城配送通常2小时内送达，异地配送1-3个工作日。"
    },
    {
      "id": "q4",
      "question": "如何使用优惠券？",
      "answer": "在结算页面选择适用的优惠券即可抵扣订单金额。"
    }
  ]
}
```

### 2. 发送消息

**请求**: `POST /customer-service/chat`

**请求体**:
```json
{
  "message": "你好，我想咨询一下"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "发送成功"
}
```

**说明**: 
- 消息发送成功后，系统会在1秒后自动回复（模拟客服）
- 回复内容从预设回复中随机选择

### 3. 获取聊天记录

**请求**: `GET /customer-service/chat`

**响应示例**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "role": "user",
      "content": "你好",
      "time": 1710000000000
    },
    {
      "id": 2,
      "role": "bot",
      "content": "您好，请问有什么可以帮助您的？",
      "time": 1710000001000
    }
  ]
}
```

---

## 优惠券相关接口

### 1. 获取优惠券列表

**请求**: `GET /coupons`

**查询参数**:
- `status` (可选): 优惠券状态（available/used/expired）

**响应示例**:
```json
[
  {
    "id": "c1",
    "title": "新人专享券",
    "amount": 20,
    "minAmount": 100,
    "category": "全场通用",
    "status": "available",
    "validUntil": 1710000000000,
    "description": "新用户首单满100减20"
  }
]
```

**优惠券状态说明**:
- `available`: 可使用
- `used`: 已使用
- `expired`: 已过期

---

## 静态资源

上传的头像图片可通过以下URL访问：
```
http://localhost:3001/uploads/<filename>
```

**注意**:
- 上传文件存储在 `server/uploads/` 目录
- 文件名由 Multer 自动生成
- 文件夹已通过 `.gitignore` 忽略，不会被提交到 Git 仓库

---

## 数据存储说明

当前 Demo 使用内存存储数据，重启后端服务会清空所有数据。包括：
- 购物车数据
- 订单数据
- 用户信息（部分数据）
- 消息数据
- 收货地址
- 收藏数据
- 客服聊天记录

生产环境建议使用真实的数据库（MySQL、PostgreSQL 等）进行持久化存储。
