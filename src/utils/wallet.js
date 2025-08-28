import { ethers } from 'ethers'

export const checkMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

export const connectWallet = async () => {
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask未安装，请先安装MetaMask钱包')
  }

  try {
    // 请求用户授权
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (accounts.length === 0) {
      throw new Error('没有找到可用的账户')
    }

    // 创建provider和signer
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    
    // 获取网络信息
    const network = await provider.getNetwork()
    
    // 获取余额
    const balance = await provider.getBalance(address)
    const balanceInEth = ethers.formatEther(balance)

    return {
      address,
      balance: balanceInEth,
      network: {
        chainId: network.chainId,
        name: network.name
      },
      provider,
      signer
    }
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('用户拒绝了连接请求')
    }
    throw new Error(`连接失败: ${error.message}`)
  }
}

export const switchNetwork = async (chainId) => {
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask未安装')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    })
  } catch (error) {
    if (error.code === 4902) {
      throw new Error('该网络未添加到MetaMask中')
    }
    throw new Error(`切换网络失败: ${error.message}`)
  }
}

export const addNetwork = async (networkConfig) => {
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask未安装')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig]
    })
  } catch (error) {
    throw new Error(`添加网络失败: ${error.message}`)
  }
}

export const getWalletInfo = async () => {
  if (!checkMetaMaskInstalled()) {
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })

    if (accounts.length === 0) {
      return null
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const address = accounts[0]
    const balance = await provider.getBalance(address)
    const network = await provider.getNetwork()

    return {
      address,
      balance: ethers.formatEther(balance),
      network: {
        chainId: network.chainId,
        name: network.name
      },
      isConnected: true
    }
  } catch (error) {
    console.error('获取钱包信息失败:', error)
    return null
  }
}

// 监听账户变化
export const onAccountsChanged = (callback) => {
  if (checkMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback)
  }
}

// 监听网络变化
export const onChainChanged = (callback) => {
  if (checkMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback)
  }
}

// 移除监听器
export const removeListener = (event, callback) => {
  if (checkMetaMaskInstalled()) {
    window.ethereum.removeListener(event, callback)
  }
}

// 断开连接
export const disconnect = () => {
  // MetaMask没有直接的断开连接方法，但我们可以清除本地状态
  // 用户需要在MetaMask中手动断开连接
  return Promise.resolve()
}