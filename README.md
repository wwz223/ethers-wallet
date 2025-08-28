# Web3数据上链项目需求实现文档

## 项目概述
开发一个基于React的Web3应用，实现数据上链的两种核心方式：直接转账上链和使用第三方服务读取链上数据。

## 技术栈

- **前端框架**: React 18+
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **Web3库**: Ethers.js v6
- **区块链网络**: Ethereum (测试网: Sepolia)
- **第三方服务**: Infura、Alchemy
- **钱包连接**: MetaMask

## 功能需求

### 1. 基础功能模块

#### 1.1 钱包连接模块
- [ ] MetaMask钱包检测与连接
- [ ] 账户地址显示
- [ ] 网络状态检测（确保连接到正确的测试网）
- [ ] 连接状态管理

#### 1.2 界面布局
- [ ] 响应式设计（支持桌面端和移动端）
- [ ] 现代化UI组件
- [ ] 加载状态指示器
- [ ] 错误提示组件

### 2. 核心功能实现

#### 2.1 方式一：直接转账上链
**功能描述**: 用户可以发送ETH转账，将交易数据记录在区块链上

**具体实现**:

- **转账表单组件**
  - 接收地址输入框（带地址格式验证）
  - 转账金额输入框（ETH单位，支持小数）
  - 备注信息输入框（可选，作为交易数据）

- **交易确认界面**
  - 显示Gas费用预估
  - 交易详情预览
  - 确认/取消按钮

- **交易状态追踪**
  - 交易发送中状态
  - 交易hash显示
  - 区块确认状态
  - 交易成功/失败提示

**技术要求**:
```javascript
// 使用ethers.js实现转账
const transaction = await signer.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther(amount),
  data: ethers.toUtf8Bytes(memo) // 备注作为数据上链
});
```

#### 2.2 方式二：使用第三方服务读取链上数据
**功能描述**: 集成Infura和Alchemy服务，读取和显示链上数据

##### 2.2.1 Infura集成
- API密钥配置界面
- 支持的数据查询：
  - 账户余额查询
  - 交易历史查询
  - 区块信息查询
  - 合约事件日志查询

##### 2.2.2 Alchemy集成
- API密钥配置界面
- 支持的数据查询：
  - NFT数据查询
  - Token余额查询
  - 增强版交易历史
  - 合约交互分析

**技术要求**:
```javascript
// Infura配置示例
const infuraProvider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
);

// Alchemy配置示例
const alchemyProvider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
);
```

### 3. 页面结构设计

#### 3.1 主页 (/)
- 项目介绍
- 功能导航卡片
- 快速开始指南

#### 3.2 直接转账页面 (/transfer)
- 钱包连接状态显示
- 转账表单
- 交易历史列表
- 实时余额显示

#### 3.3 数据查询页面 (/query)
- 服务选择标签页（Infura/Alchemy）
- API配置区域
- 查询类型选择
- 结果展示区域

#### 3.4 设置页面 (/settings)
- 网络配置
- API密钥管理
- 主题切换

## 技术实现细节

### 4.1 项目结构
```
src/
├── components/           # 可复用组件
│   ├── WalletConnect.jsx
│   ├── TransferForm.jsx
│   ├── QueryInterface.jsx
│   └── ui/              # UI基础组件
├── hooks/               # 自定义Hook
│   ├── useWallet.js
│   ├── useTransaction.js
│   └── useQuery.js
├── services/            # 服务层
│   ├── ethereum.js
│   ├── infura.js
│   └── alchemy.js
├── utils/               # 工具函数
│   ├── validators.js
│   └── formatters.js
├── pages/               # 页面组件
└── App.jsx
```

### 4.2 状态管理
使用React Context + useReducer实现全局状态管理：
- 钱包连接状态
- 交易状态
- 查询结果缓存
- 错误处理

### 4.3 错误处理
- 网络错误处理
- 交易失败处理
- API调用失败处理
- 用户拒绝交易处理

### 4.4 安全考虑
- API密钥客户端存储（使用localStorage，仅用于测试）
- 交易金额验证
- 地址格式验证
- XSS防护

## 开发阶段规划

### Phase 1: 基础设施搭建 (1-2天)
- [x] 项目初始化（Vite + React + Tailwind）
- [ ] 基础组件开发
- [ ] 路由配置
- [ ] 钱包连接功能

### Phase 2: 直接转账功能 (2-3天)
- [ ] 转账表单开发
- [ ] 交易发送逻辑
- [ ] 交易状态追踪
- [ ] 用户界面优化

### Phase 3: 第三方服务集成 (2-3天)
- [ ] Infura API集成
- [ ] Alchemy API集成
- [ ] 数据查询界面
- [ ] 结果展示优化

### Phase 4: 测试与优化 (1-2天)
- [ ] 功能测试
- [ ] 响应式适配
- [ ] 性能优化
- [ ] 错误处理完善

## 环境配置

### 5.1 开发环境要求
- Node.js 16+
- npm/yarn/pnpm
- MetaMask浏览器插件
- 测试用ETH（从水龙头获取）

### 5.2 API密钥获取

**Infura**:
1. 注册账号: https://www.infura.io/zh
2. 创建新项目
3. 获取项目ID

**Alchemy**:
1. 注册账号: https://www.alchemy.com
2. 创建应用
3. 获取API Key

### 5.3 环境变量配置
```env
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_NETWORK_NAME=sepolia
```

## 验收标准

### 6.1 功能验收
- [ ] 成功连接MetaMask钱包
- [ ] 完成一笔测试网ETH转账
- [ ] 使用Infura查询账户余额
- [ ] 使用Alchemy查询交易历史
- [ ] 所有错误情况得到正确处理

### 6.2 代码质量
- [ ] 代码结构清晰，组件可复用
- [ ] 适当的注释和文档
- [ ] 错误处理完善
- [ ] 响应式设计实现

### 6.3 用户体验
- [ ] 界面美观，操作流畅
- [ ] 加载状态明确
- [ ] 错误提示友好
- [ ] 移动端适配良好

## 扩展功能建议
- 智能合约交互: 部署简单合约，实现数据存储上链
- 批量交易: 支持批量转账功能
- 交易记录导出: 支持CSV格式导出
- 多链支持: 支持Polygon、BSC等其他链
- DeFi数据查询: 集成Uniswap等DeFi协议数据

## 学习资源
- [Ethers.js文档](https://docs.ethers.org/)
- [Infura文档](https://docs.infura.io/)
- [Alchemy文档](https://docs.alchemy.com/)
- [Web3开发最佳实践](https://ethereum.org/en/developers/)

---

**注意**: 本项目仅用于学习目的，请在测试网络上进行开发和测试，不要在主网上使用未经充分测试的代码。