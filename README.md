# 🍜 美食规划助手

一个基于 GitHub Pages 的智能餐饮规划系统，帮助大学生科学管理饮食预算，合理安排营养搭配。

## ✨ 功能特性

### 📅 日常餐食规划
- 根据预算自动生成每日三餐计划
- 支持 1/3/7 天的规划周期
- 营养均衡算法（可选）
- 显示每餐热量和价格

### 👥 聚餐推荐系统
- 基于饮食偏好智能推荐餐厅
- 考虑历史评分和访问频率
- 多种菜系选择（川菜、粤菜、火锅等）
- 预算分级推荐

## 🚀 快速开始

### 部署到 GitHub Pages

1. Fork 或下载本仓库
2. 进入仓库设置（Settings）
3. 找到 Pages 选项
4. Source 选择 `main` 分支
5. 点击 Save，等待部署完成

### 自定义数据

所有菜单和餐厅数据都在 `js/data.js` 文件中：

```javascript
// 修改菜单
const menuData = {
    breakfast: [
        { name: '你的早餐', price: 8, calories: 300, type: ['主食'] },
        // 添加更多...
    ],
    // ...
};

// 修改餐厅
const restaurantData = [
    {
        name: '餐厅名称',
        cuisine: ['川菜'],
        avgPrice: 65,
        rating: 4.5,
        // ...
    },
    // 添加更多...
];
