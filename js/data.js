// ==================== 菜单数据配置 ====================
// 请在这里填写你的菜单信息

const menuData = {
    // 早餐选项
    breakfast: [
        { name: '豆浆油条', price: 5, calories: 350, type: ['主食', '传统'] },
        { name: '小笼包', price: 8, calories: 280, type: ['主食', '传统'] },
        { name: '煎饼果子', price: 7, calories: 400, type: ['主食', '传统'] },
        { name: '全麦三明治', price: 12, calories: 320, type: ['主食', '健康'] },
        { name: '燕麦粥+鸡蛋', price: 10, calories: 250, type: ['主食', '健康'] },
        { name: '肠粉', price: 8, calories: 300, type: ['主食', '粤式'] },
        // 在此添加更多早餐选项...
    ],
    
    // 午餐选项
    lunch: [
        { name: '番茄炒蛋盖饭', price: 12, calories: 550, type: ['主食', '家常'] },
        { name: '宫保鸡丁套餐', price: 15, calories: 650, type: ['主食', '川菜'] },
        { name: '红烧肉盖饭', price: 18, calories: 750, type: ['主食', '家常'] },
        { name: '蔬菜沙拉+鸡胸肉', price: 20, calories: 450, type: ['主食', '健康'] },
        { name: '麻辣烫', price: 15, calories: 500, type: ['主食', '川菜'] },
        { name: '黄焖鸡米饭', price: 16, calories: 680, type: ['主食', '家常'] },
        { name: '酸菜鱼套餐', price: 22, calories: 600, type: ['主食', '川菜'] },
        { name: '烤肉拌饭', price: 18, calories: 700, type: ['主食', '韩式'] },
        // 在此添加更多午餐选项...
    ],
    
    // 晚餐选项
    dinner: [
        { name: '清炒时蔬+米饭', price: 10, calories: 400, type: ['主食', '健康'] },
        { name: '水煮鱼片', price: 25, calories: 550, type: ['主食', '川菜'] },
        { name: '炒面', price: 12, calories: 500, type: ['主食', '快餐'] },
        { name: '煲仔饭', price: 15, calories: 600, type: ['主食', '粤式'] },
        { name: '麻辣香锅', price: 20, calories: 650, type: ['主食', '川菜'] },
        { name: '寿司套餐', price: 28, calories: 480, type: ['主食', '日式'] },
        { name: '牛肉面', price: 18, calories: 580, type: ['主食', '西北'] },
        { name: '炒河粉', price: 14, calories: 520, type: ['主食', '粤式'] },
        // 在此添加更多晚餐选项...
    ]
};

// ==================== 餐厅数据配置 ====================
const restaurantData = [
    {
        name: '川香阁',
        cuisine: ['川菜'],
        priceRange: 'medium',
        avgPrice: 65,
        rating: 4.5,
        previousVisits: 3,
        lastVisit: '2024-01-15',
        comments: '麻辣鲜香，菜品丰富',
        location: '学校西门',
        specialty: '水煮鱼、毛血旺'
    },
    {
        name: '粤味轩',
        cuisine: ['粤菜'],
        priceRange: 'high',
        avgPrice: 95,
        rating: 4.8,
        previousVisits: 2,
        lastVisit: '2024-01-20',
        comments: '环境优雅，味道正宗',
        location: '市中心',
        specialty: '白切鸡、煲仔饭'
    },
    {
        name: '海底捞火锅',
        cuisine: ['火锅'],
        priceRange: 'high',
        avgPrice: 110,
        rating: 4.7,
        previousVisits: 5,
        lastVisit: '2024-02-01',
        comments: '服务一流，食材新鲜',
        location: '商业街',
        specialty: '毛肚、虾滑'
    },
    {
        name: '烧烤一条街',
        cuisine: ['烧烤'],
        priceRange: 'low',
        avgPrice: 45,
        rating: 4.2,
        previousVisits: 8,
        lastVisit: '2024-02-10',
        comments: '性价比高，氛围热闹',
        location: '学校北门',
        specialty: '羊肉串、烤茄子'
    },
    {
        name: '禾绿回转寿司',
        cuisine: ['日料'],
        priceRange: 'medium',
        avgPrice: 78,
        rating: 4.4,
        previousVisits: 4,
        lastVisit: '2024-01-28',
        comments: '寿司新鲜，品种多样',
        location: '购物中心',
        specialty: '三文鱼、天妇罗'
    },
    {
        name: '必胜客',
        cuisine: ['西餐'],
        priceRange: 'medium',
        avgPrice: 88,
        rating: 4.3,
        previousVisits: 6,
        lastVisit: '2024-02-05',
        comments: '披萨好吃，环境舒适',
        location: '万达广场',
        specialty: '至尊披萨、意面'
    },
    {
        name: '素食缘',
        cuisine: ['素食'],
        priceRange: 'low',
        avgPrice: 42,
        rating: 4.6,
        previousVisits: 2,
        lastVisit: '2024-01-18',
        comments: '健康养生，创意菜品',
        location: '文化路',
        specialty: '素食火锅、养生汤'
    },
    // 在此添加更多餐厅...
];

// ==================== 预算配置 ====================
const budgetConfig = {
    low: { max: 30, label: '节约型' },
    medium: { min: 30, max: 50, label: '标准型' },
    high: { min: 50, label: '舒适型' }
};

const gatheringBudgetConfig = {
    low: { max: 50, label: '经济实惠' },
    medium: { min: 50, max: 100, label: '中档消费' },
    high: { min: 100, label: '品质优选' }
};
