const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 文件上传配置
const upload = multer({ dest: 'uploads/' });

// Mock categories
const categories = [
  { id: 'fruit', name: '新鲜水果' },
  { id: 'vegetable', name: '时令蔬菜' },
  { id: 'meat', name: '肉禽蛋品' },
  { id: 'seafood', name: '海鲜水产' },
  { id: 'snack', name: '休闲零食' },
  { id: 'drink', name: '酒水饮料' },
  { id: 'frozen', name: '冷冻食品' },
  { id: 'daily', name: '日配乳品' }
];

// Mock products
const products = [
  {
    id: 'p1',
    name: '新西兰奇异果 6个装',
    price: 19.9,
    stock: 100,
    categoryId: 'fruit',
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400&q=80',
    tags: ['进口', '维C丰富'],
    desc: '产地直采，新鲜多汁。'
  },
  {
    id: 'p2',
    name: '有机西红柿 500g',
    price: 9.9,
    stock: 80,
    categoryId: 'vegetable',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
    tags: ['有机', '沙拉必备'],
    desc: '自然熟成，酸甜可口。'
  },
  {
    id: 'p3',
    name: '优选鸡胸肉 500g',
    price: 18.9,
    stock: 60,
    categoryId: 'meat',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80',
    tags: ['低脂', '高蛋白'],
    desc: '适合健身人群的优质蛋白来源。'
  },
  {
    id: 'p4',
    name: '鲜活大闸蟹 500g',
    price: 58.9,
    stock: 30,
    categoryId: 'seafood',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80',
    tags: ['鲜活', '当季'],
    desc: '精选优质大闸蟹，个大肥美。'
  },
  {
    id: 'p5',
    name: '混合坚果 200g',
    price: 29.9,
    stock: 50,
    categoryId: 'snack',
    image: 'https://images.unsplash.com/photo-1608032077018-c9aad5e0e35f?w=400&q=80',
    tags: ['健康', '无添加'],
    desc: '多种坚果混合，营养美味。'
  },
  {
    id: 'p6',
    name: '鲜榨橙汁 1L',
    price: 16.9,
    stock: 45,
    categoryId: 'drink',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80',
    tags: ['现榨', '维C'],
    desc: '新鲜橙子鲜榨，酸甜可口。'
  },
  {
    id: 'p7',
    name: '三文鱼切片 300g',
    price: 45.9,
    stock: 25,
    categoryId: 'frozen',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&q=80',
    tags: ['刺身级', '深海'],
    desc: '挪威进口三文鱼，肉质鲜美。'
  },
  {
    id: 'p8',
    name: '有机纯牛奶 1L',
    price: 12.9,
    stock: 100,
    categoryId: 'daily',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
    tags: ['有机', '高钙'],
    desc: '牧场直供，营养健康。'
  },
  // 百亿补贴 - 米面粮油牛奶
  {
    id: 'p200',
    name: '东北优质大米 5kg',
    price: 39.9,
    stock: 100,
    categoryId: 'grain',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    tags: ['东北', '新米'],
    desc: '黑土地种植，软糯香甜',
    tag: '百亿补贴'
  },
  {
    id: 'p201',
    name: '五谷杂粮组合 1kg',
    price: 29.9,
    stock: 80,
    categoryId: 'grain',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9919f1a3bb?w=400&q=80',
    tags: ['健康', '粗粮'],
    desc: '科学配比，营养均衡',
    tag: '百亿补贴'
  },
  {
    id: 'p202',
    name: '金龙鱼花生油 5L',
    price: 89.9,
    stock: 60,
    categoryId: 'oil',
    image: 'https://images.unsplash.com/photo-1596527653716-3d64547dd485?w=400&q=80',
    tags: ['花生', '健康'],
    desc: '物理压榨，香味浓郁',
    tag: '百亿补贴'
  },
  {
    id: 'p203',
    name: '金龙鱼玉米油 5L',
    price: 79.9,
    stock: 70,
    categoryId: 'oil',
    image: 'https://images.unsplash.com/photo-1596527653716-3d64547dd485?w=400&q=80',
    tags: ['玉米', '清淡'],
    desc: '非转基因，营养健康',
    tag: '百亿补贴'
  },
  {
    id: 'p204',
    name: '金龙鱼调和油 5L',
    price: 69.9,
    stock: 90,
    categoryId: 'oil',
    image: 'https://images.unsplash.com/photo-1596527653716-3d64547dd485?w=400&q=80',
    tags: ['调和', '均衡'],
    desc: '多种植物油科学配比',
    tag: '百亿补贴'
  },
  {
    id: 'p205',
    name: '东北拉条子 1kg',
    price: 12.9,
    stock: 120,
    categoryId: 'noodle',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
    tags: ['小麦', '劲道'],
    desc: '传统工艺，口感劲道',
    tag: '百亿补贴'
  },
  {
    id: 'p206',
    name: '进口意大利面 500g',
    price: 15.9,
    stock: 100,
    categoryId: 'noodle',
    image: 'https://images.unsplash.com/photo-1551183053-bf91b1d31171?w=400&q=80',
    tags: ['进口', '意大利'],
    desc: '意大利原装进口',
    tag: '百亿补贴'
  },
  {
    id: 'p207',
    name: '有机燕麦片 500g',
    price: 22.9,
    stock: 85,
    categoryId: 'grain',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80',
    tags: ['有机', '早餐'],
    desc: '膳食纤维丰富',
    tag: '百亿补贴'
  },
  {
    id: 'p208',
    name: '伊利纯牛奶 24盒装',
    price: 59.9,
    stock: 150,
    categoryId: 'daily',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
    tags: ['伊利', '纯牛奶'],
    desc: '24盒装，家庭装',
    tag: '百亿补贴'
  },
  {
    id: 'p209',
    name: '蒙牛纯牛奶 24盒装',
    price: 56.9,
    stock: 140,
    categoryId: 'daily',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    tags: ['蒙牛', '纯牛奶'],
    desc: '24盒装，营养美味',
    tag: '百亿补贴'
  },
  {
    id: 'p210',
    name: '光明酸奶 12杯装',
    price: 32.9,
    stock: 100,
    categoryId: 'daily',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    tags: ['光明', '酸奶'],
    desc: '原味酸奶，酸甜可口',
    tag: '百亿补贴'
  },
  {
    id: 'p211',
    name: '有机牛奶 1L',
    price: 18.9,
    stock: 90,
    categoryId: 'daily',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
    tags: ['有机', '高钙'],
    desc: '有机牧场，天然健康',
    tag: '百亿补贴'
  },
  // 官方立减 - 酒水专场
  {
    id: 'p300',
    name: '茅台飞天53度 500ml',
    price: 1499.0,
    stock: 30,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
    tags: ['茅台', '53度'],
    desc: '酱香型白酒，国酒经典',
    tag: '官方立减'
  },
  {
    id: 'p301',
    name: '五粮液 52度 500ml',
    price: 1199.0,
    stock: 40,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
    tags: ['五粮液', '52度'],
    desc: '浓香型白酒，宜宾名酒',
    tag: '官方立减'
  },
  {
    id: 'p302',
    name: '泸州老窖 52度 500ml',
    price: 399.0,
    stock: 60,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
    tags: ['泸州老窖', '52度'],
    desc: '浓香型白酒，窖香浓郁',
    tag: '官方立减'
  },
  {
    id: 'p303',
    name: '剑南春 52度 500ml',
    price: 459.0,
    stock: 50,
    categoryId: 'alcohol',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
    tags: ['剑南春', '52度'],
    desc: '浓香型白酒，川酒六朵金花',
    tag: '官方立减'
  },
  {
    id: 'p304',
    name: '青岛啤酒 12瓶装',
    price: 49.9,
    stock: 200,
    categoryId: 'beer',
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&q=80',
    tags: ['青岛', '啤酒'],
    desc: '经典拉格，清爽好喝',
    tag: '官方立减'
  },
  {
    id: 'p305',
    name: '雪花啤酒 24罐装',
    price: 69.9,
    stock: 180,
    categoryId: 'beer',
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&q=80',
    tags: ['雪花', '啤酒'],
    desc: '勇闯天涯，口感清爽',
    tag: '官方立减'
  },
  {
    id: 'p306',
    name: '哈尔滨啤酒 12瓶装',
    price: 39.9,
    stock: 160,
    categoryId: 'beer',
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&q=80',
    tags: ['哈尔滨', '啤酒'],
    desc: '冰纯系列，清爽甘醇',
    tag: '官方立减'
  },
  {
    id: 'p307',
    name: '百威啤酒 12罐装',
    price: 59.9,
    stock: 150,
    categoryId: 'beer',
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&q=80',
    tags: ['百威', '啤酒'],
    desc: '美国品牌，世界销量第一',
    tag: '官方立减'
  },
  {
    id: 'p308',
    name: '张裕解百纳红酒 750ml',
    price: 128.0,
    stock: 80,
    categoryId: 'wine',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    tags: ['张裕', '红酒'],
    desc: '干红葡萄酒，果香浓郁',
    tag: '官方立减'
  },
  {
    id: 'p309',
    name: '长城红酒 750ml',
    price: 88.0,
    stock: 90,
    categoryId: 'wine',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    tags: ['长城', '红酒'],
    desc: '干红葡萄酒，入口柔和',
    tag: '官方立减'
  },
  {
    id: 'p310',
    name: '进口红酒礼盒 2瓶装',
    price: 199.0,
    stock: 60,
    categoryId: 'wine',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    tags: ['进口', '红酒'],
    desc: '法国进口，优雅醇厚',
    tag: '官方立减'
  },
  {
    id: 'p311',
    name: '杰克丹尼威士忌 750ml',
    price: 299.0,
    stock: 50,
    categoryId: 'spirit',
    image: 'https://images.unsplash.com/photo-1596466614080-5623f7f82596?w=400&q=80',
    tags: ['威士忌', '进口'],
    desc: '田纳西威士忌，世界知名',
    tag: '官方立减'
  },
  {
    id: 'p312',
    name: '百龄坛特醇威士忌 700ml',
    price: 259.0,
    stock: 55,
    categoryId: 'spirit',
    image: 'https://images.unsplash.com/photo-1596466614080-5623f7f82596?w=400&q=80',
    tags: ['威士忌', '进口'],
    desc: '苏格兰威士忌，口感醇厚',
    tag: '官方立减'
  },
  {
    id: 'p313',
    name: '伏特加 700ml',
    price: 189.0,
    stock: 65,
    categoryId: 'spirit',
    image: 'https://images.unsplash.com/photo-1596466614080-5623f7f82596?w=400&q=80',
    tags: ['伏特加', '进口'],
    desc: '俄罗斯伏特加，纯净顺滑',
    tag: '官方立减'
  },
  {
    id: 'p314',
    name: '白兰地 700ml',
    price: 229.0,
    stock: 70,
    categoryId: 'spirit',
    image: 'https://images.unsplash.com/photo-1596466614080-5623f7f82596?w=400&q=80',
    tags: ['白兰地', '进口'],
    desc: '法国白兰地，橡木桶陈酿',
    tag: '官方立减'
  },
  // 春节活动商品
  {
    id: 'p100',
    name: '智利进口车厘子礼盒',
    price: 188.0,
    stock: 50,
    categoryId: 'fruit',
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80',
    tags: ['进口', '礼盒装'],
    desc: '智利空运，果大核小，鲜甜多汁',
    tag: '年货价'
  },
  {
    id: 'p101',
    name: '深海大黄鱼 700g/条',
    price: 68.0,
    stock: 30,
    categoryId: 'seafood',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&q=80',
    tags: ['野生', '生鲜'],
    desc: '深海捕捞，新鲜直达',
    tag: '年货价'
  },
  {
    id: 'p102',
    name: '澳洲牛排套餐 1kg',
    price: 299.0,
    stock: 40,
    categoryId: 'meat',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
    tags: ['进口', '高蛋白'],
    desc: '澳洲谷饲，鲜嫩多汁',
    tag: '年货价'
  },
  {
    id: 'p103',
    name: '精品坚果礼盒 1.5kg',
    price: 128.0,
    stock: 60,
    categoryId: 'snack',
    image: 'https://images.unsplash.com/photo-1608032077098-1b223690d6ea?w=400&q=80',
    tags: ['健康', '无添加'],
    desc: '多种坚果混合，营养美味',
    tag: '年货价'
  },
  {
    id: 'p104',
    name: '鲜活大闸蟹 8只装',
    price: 398.0,
    stock: 25,
    categoryId: 'seafood',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80',
    tags: ['鲜活', '当季'],
    desc: '精选优质大闸蟹，个大肥美',
    tag: '年货价'
  },
  {
    id: 'p105',
    name: '有机蔬菜礼盒 3kg',
    price: 89.0,
    stock: 45,
    categoryId: 'vegetable',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
    tags: ['有机', '新鲜'],
    desc: '有机种植，绿色健康',
    tag: '年货价'
  }
];

// Simple in-memory cart: { productId: quantity }
let cart = {};

// Simple in-memory orders list: array of { orderId, items, totalAmount, status, createdAt }
let orders = [];

// Mock user data
let user = {
  id: 'user001',
  username: '鲜生活达人',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  memberLevel: '黄金会员',
  points: 28,
  coupons: 12,
  balance: 125
};

// Mock messages
let messages = [
  { id: 'm1', type: 'system', title: '系统通知', content: '欢迎来到鲜生活！', isRead: false, createdAt: Date.now() - 86400000 },
  { id: 'm2', type: 'order', title: '订单通知', content: '您的订单已发货', isRead: false, createdAt: Date.now() - 172800000 },
  { id: 'm3', type: 'activity', title: '活动通知', content: '限时优惠活动开始啦', isRead: true, createdAt: Date.now() - 259200000 }
];

// Mock addresses
let addresses = [
  { id: 'addr1', name: '张三', phone: '138****1234', province: '上海市', city: '浦东新区', district: '张江镇', detail: '科苑路88号', isDefault: true },
  { id: 'addr2', name: '张三', phone: '138****1234', province: '上海市', city: '浦东新区', district: '金桥镇', detail: '金桥路123号', isDefault: false }
];

// Mock favorites
let favorites = [
  { productId: 'p1', createdAt: Date.now() - 86400000 },
  { productId: 'p2', createdAt: Date.now() - 172800000 }
];

// Mock customer service FAQ
const faq = [
  { id: 'q1', question: '如何联系客服？', answer: '您可以点击页面底部的"联系在线客服"按钮，或拨打客服热线400-888-8888。' },
  { id: 'q2', question: '如何申请退换货？', answer: '进入订单详情页，点击"申请售后"按钮，填写退换货原因即可。' },
  { id: 'q3', question: '配送时间是多久？', answer: '同城配送通常2小时内送达，异地配送1-3个工作日。' },
  { id: 'q4', question: '如何使用优惠券？', answer: '在结算页面选择适用的优惠券即可抵扣订单金额。' }
];

// Mock customer service chat
let chatHistory = [];

// Mock coupons
let coupons = [
  {
    id: 'c1',
    title: '新人专享券',
    amount: 20,
    minAmount: 100,
    category: '全场通用',
    status: 'available',
    validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    description: '新用户首单满100减20'
  },
  {
    id: 'c2',
    title: '满减优惠',
    amount: 50,
    minAmount: 200,
    category: '生鲜水果',
    status: 'available',
    validUntil: Date.now() + 15 * 24 * 60 * 60 * 1000,
    description: '水果类商品专享'
  },
  {
    id: 'c3',
    title: '会员专属券',
    amount: 30,
    minAmount: 150,
    category: '肉禽蛋品',
    status: 'used',
    validUntil: Date.now() + 7 * 24 * 60 * 60 * 1000,
    description: '会员专享优惠'
  },
  {
    id: 'c4',
    title: '限时特惠',
    amount: 15,
    minAmount: 80,
    category: '蔬菜类',
    status: 'expired',
    validUntil: Date.now() - 24 * 60 * 60 * 1000,
    description: '蔬菜类商品特惠'
  },
  {
    id: 'c5',
    title: '周末专享',
    amount: 25,
    minAmount: 120,
    category: '全场通用',
    status: 'available',
    validUntil: Date.now() + 5 * 24 * 60 * 60 * 1000,
    description: '周末购物专享'
  }
];

function buildCartItems() {
  return Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;
    return {
      productId,
      quantity,
      product,
      amount: Number((product.price * quantity).toFixed(2))
    };
  }).filter(Boolean);
}

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/products', (req, res) => {
  const { categoryId, q } = req.query;
  let result = [...products];

  if (categoryId) {
    result = result.filter(p => p.categoryId === categoryId);
  }
  if (q) {
    const kw = String(q).toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(kw));
  }

  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: '商品不存在' });
  res.json(product);
});

app.get('/api/cart', (req, res) => {
  const items = buildCartItems();

  const totalAmount = Number(items.reduce((sum, i) => sum + i.amount, 0).toFixed(2));

  res.json({ items, totalAmount });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(400).json({ message: '商品不存在' });

  const qty = Number(quantity) || 0;
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }

  res.json({ success: true, cart });
});

app.post('/api/checkout', (req, res) => {
  const { couponId, userId } = req.body;

  if (!Object.keys(cart).length) {
    return res.status(400).json({ message: '购物车为空' });
  }

  const items = buildCartItems();
  let totalAmount = Number(items.reduce((sum, i) => sum + i.amount, 0).toFixed(2));
  const orderId = 'MOCK' + Date.now();
  const currentUserId = userId || 'user001'; // 使用传递的userId或默认值

  // 优惠券折扣计算
  let couponDiscount = 0;
  let usedCoupon = null;

  if (couponId) {
    // 检查普通优惠券
    const coupon = coupons.find(c => c.id === couponId);
    // 检查春节活动优惠券 - 使用与getCoupons一致的key格式和minAmount
    const cnyCouponKey = `user_${currentUserId}_coupon_${couponId === 'cny50' ? '50' : '20'}`;
    const cnyCoupon = global.userCouponRecords?.[cnyCouponKey] ?
      { id: 'cny' + (couponId === 'cny50' ? '50' : '20'), amount: couponId === 'cny50' ? 50 : 20, minAmount: couponId === 'cny50' ? 299 : 129, title: couponId === 'cny50' ? '春节满减券' : '春节折扣券' } :
      null;

    const validCoupon = coupon || cnyCoupon;

    if (validCoupon) {
      if (totalAmount >= validCoupon.minAmount) {
        couponDiscount = validCoupon.amount;
        usedCoupon = {
          id: validCoupon.id,
          title: validCoupon.title || '优惠券',
          amount: validCoupon.amount
        };
        totalAmount = Number((totalAmount - couponDiscount).toFixed(2));

        // 标记优惠券为已使用
        if (couponId.startsWith('cny')) {
          // 春节活动优惠券
          const couponType = couponId === 'cny50' ? '50' : '20';
          const key = `user_${currentUserId}_coupon_${couponType}`;
          console.log(`[Checkout] 尝试更新优惠券状态, key: ${key}`);
          console.log(`[Checkout] userCouponRecords:`, JSON.stringify(global.userCouponRecords, null, 2));
          
          if (global.userCouponRecords && global.userCouponRecords[key]) {
            global.userCouponRecords[key].used = true;
            global.userCouponRecords[key].usedAt = Date.now();
            console.log(`[Checkout] 优惠券状态已更新为已使用:`, JSON.stringify(global.userCouponRecords[key], null, 2));
          } else {
            console.log(`[Checkout] 警告: 未找到优惠券记录, key: ${key}`);
          }
        } else {
          // 普通优惠券
          const couponIndex = coupons.findIndex(c => c.id === couponId);
          if (couponIndex !== -1) {
            coupons[couponIndex].status = 'used';
          }
        }
      }
    }
  }

  // Snapshot cart into order (in-memory demo)
  orders.unshift({
    orderId,
    items: items.map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      product: i.product,
      amount: i.amount
    })),
    totalAmount,
    originalAmount: totalAmount + couponDiscount,
    coupon: usedCoupon,
    status: '已支付',
    createdAt: Date.now()
  });

  cart = {};
  res.json({ success: true, orderId, totalAmount, couponDiscount });
});

app.get('/api/orders', (req, res) => {
  const { status } = req.query;
  let result = orders.map(o => ({
    orderId: o.orderId,
    status: o.status,
    totalAmount: o.totalAmount,
    originalAmount: o.originalAmount || o.totalAmount,
    coupon: o.coupon,
    couponDiscount: o.coupon?.amount || 0,
    createdAt: o.createdAt,
    previewImage: o.items?.[0]?.product?.image,
    previewName: o.items?.[0]?.product?.name,
    itemCount: o.items?.reduce((s, it) => s + it.quantity, 0) || 0
  }));

  if (status) {
    const statusMap = {
      'pending': '待付款',
      'paid': '已支付',
      'shipped': '待收货',
      'received': '待评价',
      'refund': '退换/售后'
    };
    result = result.filter(o => o.status === statusMap[status]);
  }

  res.json(result);
});

// User APIs
app.get('/api/user/info', (req, res) => {
  res.json({ code: 200, data: user });
});

app.post('/api/user/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.json({ code: 400, message: '请上传头像' });
  }
  user.avatar = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ code: 200, data: { avatar: user.avatar }, message: '头像修改成功' });
});

app.put('/api/user/username', (req, res) => {
  const { username } = req.body;
  if (!username || username.trim().length === 0) {
    return res.json({ code: 400, message: '用户名不能为空' });
  }
  if (username.trim().length > 20) {
    return res.json({ code: 400, message: '用户名不能超过20个字符' });
  }
  user.username = username.trim();
  res.json({ code: 200, data: { username: user.username }, message: '用户名修改成功' });
});

// Message APIs
app.get('/api/messages', (req, res) => {
  const { type } = req.query;
  let result = [...messages];
  if (type) {
    result = result.filter(m => m.type === type);
  }
  res.json({ code: 200, data: result });
});

app.put('/api/messages/:id/read', (req, res) => {
  const message = messages.find(m => m.id === req.params.id);
  if (message) {
    message.isRead = true;
    res.json({ code: 200, message: '标记成功' });
  } else {
    res.json({ code: 404, message: '消息不存在' });
  }
});

app.delete('/api/messages', (req, res) => {
  const { ids } = req.body;
  if (ids && ids.length > 0) {
    messages = messages.filter(m => !ids.includes(m.id) || !m.isRead);
  } else {
    messages = messages.filter(m => !m.isRead);
  }
  res.json({ code: 200, message: '删除成功' });
});

// Address APIs
app.get('/api/addresses', (req, res) => {
  res.json({ code: 200, data: addresses.sort((a, b) => Number(b.isDefault) - Number(a.isDefault)) });
});

app.post('/api/addresses', (req, res) => {
  const newAddr = { id: 'addr' + Date.now(), ...req.body, isDefault: false };
  addresses.push(newAddr);
  res.json({ code: 200, data: newAddr, message: '添加成功' });
});

app.put('/api/addresses/:id', (req, res) => {
  const index = addresses.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    addresses[index] = { ...addresses[index], ...req.body };
    res.json({ code: 200, message: '修改成功' });
  } else {
    res.json({ code: 404, message: '地址不存在' });
  }
});

app.delete('/api/addresses/:id', (req, res) => {
  const index = addresses.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    addresses.splice(index, 1);
    res.json({ code: 200, message: '删除成功' });
  } else {
    res.json({ code: 404, message: '地址不存在' });
  }
});

app.put('/api/addresses/:id/default', (req, res) => {
  addresses.forEach(a => a.isDefault = (a.id === req.params.id));
  res.json({ code: 200, message: '设置成功' });
});

// Favorites APIs
app.get('/api/favorites', (req, res) => {
  const favoritesWithProducts = favorites.map(f => ({
    ...f,
    product: products.find(p => p.id === f.productId)
  })).filter(f => f.product);
  res.json({ code: 200, data: favoritesWithProducts });
});

app.delete('/api/favorites/:productId', (req, res) => {
  const index = favorites.findIndex(f => f.productId === req.params.productId);
  if (index !== -1) {
    favorites.splice(index, 1);
    res.json({ code: 200, message: '取消收藏成功' });
  } else {
    res.json({ code: 404, message: '收藏不存在' });
  }
});

app.post('/api/favorites', (req, res) => {
  const { productId } = req.body;
  const exists = favorites.find(f => f.productId === productId);
  if (!exists) {
    favorites.push({ productId, createdAt: Date.now() });
    res.json({ code: 200, message: '收藏成功' });
  } else {
    res.json({ code: 400, message: '已收藏' });
  }
});

// Customer Service APIs
app.get('/api/customer-service/faq', (req, res) => {
  res.json({ code: 200, data: faq });
});

app.post('/api/customer-service/chat', (req, res) => {
  const { message } = req.body;
  const userMsg = { id: Date.now(), role: 'user', content: message, time: Date.now() };
  chatHistory.push(userMsg);

  // 模拟客服回复
  setTimeout(() => {
    const replies = ['感谢您的咨询，我们会尽快处理。', '请问还有其他问题吗？', '好的，已为您记录。'];
    const botMsg = {
      id: Date.now() + 1,
      role: 'bot',
      content: replies[Math.floor(Math.random() * replies.length)],
      time: Date.now()
    };
    chatHistory.push(botMsg);
  }, 1000);

  res.json({ code: 200, message: '发送成功' });
});

app.get('/api/customer-service/chat', (req, res) => {
  res.json({ code: 200, data: chatHistory });
});

// Coupon APIs
app.get('/api/coupons', (req, res) => {
  const { status, userId } = req.query;
  let result = [...coupons];

  // 如果提供了 userId，合并春节活动领取的优惠券
  if (userId && global.userCouponRecords) {
    console.log(`[getCoupons] 查询用户优惠券, userId: ${userId}`);
    console.log(`[getCoupons] userCouponRecords:`, JSON.stringify(global.userCouponRecords, null, 2));
    
    const cnyCoupons = [];

    // 检查 50元券
    const cny50Key = `user_${userId}_coupon_50`;
    const cny50Record = global.userCouponRecords[cny50Key];
    console.log(`[getCoupons] cny50Key: ${cny50Key}, cny50Record:`, cny50Record);
    if (cny50Record) {
      cnyCoupons.push({
        id: 'cny50',
        title: '春节满减券',
        amount: 50,
        minAmount: 299,
        category: '全场通用',
        status: cny50Record.used ? 'used' : 'available',
        used: cny50Record.used,
        validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
        description: '春节活动专享，满299减50',
        usedAt: cny50Record.usedAt
      });
    }

    // 检查 20元券
    const cny20Key = `user_${userId}_coupon_20`;
    const cny20Record = global.userCouponRecords[cny20Key];
    console.log(`[getCoupons] cny20Key: ${cny20Key}, cny20Record:`, cny20Record);
    if (cny20Record) {
      cnyCoupons.push({
        id: 'cny20',
        title: '春节折扣券',
        amount: 20,
        minAmount: 129,
        category: '全场通用',
        status: cny20Record.used ? 'used' : 'available',
        used: cny20Record.used,
        validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
        description: '春节活动专享，满129减20',
        usedAt: cny20Record.usedAt
      });
    }
    
    console.log(`[getCoupons] cnyCoupons:`, JSON.stringify(cnyCoupons, null, 2));

    result = [...result, ...cnyCoupons];
  }

  // 检查优惠券是否过期
  const now = Date.now();
  result = result.map(coupon => {
    if (coupon.status !== 'used' && coupon.validUntil < now) {
      return { ...coupon, status: 'expired' };
    }
    return coupon;
  });

  if (status) {
    result = result.filter(c => c.status === status);
  }

  res.json(result);
});

// 春节活动相关接口

// 活动商品列表接口
app.get('/api/goods/list', (req, res) => {
  const { activityId } = req.query;
  
  if (activityId === 'CNY2026') {
    // 春节活动专属商品
    const activityProducts = [
      {
        id: 'p100',
        name: '智利进口车厘子礼盒',
        price: 188.0,
        image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&q=80',
        tag: '年货价',
        stock: 50,
        categoryId: 'fruit',
        desc: '智利空运，果大核小，鲜甜多汁',
        tags: ['进口', '礼盒装']
      },
      {
        id: 'p101',
        name: '深海大黄鱼 700g/条',
        price: 68.0,
        image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&q=80',
        tag: '年货价',
        stock: 30,
        categoryId: 'seafood',
        desc: '深海捕捞，新鲜直达',
        tags: ['野生', '生鲜']
      },
      {
        id: 'p102',
        name: '澳洲牛排套餐 1kg',
        price: 299.0,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
        tag: '年货价',
        stock: 40,
        categoryId: 'meat',
        desc: '澳洲谷饲，鲜嫩多汁',
        tags: ['进口', '高蛋白']
      },
      {
        id: 'p103',
        name: '精品坚果礼盒 1.5kg',
        price: 128.0,
        image: 'https://images.unsplash.com/photo-1608032077098-1b223690d6ea?w=400&q=80',
        tag: '年货价',
        stock: 60,
        categoryId: 'snack',
        desc: '多种坚果混合，营养美味',
        tags: ['健康', '无添加']
      },
      {
        id: 'p104',
        name: '鲜活大闸蟹 8只装',
        price: 398.0,
        image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80',
        tag: '年货价',
        stock: 25,
        categoryId: 'seafood',
        desc: '精选优质大闸蟹，个大肥美',
        tags: ['鲜活', '当季']
      },
      {
        id: 'p105',
        name: '有机蔬菜礼盒 3kg',
        price: 89.0,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
        tag: '年货价',
        stock: 45,
        categoryId: 'vegetable',
        desc: '有机种植，绿色健康',
        tags: ['有机', '新鲜']
      }
    ];
    res.json({ code: 0, msg: 'success', data: activityProducts });
  } else {
    res.json({ code: 0, msg: 'success', data: [] });
  }
});

// 领券接口
app.post('/api/coupon/receive', (req, res) => {
  const { couponType, userId } = req.body;
  
  // 模拟用户领券记录
  const userCouponKey = `user_${userId}_coupon_${couponType}`;
  
  // 检查是否已领取
  if (global.userCouponRecords && global.userCouponRecords[userCouponKey]) {
    return res.json({ code: 1001, msg: '您已领取过该优惠券' });
  }
  
  // 初始化领券记录
  if (!global.userCouponRecords) {
    global.userCouponRecords = {};
  }
  
  // 标记为已领取
  global.userCouponRecords[userCouponKey] = {
    couponType,
    userId,
    receivedAt: Date.now()
  };
  
  res.json({ code: 0, msg: 'success', data: { received: true } });
});

// 优惠券状态查询接口
app.get('/api/coupon/status', (req, res) => {
  const { userId } = req.query;
  
  // 模拟查询用户领券状态
  const userCouponKey50 = `user_${userId}_coupon_50`;
  const userCouponKey20 = `user_${userId}_coupon_20`;
  
  res.json({
    code: 0,
    msg: 'success',
    data: {
      coupon50Received: !!(global.userCouponRecords && global.userCouponRecords[userCouponKey50]),
      coupon20Received: !!(global.userCouponRecords && global.userCouponRecords[userCouponKey20])
    }
  });
});

// Static files for uploaded images
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});
