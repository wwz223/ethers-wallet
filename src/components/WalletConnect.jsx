import { useState, useEffect } from 'react'
import { Button, Card, Spin, message, Space, Typography, Divider, Tag } from 'antd'
import { WalletOutlined, DisconnectOutlined, ReloadOutlined } from '@ant-design/icons'
import { 
  connectWallet, 
  checkMetaMaskInstalled, 
  getWalletInfo, 
  onAccountsChanged, 
  onChainChanged, 
  removeListener 
} from '../utils/wallet'

const { Title, Text, Paragraph } = Typography

const WalletConnect = ({ onWalletChange }) => {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // 检查现有连接
  const checkExistingConnection = async () => {
    setInitialLoading(true)
    try {
      const walletInfo = await getWalletInfo()
      if (walletInfo) {
        setWallet(walletInfo)
        onWalletChange?.(walletInfo)
      }
    } catch (error) {
      console.error('检查现有连接失败:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  // 连接钱包
  const handleConnect = async () => {
    if (!checkMetaMaskInstalled()) {
      message.error('请先安装MetaMask钱包')
      return
    }

    setLoading(true)
    try {
      const walletInfo = await connectWallet()
      setWallet(walletInfo)
      onWalletChange?.(walletInfo)
      message.success('钱包连接成功')
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 断开连接
  const handleDisconnect = () => {
    setWallet(null)
    onWalletChange?.(null)
    message.info('钱包已断开连接')
  }

  // 刷新钱包信息
  const handleRefresh = async () => {
    if (!wallet) return
    
    setLoading(true)
    try {
      const walletInfo = await getWalletInfo()
      if (walletInfo) {
        setWallet(walletInfo)
        onWalletChange?.(walletInfo)
        message.success('钱包信息已更新')
      }
    } catch (error) {
      message.error('刷新失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 账户变化处理
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect()
    } else {
      const walletInfo = await getWalletInfo()
      if (walletInfo) {
        setWallet(walletInfo)
        onWalletChange?.(walletInfo)
        message.info('账户已切换')
      }
    }
  }

  // 网络变化处理
  const handleChainChanged = async () => {
    const walletInfo = await getWalletInfo()
    if (walletInfo) {
      setWallet(walletInfo)
      onWalletChange?.(walletInfo)
      message.info('网络已切换')
    }
  }

  // 格式化地址
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 格式化余额
  const formatBalance = (balance) => {
    if (!balance) return '0'
    return parseFloat(balance).toFixed(4)
  }

  // 获取网络显示名称
  const getNetworkName = (network) => {
    if (!network) return '未知网络'
    
    const networkNames = {
      1: 'Ethereum 主网',
      11155111: 'Sepolia 测试网',
      137: 'Polygon 主网',
      80001: 'Mumbai 测试网'
    }
    
    return networkNames[Number(network.chainId)] || `网络 ${network.chainId}`
  }

  // 获取网络颜色
  const getNetworkColor = (network) => {
    if (!network) return 'default'
    
    const networkColors = {
      1: 'blue',
      11155111: 'orange', 
      137: 'purple',
      80001: 'cyan'
    }
    
    return networkColors[Number(network.chainId)] || 'default'
  }

  useEffect(() => {
    checkExistingConnection()

    // 监听账户和网络变化
    onAccountsChanged(handleAccountsChanged)
    onChainChanged(handleChainChanged)

    return () => {
      removeListener('accountsChanged', handleAccountsChanged)
      removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  if (initialLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>检查钱包连接状态...</div>
        </div>
      </Card>
    )
  }

  if (!checkMetaMaskInstalled()) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <WalletOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <Title level={4}>未检测到MetaMask</Title>
          <Paragraph type="secondary">
            请安装MetaMask钱包扩展程序以使用Web3功能
          </Paragraph>
          <Button 
            type="primary" 
            href="https://metamask.io/download/" 
            target="_blank"
            rel="noopener noreferrer"
          >
            下载MetaMask
          </Button>
        </div>
      </Card>
    )
  }

  if (!wallet) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <WalletOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={4}>连接MetaMask钱包</Title>
          <Paragraph type="secondary">
            请连接您的MetaMask钱包以开始使用Web3功能
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            loading={loading}
            onClick={handleConnect}
            icon={<WalletOutlined />}
          >
            连接钱包
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <WalletOutlined />
          <span>钱包信息</span>
          <Tag color="green">已连接</Tag>
        </div>
      }
      extra={
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
            type="text"
          />
          <Button 
            icon={<DisconnectOutlined />} 
            onClick={handleDisconnect}
            type="text"
            danger
          />
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>钱包地址:</Text>
          <div style={{ marginTop: '4px' }}>
            <Text code copyable={{ text: wallet.address }}>
              {formatAddress(wallet.address)}
            </Text>
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>余额:</Text>
          <div style={{ marginTop: '4px' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {formatBalance(wallet.balance)} ETH
            </Text>
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>网络:</Text>
          <div style={{ marginTop: '4px' }}>
            <Tag color={getNetworkColor(wallet.network)}>
              {getNetworkName(wallet.network)}
            </Tag>
          </div>
        </div>
      </Space>
    </Card>
  )
}

export default WalletConnect