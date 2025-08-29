// 网络配置管理工具

export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: 1,
    chainName: 'Ethereum 主网',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ethereum.publicnode.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    color: 'blue',
    icon: '⟠'
  },
  sepolia: {
    chainId: 11155111,
    chainName: 'Sepolia 测试网',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    color: 'orange',
    icon: '⟠'
  },
  polygon: {
    chainId: 137,
    chainName: 'Polygon 主网',
    nativeCurrency: {
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon.llamarpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    color: 'purple',
    icon: '◆'
  },
  mumbai: {
    chainId: 80001,
    chainName: 'Mumbai 测试网',
    nativeCurrency: {
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    color: 'cyan',
    icon: '◆'
  },
  bsc: {
    chainId: 56,
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    color: 'gold',
    icon: '◈'
  },
  bscTestnet: {
    chainId: 97,
    chainName: 'BNB Smart Chain 测试网',
    nativeCurrency: {
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    color: 'gold',
    icon: '◈'
  },
  arbitrum: {
    chainId: 42161,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    color: 'blue',
    icon: '◯'
  },
  optimism: {
    chainId: 10,
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    color: 'red',
    icon: '●'
  }
}

// 获取网络配置
export const getNetworkConfig = (chainId) => {
  const networkKey = Object.keys(SUPPORTED_NETWORKS).find(
    key => SUPPORTED_NETWORKS[key].chainId === Number(chainId)
  )
  return networkKey ? SUPPORTED_NETWORKS[networkKey] : null
}

// 获取网络显示名称
export const getNetworkName = (chainId) => {
  const config = getNetworkConfig(chainId)
  return config ? config.chainName : `未知网络 (${chainId})`
}

// 获取网络颜色
export const getNetworkColor = (chainId) => {
  const config = getNetworkConfig(chainId)
  return config ? config.color : 'default'
}

// 获取网络图标
export const getNetworkIcon = (chainId) => {
  const config = getNetworkConfig(chainId)
  return config ? config.icon : '?'
}

// 检查是否为测试网络
export const isTestNetwork = (chainId) => {
  const testNetworkIds = [11155111, 80001, 97] // Sepolia, Mumbai, BSC Testnet
  return testNetworkIds.includes(Number(chainId))
}

// 获取网络类型标签
export const getNetworkTypeTag = (chainId) => {
  return isTestNetwork(chainId) ? '测试网' : '主网'
}

// 获取所有网络的选项列表（用于下拉菜单）
export const getNetworkOptions = () => {
  return Object.entries(SUPPORTED_NETWORKS).map(([key, config]) => ({
    key,
    value: config.chainId,
    label: config.chainName,
    icon: config.icon,
    color: config.color,
    isTestnet: isTestNetwork(config.chainId)
  }))
}

// 获取主网网络选项
export const getMainnetOptions = () => {
  return getNetworkOptions().filter(option => !option.isTestnet)
}

// 获取测试网网络选项
export const getTestnetOptions = () => {
  return getNetworkOptions().filter(option => option.isTestnet)
}

// 格式化网络配置为 MetaMask 要求的格式
export const formatNetworkForMetaMask = (networkKey) => {
  const config = SUPPORTED_NETWORKS[networkKey]
  if (!config) return null

  return {
    chainId: `0x${config.chainId.toString(16)}`,
    chainName: config.chainName,
    nativeCurrency: config.nativeCurrency,
    rpcUrls: config.rpcUrls,
    blockExplorerUrls: config.blockExplorerUrls
  }
}