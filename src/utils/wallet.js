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
  console.log('switchNetwork called with chainId:', chainId)
  
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask未安装')
  }

  const hexChainId = `0x${chainId.toString(16)}`
  console.log('切换到网络:', hexChainId)

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }]
    })
    console.log('网络切换成功')
    return true
  } catch (error) {
    console.error('switchNetwork error:', error)
    if (error.code === 4902) {
      // 网络未添加，需要抛出特殊错误供调用方处理
      console.log('网络未添加到MetaMask，错误码4902')
      const err = new Error('该网络未添加到MetaMask中')
      err.code = 4902
      err.chainId = chainId
      throw err
    }
    if (error.code === 4001) {
      console.log('用户拒绝了网络切换请求，错误码4001')
      throw new Error('用户拒绝了网络切换请求')
    }
    throw new Error(`切换网络失败: ${error.message}`)
  }
}

export const addNetwork = async (networkConfig) => {
  console.log('addNetwork called with config:', networkConfig)
  
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask未安装')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig]
    })
    console.log('网络添加成功')
    return true
  } catch (error) {
    console.error('addNetwork error:', error)
    if (error.code === 4001) {
      console.log('用户拒绝了添加网络请求，错误码4001')
      throw new Error('用户拒绝了添加网络请求')
    }
    throw new Error(`添加网络失败: ${error.message}`)
  }
}

// 尝试切换到指定网络，如果网络不存在则自动添加
export const switchOrAddNetwork = async (networkConfig) => {
  console.log('switchOrAddNetwork called with:', networkConfig)
  
  if (!networkConfig) {
    throw new Error('网络配置不能为空')
  }

  const chainId = parseInt(networkConfig.chainId, 16)
  console.log('解析的chainId:', chainId)

  try {
    // 首先尝试切换网络
    console.log('尝试直接切换网络...')
    await switchNetwork(chainId)
    return { success: true, action: 'switched' }
  } catch (error) {
    console.log('直接切换失败，检查错误码:', error.code)
    // 如果网络不存在，则添加网络
    if (error.code === 4902) {
      console.log('网络不存在，尝试添加网络...')
      try {
        await addNetwork(networkConfig)
        // 添加成功后再次尝试切换
        console.log('网络添加成功，再次尝试切换...')
        await switchNetwork(chainId)
        return { success: true, action: 'added_and_switched' }
      } catch (addError) {
        console.error('添加网络失败:', addError)
        throw addError
      }
    }
    // 其他错误直接抛出
    console.error('切换网络其他错误:', error)
    throw error
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