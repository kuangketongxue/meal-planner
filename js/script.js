// ==================== 全局变量 ====================
let selectedPreferences = [];

// ==================== 页面加载完成 ====================
document.addEventListener('DOMContentLoaded', function() {
    initTabSwitching();
    initDailyPlanner();
    initGatheringPlanner();
});

// ==================== 标签页切换 ====================
function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加激活状态
            btn.classList.add('active');
            const tabId = btn.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ==================== 日常餐食规划 ====================
function initDailyPlanner() {
    const generateBtn = document.getElementById('generate-plan');
    generateBtn.addEventListener('click', generateMealPlan);
}

function generateMealPlan() {
    const budget = document.getElementById('budget-select').value;
    const days = parseInt(document.getElementById('days-select').value);
    const nutritionBalance = document.getElementById('nutrition-balance').checked;
    
    const resultDiv = document.getElementById('meal-result');
    resultDiv.innerHTML = '<div class="result-grid"></div>';
    const resultGrid = resultDiv.querySelector('.result-grid');
    
    for (let day = 1; day <= days; day++) {
        const dayPlan = generateDayPlan(budget, nutritionBalance, day);
        resultGrid.appendChild(dayPlan);
    }
}

function generateDayPlan(budget, nutritionBalance, dayNumber) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-plan';
    
    const budgetInfo = budgetConfig[budget];
    
    // 生成三餐
    const breakfast = selectMeal(menuData.breakfast, budget, 'breakfast');
    const lunch = selectMeal(menuData.lunch, budget, 'lunch');
    const dinner = selectMeal(menuData.dinner, budget, 'dinner');
    
    const totalPrice = breakfast.price + lunch.price + dinner.price;
    const totalCalories = breakfast.calories + lunch.calories + dinner.calories;
    
    dayDiv.innerHTML = `
        <div class="day-title">
            <span>📅 第 ${dayNumber} 天</span>
            <span style="margin-left: auto; font-size: 1rem; color: var(--text-secondary);">
                总计：¥${totalPrice.toFixed(2)} | ${totalCalories} 千卡
            </span>
        </div>
        <div class="meals-grid">
            ${createMealCard('早餐', breakfast)}
            ${createMealCard('午餐', lunch)}
            ${createMealCard('晚餐', dinner)}
        </div>
    `;
    
    return dayDiv;
}

function selectMeal(mealOptions, budget, mealType) {
    const budgetInfo = budgetConfig[budget];
    let filteredOptions = mealOptions;
    
    // 根据预算筛选
    if (budgetInfo.max) {
        filteredOptions = filteredOptions.filter(item => item.price <= budgetInfo.max);
    }
    if (budgetInfo.min) {
        filteredOptions = filteredOptions.filter(item => item.price >= budgetInfo.min);
    }
    
    // 随机选择
    if (filteredOptions.length === 0) {
        filteredOptions = mealOptions; // 如果没有符合条件的，使用所有选项
    }
    
    const randomIndex = Math.floor(Math.random() * filteredOptions.length);
    return filteredOptions[randomIndex];
}

function createMealCard(mealType, meal) {
    return `
        <div class="meal-card">
            <div class="meal-type">${mealType}</div>
            <ul class="meal-items">
                <li>${meal.name}</li>
            </ul>
            <div class="meal-info">
                <span class="meal-price">¥${meal.price.toFixed(2)}</span>
                <span class="meal-calories">${meal.calories} 千卡</span>
            </div>
        </div>
    `;
}

// ==================== 聚餐推荐系统 ====================
function initGatheringPlanner() {
    // 偏好选择
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            const preference = chip.dataset.preference;
            
            if (chip.classList.contains('active')) {
                selectedPreferences.push(preference);
            } else {
                selectedPreferences = selectedPreferences.filter(p => p !== preference);
            }
        });
    });
    
    // 推荐按钮
    const recommendBtn = document.getElementById('recommend-restaurant');
    recommendBtn.addEventListener('click', recommendRestaurant);
}

function recommendRestaurant() {
    const peopleCount = parseInt(document.getElementById('people-count').value);
    const budget = document.getElementById('gathering-budget').value;
    
    const resultDiv = document.getElementById('restaurant-result');
    
    // 筛选餐厅
    let filteredRestaurants = restaurantData;
    
    // 根据预算筛选
    const budgetInfo = gatheringBudgetConfig[budget];
    filteredRestaurants = filteredRestaurants.filter(restaurant => {
        if (budgetInfo.max && restaurant.avgPrice > budgetInfo.max) return false;
        if (budgetInfo.min && restaurant.avgPrice < budgetInfo.min) return false;
        return true;
    });
    
    // 根据偏好筛选
    if (selectedPreferences.length > 0) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            return restaurant.cuisine.some(c => selectedPreferences.includes(c));
        });
    }
    
    if (filteredRestaurants.length === 0) {
        resultDiv.innerHTML = `
            <div class="restaurant-card">
                <p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem;">
                    😅 没有找到符合条件的餐厅，请调整筛选条件
                </p>
            </div>
        `;
        return;
    }
    
    // 排序：评分 * 0.6 + (5 - 访问次数/2) * 0.4
    filteredRestaurants.sort((a, b) => {
        const scoreA = a.rating * 0.6 + (5 - Math.min(a.previousVisits / 2, 5)) * 0.4;
        const scoreB = b.rating * 0.6 + (5 - Math.min(b.previousVisits / 2, 5)) * 0.4;
        return scoreB - scoreA;
    });
    
    // 显示前3个推荐
    const topRestaurants = filteredRestaurants.slice(0, 3);
    
    resultDiv.innerHTML = topRestaurants.map((restaurant, index) => 
        createRestaurantCard(restaurant, index + 1, peopleCount)
    ).join('');
}

function createRestaurantCard(restaurant, rank, peopleCount) {
    const totalPrice = restaurant.avgPrice * peopleCount;
    const stars = '⭐'.repeat(Math.floor(restaurant.rating));
    
    return `
        <div class="restaurant-card">
            <div class="restaurant-header">
                <div>
                    <div class="restaurant-name">
                        ${rank === 1 ? '🏆' : rank === 2 ? '🥈' : '🥉'} ${restaurant.name}
                    </div>
                    <div class="restaurant-tags">
                        ${restaurant.cuisine.map(c => `<span class="tag">${c}</span>`).join('')}
                    </div>
                </div>
                <div class="restaurant-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-score">${restaurant.rating}</span>
                </div>
            </div>
            
            <div class="restaurant-details">
                <div class="detail-item">
                    <span class="detail-label">人均消费：</span>
                    <span class="highlight">¥${restaurant.avgPrice}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${peopleCount}人预计：</span>
                    <span class="highlight">¥${totalPrice}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">历史到访：</span>
                    <span>${restaurant.previousVisits} 次</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">最近到访：</span>
                    <span>${restaurant.lastVisit}</span>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label">📍 位置：</span>
                    <span>${restaurant.location}</span>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label">⭐ 招牌菜：</span>
                    <span>${restaurant.specialty}</span>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label">💬 评价：</span>
                    <span>${restaurant.comments}</span>
                </div>
            </div>
        </div>
    `;
}
