import { useState } from 'react'
import { Select, Button, Space, Typography, Tag, message, Modal } from 'antd'
import { SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  getNetworkOptions,
  getMainnetOptions,
  getTestnetOptions,
  formatNetworkForMetaMask,
  SUPPORTED_NETWORKS,
  getNetworkName,
  getNetworkColor,
  getNetworkIcon
} from '../utils/networks'
import { switchOrAddNetwork } from '../utils/wallet'

const { Text } = Typography
const { OptGroup } = Select

const NetworkSwitcher = ({ currentNetwork, onNetworkChanged, disabled = false }) => {
  const [switching, setSwitching] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(null)

  // 获取当前网络信息
  const getCurrentNetworkInfo = () => {
    if (!currentNetwork) return null
    
    const chainId = Number(currentNetwork.chainId)
    return {
      chainId,
      name: getNetworkName(chainId),
      color: getNetworkColor(chainId),
      icon: getNetworkIcon(chainId)
    }
  }

  // 处理网络选择
  const handleNetworkSelect = (chainId) => {
    const networkKey = Object.keys(SUPPORTED_NETWORKS).find(
      key => SUPPORTED_NETWORKS[key].chainId === chainId
    )
    setSelectedNetwork(networkKey)
  }

  // 执行网络切换
  const handleNetworkSwitch = async () => {
    if (!selectedNetwork) {
      message.warning('请选择要切换的网络')
      return
    }

    console.log('开始切换网络:', selectedNetwork)
    const networkConfig = formatNetworkForMetaMask(selectedNetwork)
    console.log('网络配置:', networkConfig)
    
    if (!networkConfig) {
      message.error('网络配置错误')
      return
    }

    // 检查是否切换到相同网络
    const targetChainId = parseInt(networkConfig.chainId, 16)
    const currentChainId = currentNetwork ? Number(currentNetwork.chainId) : null
    
    console.log('目标网络ID:', targetChainId, '当前网络ID:', currentChainId)
    
    if (targetChainId === currentChainId) {
      message.info('已经连接到该网络')
      setSelectedNetwork(null)
      return
    }

    setSwitching(true)
    
    try {
      console.log('调用switchOrAddNetwork...')
      const result = await switchOrAddNetwork(networkConfig)
      console.log('切换结果:', result)
      
      if (result.success) {
        const actionText = result.action === 'switched' ? '切换' : '添加并切换'
        message.success(`网络${actionText}成功`)
        setSelectedNetwork(null)
        
        // 通知父组件网络已变化
        if (onNetworkChanged) {
          onNetworkChanged()
        }
      }
    } catch (error) {
      console.error('Network switch error:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      message.error(error.message || '网络切换失败')
    } finally {
      setSwitching(false)
    }
  }

  // 显示网络切换确认对话框
  const showSwitchConfirm = () => {
    if (!selectedNetwork) return

    const targetNetwork = SUPPORTED_NETWORKS[selectedNetwork]
    const currentInfo = getCurrentNetworkInfo()

    Modal.confirm({
      title: '确认切换网络',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div style={{ marginTop: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>从: </Text>
              {currentInfo ? (
                <Tag color={currentInfo.color}>
                  {currentInfo.icon} {currentInfo.name}
                </Tag>
              ) : (
                <Tag>未连接</Tag>
              )}
            </div>
            <div>
              <Text>到: </Text>
              <Tag color={targetNetwork.color}>
                {targetNetwork.icon} {targetNetwork.chainName}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              如果该网络未添加到MetaMask，将自动添加
            </Text>
          </Space>
        </div>
      ),
      onOk: handleNetworkSwitch,
      onCancel: () => setSelectedNetwork(null),
      okText: '确认切换',
      cancelText: '取消',
      okButtonProps: { loading: switching }
    })
  }

  // 当选择网络时显示确认对话框
  const handleSelectChange = (chainId) => {
    const networkKey = Object.keys(SUPPORTED_NETWORKS).find(
      key => SUPPORTED_NETWORKS[key].chainId === chainId
    )
    
    if (networkKey) {
      setSelectedNetwork(networkKey)
      // 延迟显示对话框，确保状态更新完成
      setTimeout(showSwitchConfirm, 100)
    }
  }

  const currentInfo = getCurrentNetworkInfo()

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Text strong>当前网络:</Text>
        {currentInfo ? (
          <Tag color={currentInfo.color}>
            <Space size="small">
              <span>{currentInfo.icon}</span>
              <span>{currentInfo.name}</span>
            </Space>
          </Tag>
        ) : (
          <Tag>未连接</Tag>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Select
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="选择要切换的网络"
          value={undefined}
          onChange={handleSelectChange}
          disabled={disabled || switching}
          showSearch
          optionFilterProp="label"
        >
          <OptGroup label="主网">
            {getMainnetOptions().map(option => (
              <Select.Option
                key={option.key}
                value={option.value}
                label={option.label}
              >
                <Space>
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </Space>
              </Select.Option>
            ))}
          </OptGroup>
          <OptGroup label="测试网">
            {getTestnetOptions().map(option => (
              <Select.Option
                key={option.key}
                value={option.value}
                label={option.label}
              >
                <Space>
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </Space>
              </Select.Option>
            ))}
          </OptGroup>
        </Select>
      </div>

      <Text type="secondary" style={{ fontSize: '12px' }}>
        💡 提示：切换网络需要在MetaMask中确认，如果网络不存在会自动添加
      </Text>
    </Space>
  )
}

export default NetworkSwitcher