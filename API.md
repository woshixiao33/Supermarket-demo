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
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 商品相关接口

### 1. 获取商品分类列表

**请求**: `GET /categories`

**响应示例**:
```json
{
  "code": 200,
  "data": [
    { "id": "fruit", "name": "新鲜水果" },
    { "id": "vegetable", "name": "时令蔬菜" }
  ]
}
```

### 2. 获取商品列表

**请求**: `GET /products`

**查询参数**:
- `categoryId` (可选): 分类ID
- `q` (可选): 搜索关键词

**响应示例**:
```json
{
  "code": 200,
  "data": [
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
}
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
  "code": 200,
  "data": {
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
  "code": 200,
  "data": { "success": true, "cart": { "p1": 1 } }
}
```

---

## 订单相关接口

### 1. 创建订单（结算）

**请求**: `POST /checkout`

**响应示例**:
```json
{
  "code": 200,
  "data": { "success": true, "orderId": "MOCK1234567890" }
}
```

### 2. 获取订单列表

**请求**: `GET /orders`

**查询参数**:
- `status` (可选): 订单状态（pending/paid/shipped/received/refund）

**响应示例**:
```json
{
  "code": 200,
  "data": [
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
}
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

**响应示例**:
```json
{
  "code": 200,
  "data": { "avatar": "http://localhost:3001/uploads/xxx.jpg" },
  "message": "头像修改成功"
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

### 3. 批量删除已读消息

**请求**: `DELETE /messages`

**请求体**:
```json
{
  "ids": ["m1", "m2"]
}
```

**说明**: 不传 `ids` 参数则删除所有已读消息

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

### 3. 编辑地址

**请求**: `PUT /addresses/:id`

**请求体**: 同新增地址

### 4. 删除地址

**请求**: `DELETE /addresses/:id`

### 5. 设置默认地址

**请求**: `PUT /addresses/:id/default`

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

### 3. 取消收藏

**请求**: `DELETE /favorites/:productId`

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

## 静态资源

上传的头像图片可通过以下URL访问：
```
http://localhost:3001/uploads/<filename>
```
