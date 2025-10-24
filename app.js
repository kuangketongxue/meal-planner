// 初始化菜单数据
const defaultMenus = {
    breakfast: [
        { name: "馄饨汤+咸菜", price: 5, nutrition: "碳:20g 蛋:6g 脂:2g", type: "汤类", contains: ["猪肉"] },
        { name: "豆浆油条", price: 4, nutrition: "碳:25g 蛋:8g 脂:5g", type: "传统", contains: [] },
        { name: "鸡蛋羹", price: 3, nutrition: "碳:8g 蛋:12g 脂:8g", type: "鸡蛋", contains: [] },
        { name: "牛奶面包", price: 6, nutrition: "碳:30g 蛋:10g 脂:6g", type: "面包", contains: [] },
        { name: "粥配榨菜", price: 4, nutrition: "碳:20g 蛋:4g 脂:1g", type: "粥类", contains: [] },
        { name: "煎饺+米粥", price: 5, nutrition: "碳:22g 蛋:8g 脂:4g", type: "饺子", contains: ["猪肉"] }
    ],
    lunch: [
        { name: "红烧肉+青菜", price: 12, nutrition: "碳:25g 蛋:20g 脂:15g", type: "荤菜", contains: ["猪肉"] },
        { name: "清蒸鱼+米饭", price: 11, nutrition: "碳:30g 蛋:18g 脂:6g", type: "鱼类", contains: ["鱼"] },
        { name: "番茄鸡蛋+青菜", price: 8, nutrition: "碳:28g 蛋:14g 脂:7g", type: "素菜", contains: [] },
        { name: "麻婆豆腐", price: 9, nutrition: "碳:20g 蛋:15g 脂:8g", type: "豆制品", contains: ["辣"] },
        { name: "铁板牛河", price: 10, nutrition: "碳:35g 蛋:12g 脂:10g", type: "粉面", contains: [] },
        { name: "糖醋里脊", price: 13, nutrition: "碳:28g 蛋:22g 脂:12g", type: "荤菜", contains: ["猪肉"] },
        { name: "黄瓜炒蛋+米饭", price: 7, nutrition: "碳:26g 蛋:10g 脂:6g", type: "素菜", contains: [] }
    ],
    dinner: [
        { name: "面条+青菜", price: 6, nutrition: "碳:32g 蛋:8g 脂:3g", type: "粉面", contains: [] },
        { name: "馄饨面", price: 7, nutrition: "碳:32g 蛋:10g 脂:4g", type: "粉面", contains: ["猪肉"] },
        { name: "蛋炒饭", price: 6, nutrition: "碳:32g 蛋:10g 脂:7g", type: "米饭", contains: [] },
        { name: "番茄面条", price: 6, nutrition: "碳:32g 蛋:6g 脂:3g", type: "粉面", contains: [] },
        { name: "清汤丸子面", price: 7, nutrition: "碳:30g 蛋:12g 脂:5g", type: "汤面", contains: ["猪肉"] },
        { name: "炸酱面", price: 7, nutrition: "碳:35g 蛋:10g 脂:6g", type: "粉面", contains: ["猪肉"] }
    ]
};

// 全局数据存储
let menus = JSON.parse(localStorage.getItem('menus')) || defaultMenus;
let friends = JSON.parse(localStorage.getItem('friends')) || [];
let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];

// DOM 获取函数
const el = (id) => document.getElementById(id);

// ==================== 标签页管理 ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        btn.classList.add('active');
        el(tabName).classList.add('active');
        
        if (tabName === 'setting') loadMenuEditor();
        if (tabName === 'friend') {
            renderFriendsList();
            renderRestaurantList();
        }
    });
});

// ==================== 第一部分：每日菜单 ====================
el('generateDaily').addEventListener('click', generateDailyMenu);
el('resetDaily').addEventListener('click', generateDailyMenu);

function generateDailyMenu() {
    const preferences = {
        budgetMode: el('budgetMode').checked,
        healthMode: el('healthMode').checked,
        noPork: el('noPork').checked,
        noSpicy: el('noSpicy').checked,
        vegetarian: el('vegetarian').checked
    };

    const breakfast = selectMeal('breakfast', preferences);
    const lunch = selectMeal('lunch', preferences);
    const dinner = selectMeal('dinner', preferences);

    el('breakfast').innerHTML = formatMeal(breakfast);
    el('lunch').innerHTML = formatMeal(lunch);
    el('dinner').innerHTML = formatMeal(dinner);

    // 计算营养和价格
    const meals = [breakfast, lunch, dinner];
    const totalPrice = meals.reduce((sum, m) => sum + m.price, 0);
    const totalNutrition = calculateNutrition(meals);

    el('priceInfo').innerHTML = `
        <strong>💰 今日花费:</strong> ¥${totalPrice.toFixed(2)} 
        <span class="price-rating">${totalPrice <= 20 ? '👍 很经济！' : totalPrice <= 30 ? '✅ 适中' : '⚠️ 较贵'}</span>
    `;

    el('nutritionInfo').innerHTML = `
        <strong>🥗 营养摄入估计:</strong><br>
        碳水: ${totalNutrition.carbs}g | 蛋白: ${totalNutrition.protein}g | 脂肪: ${totalNutrition.fat}g
    `;
}

function selectMeal(mealType, preferences) {
    let available = menus[mealType] || [];

    // 根据偏好过滤
    available = available.filter(meal => {
        if (preferences.noPork && meal.contains.includes('猪肉')) return false;
        if (preferences.noSpicy && meal.contains.includes('辣')) return false;
        if (preferences.vegetarian && meal.contains.some(c => ['猪肉', '鸡', '鱼', '牛肉'].includes(c))) return false;
        return true;
    });

    if (available.length === 0) available = menus[mealType];

    // 排序策略
    if (preferences.budgetMode) {
        available.sort((a, b) => a.price - b.price);
    }

    // 随机选择（倾向于前面的）
    const index = Math.floor(Math.random() * Math.min(3, available.length));
    return available[index];
}

function formatMeal(meal) {
    return `
        <strong>${meal.name}</strong><br>
        💰 ¥${meal.price} | 🥗 ${meal.nutrition}
    `;
}

function calculateNutrition(meals) {
    let carbs = 0, protein = 0, fat = 0;
    
    meals.forEach(meal => {
        const match = meal.nutrition.match(/碳:(\d+).*蛋:(\d+).*脂:(\d+)/);
        if (match) {
            carbs += parseInt(match[1]);
            protein += parseInt(match[2]);
            fat += parseInt(match[3]);
        }
    });

    return { carbs, protein, fat };
}

// ==================== 第二部分：朋友聚餐 ====================
el('addFriend').addEventListener('click', addFriend);
el('addRestaurant').addEventListener('click', addRestaurant);
el('recommendRestaurant').addEventListener('click', recommendRestaurant);

function addFriend() {
    const name = el('friendName').value.trim();
    if (!name) {
        alert('请输入朋友名字');
        return;
    }

    const tags = Array.from(document.querySelectorAll('.friendTag:checked')).map(c => c.value);

    const friend = { id: Date.now(), name, tags };
    friends.push(friend);
    localStorage.setItem('friends', JSON.stringify(friends));

    el('friendName').value = '';
    document.querySelectorAll('.friendTag').forEach(c => c.checked = false);
    renderFriendsList();
}

function renderFriendsList() {
    const html = friends.map(friend => `
        <div class="list-item">
            <div class="list-item-content">
                <div class="list-item-name">👤 ${friend.name}</div>
                <div class="list-item-tags">
                    ${friend.tags.length > 0 ? friend.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '<span class="tag">无特殊要求</span>'}
                </div>
            </div>
            <button class="btn-danger" onclick="deleteFriend(${friend.id})">删除</button>
        </div>
    `).join('');

    el('friendsList').innerHTML = html || '<p style="color:#999;">还没添加朋友，先加一个吧</p>';
}

function deleteFriend(id) {
    friends = friends.filter(f => f.id !== id);
    localStorage.setItem('friends', JSON.stringify(friends));
    renderFriendsList();
}

function addRestaurant() {
    const name = el('restaurantName').value.trim();
    const type = el('restaurantType').value;
    const score = parseFloat(el('restaurantScore').value);
    const price = parseInt(el('restaurantPrice').value);

    if (!name || !score || !price) {
        alert('请填写完整信息');
        return;
    }

    const restaurant = { id: Date.now(), name, type, score, price };
    restaurants.push(restaurant);
    localStorage.setItem('restaurants', JSON.stringify(restaurants));

    el('restaurantName').value = '';
    el('restaurantScore').value = '';
    el('restaurantPrice').value = '';
    renderRestaurantList();
}

function renderRestaurantList() {
    const html = restaurants.map(rest => `
        <div class="list-item">
            <div class="list-item-content">
                <div class="list-item-name">${rest.name}</div>
                <div class="list-item-tags">
                    <span class="tag">${rest.type}</span>
                    <span class="tag price">人均¥${rest.price}</span>
                </div>
            </div>
            <div class="restaurant-item-score">${rest.score}⭐</div>
            <button class="btn-danger" onclick="deleteRestaurant(${rest.id})">删除</button>
        </div>
    `).join('');

    el('restaurantsList').innerHTML = html || '<p style="color:#999;">还没添加餐馆</p>';
}

function deleteRestaurant(id) {
    restaurants = restaurants.filter(r => r.id !== id);
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    renderRestaurantList();
}

function recommendRestaurant() {
    if (friends.length === 0) {
        alert('请先添加朋友');
        return;
    }

    if (restaurants.length === 0) {
        alert('请先添加餐馆');
        return;
    }

    // 为每个餐馆计算匹配度
    const scored = restaurants.map(restaurant => {
        let compatibleCount = 0;
        let score = restaurant.score * 20; // 基础分：评分权重

        friends.forEach(friend => {
            let compatible = true;
            
            // 检查饮食限制
            if (friend.tags.includes('noPork') && restaurant.type === '烤肉') compatible = false;
            if (friend.tags.includes('noBeef') && restaurant.type === '烤肉') compatible = false;
            if (friend.tags.includes('noSpicy') && restaurant.type === '川菜') compatible = false;
            if (friend.tags.includes('vegetarian') && ['烤肉', '川菜'].includes(restaurant.type)) compatible = false;

            if (compatible) compatibleCount++;
            
            // 预算考虑
            if (friend.tags.includes('budget') && restaurant.price <= 50) {
                score += 10;
            }
        });

        // 朋友兼容度
        score += (compatibleCount / friends.length) * 30;
        
        return { ...restaurant, totalScore: score, compatible: compatibleCount };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);
    const recommendation = scored[0];

    el('recommendResult').style.display = 'block';
    el('recommendDetails').innerHTML = `
        <div style="background:white;padding:20px;border-radius:8px;border-left:4px solid #28a745;">
            <h3 style="color:#28a745;margin-bottom:10px;">🎯 推荐餐馆: ${recommendation.name}</h3>
            <p><strong>菜系:</strong> ${recommendation.type}</p>
            <p><strong>评分:</strong> ${recommendation.score}⭐</p>
            <p><strong>人均:</strong> ¥${recommendation.price}</p>
            <p><strong>朋友兼容度:</strong> ${recommendation.compatible}/${friends.length} 位朋友满意 ✅</p>
            <p style="color:#666;margin-top:15px;">匹配度得分: <strong style="color:#28a745;">${recommendation.totalScore.toFixed(1)}/100</strong></p>
        </div>
    `;
}

// ==================== 第三部分：菜单编辑 ====================
function loadMenuEditor() {
    el('menuJson').value = JSON.stringify(menus, null, 2);
}

el('saveMenu').addEventListener('click', () => {
    try {
        const newMenus = JSON.parse(el('menuJson').value);
        menus = newMenus;
        localStorage.setItem('menus', JSON.stringify(menus));
        alert('✅ 菜单保存成功！');
    } catch (e) {
        alert('❌ JSON格式错误: ' + e.message);
    }
});

el('exportMenu').addEventListener('click', () => {
    const dataStr = JSON.stringify(menus, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menus.json';
    a.click();
});

// 初始化
renderFriendsList();
renderRestaurantList();
