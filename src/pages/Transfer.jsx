import { useState } from 'react'
import { Card, Form, Input, Button, Typography, Alert, Space, message } from 'antd'
import { WalletOutlined, SendOutlined } from '@ant-design/icons'
import { ethers } from 'ethers'

const { Title, Text } = Typography

function Transfer({ wallet }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  
  const handleTransfer = async (values) => {
    if (!wallet) {
      message.error('请先连接钱包')
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // 准备交易参数
      const tx = {
        to: values.to,
        value: ethers.parseEther(values.amount),
        gasLimit: 21000
      }

      // 如果有备注，添加到data字段
      if (values.memo) {
        tx.data = ethers.toUtf8Bytes(values.memo)
        tx.gasLimit = 25000 // 增加gas限制以容纳data
      }

      // 发送交易
      const transaction = await signer.sendTransaction(tx)
      message.success('交易已提交，等待确认...')
      
      // 等待交易确认
      const receipt = await transaction.wait()
      setTxHash(receipt.hash)
      message.success('转账成功！')
      
    } catch (error) {
      console.error('Transfer failed:', error)
      if (error.code === 4001) {
        message.error('用户拒绝了交易')
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        message.error('余额不足')
      } else {
        message.error(`转账失败: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="responsive-form">
          <div className="page-title">
            <WalletOutlined style={{ 
              fontSize: '48px', 
              color: '#1890ff', 
              marginBottom: '16px',
              display: 'block'
            }} />
            <Title level={2} style={{ marginBottom: '12px' }}>ETH转账上链</Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>
              将ETH发送到指定地址，交易数据将永久记录在区块链上
            </Text>
          </div>

          {!wallet && (
            <Alert
              message="需要连接钱包"
              description="请在页面右上角连接您的MetaMask钱包才能进行转账操作"
              type="warning"
              showIcon
              style={{ marginBottom: '24px', borderRadius: '8px' }}
            />
          )}

          <Card 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: wallet ? 1 : 0.6
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleTransfer}
              autoComplete="off"
            >
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>接收地址</span>}
                name="to"
                rules={[
                  { required: true, message: '请输入接收地址' },
                  { pattern: /^0x[a-fA-F0-9]{40}$/, message: '请输入有效的以太坊地址' }
                ]}
              >
                <Input 
                  placeholder="0x..." 
                  prefix={<WalletOutlined />}
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500 }}>转账金额 (ETH)</span>}
                name="amount"
                rules={[
                  { required: true, message: '请输入转账金额' },
                  { pattern: /^[0-9]*\.?[0-9]+$/, message: '请输入有效的数字' }
                ]}
              >
                <Input 
                  placeholder="0.01" 
                  suffix="ETH"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500 }}>备注信息 (可选)</span>}
                name="memo"
              >
                <Input.TextArea 
                  placeholder="可添加转账备注..."
                  rows={3}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  disabled={!wallet}
                  size="large"
                  block
                  icon={<SendOutlined />}
                  style={{ 
                    borderRadius: '8px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  {loading ? '处理中...' : !wallet ? '请先连接钱包' : '发起转账'}
                </Button>
              </Form.Item>
            </Form>

            {txHash && (
              <Alert
                message="转账成功！"
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text style={{ wordBreak: 'break-all' }}>
                      交易哈希: {txHash}
                    </Text>
                    <Button 
                      type="link" 
                      size="small"
                      href={`https://${wallet?.network?.chainId === 1 ? '' : 'sepolia.'}etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      在Etherscan上查看
                    </Button>
                  </Space>
                }
                type="success"
                showIcon
                style={{ 
                  marginTop: '16px',
                  borderRadius: '8px'
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Transfer