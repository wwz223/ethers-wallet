import { useState, useEffect } from 'react'
import { Button, Dropdown, Space, Typography, Tag, message, Spin, Modal } from 'antd'
import { WalletOutlined, DisconnectOutlined, ReloadOutlined, DownOutlined, SwapOutlined } from '@ant-design/icons'
import { 
  connectWallet, 
  checkMetaMaskInstalled, 
  getWalletInfo, 
  onAccountsChanged, 
  onChainChanged, 
  removeListener 
} from '../utils/wallet'
import { getNetworkName, getNetworkColor, getNetworkIcon } from '../utils/networks'
import NetworkSwitcher from './NetworkSwitcher'

const { Text } = Typography

const HeaderWallet = ({ onWalletChange }) => {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [networkModalVisible, setNetworkModalVisible] = useState(false)

  // 检查现有连接
  const checkExistingConnection = async () => {
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

  // 打开网络切换器模态框
  const handleOpenNetworkSwitcher = () => {
    setNetworkModalVisible(true)
  }

  // 网络切换完成处理
  const handleNetworkChanged = async () => {
    const walletInfo = await getWalletInfo()
    if (walletInfo) {
      setWallet(walletInfo)
      onWalletChange?.(walletInfo)
      setNetworkModalVisible(false)
    }
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
    return <Spin size="small" />
  }

  if (!checkMetaMaskInstalled()) {
    return (
      <Button 
        type="primary" 
        ghost
        href="https://metamask.io/download/" 
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        className="header-wallet-button"
      >
        安装MetaMask
      </Button>
    )
  }

  if (!wallet) {
    return (
      <Button 
        type="primary" 
        loading={loading}
        onClick={handleConnect}
        icon={<WalletOutlined />}
        size="small"
        className="header-wallet-button"
      >
        连接钱包
      </Button>
    )
  }

  const dropdownItems = [
    {
      key: 'address',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>钱包地址</Text>
          <div style={{ marginTop: '4px' }}>
            <Text code copyable={{ text: wallet.address }}>
              {formatAddress(wallet.address)}
            </Text>
          </div>
        </div>
      ),
      disabled: true
    },
    {
      key: 'balance',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>余额</Text>
          <div style={{ marginTop: '4px' }}>
            <Text>{formatBalance(wallet.balance)} ETH</Text>
          </div>
        </div>
      ),
      disabled: true
    },
    {
      key: 'network',
      label: (
        <div style={{ padding: '8px 0' }}>
          <Text strong>网络</Text>
          <div style={{ marginTop: '4px' }}>
            <Tag color={getNetworkColor(Number(wallet.network?.chainId))} size="small">
              <Space size="small">
                <span>{getNetworkIcon(Number(wallet.network?.chainId))}</span>
                <span>{getNetworkName(Number(wallet.network?.chainId))}</span>
              </Space>
            </Tag>
          </div>
        </div>
      ),
      disabled: true
    },
    {
      key: 'switch-network',
      label: '切换网络',
      icon: <SwapOutlined />,
      onClick: handleOpenNetworkSwitcher
    },
    { type: 'divider' },
    {
      key: 'refresh',
      label: '刷新信息',
      icon: <ReloadOutlined />,
      onClick: handleRefresh,
      disabled: loading
    },
    {
      key: 'disconnect',
      label: '断开连接',
      icon: <DisconnectOutlined />,
      onClick: handleDisconnect,
      danger: true
    }
  ]

  return (
    <>
      <Dropdown 
        menu={{ items: dropdownItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button 
          type="text" 
          style={{ 
            color: '#1890ff',
            border: '1px solid #1890ff',
            borderRadius: '6px'
          }}
        >
          <Space size={4}>
            <WalletOutlined />
            <span>{formatAddress(wallet.address)}</span>
            <DownOutlined style={{ fontSize: '10px' }} />
          </Space>
        </Button>
      </Dropdown>

      {/* 网络切换模态框 */}
      <Modal
        title="切换网络"
        open={networkModalVisible}
        onCancel={() => setNetworkModalVisible(false)}
        footer={null}
        width={500}
      >
        <NetworkSwitcher 
          currentNetwork={wallet?.network}
          onNetworkChanged={handleNetworkChanged}
          disabled={loading}
        />
      </Modal>
    </>
  )
}

export default HeaderWallet