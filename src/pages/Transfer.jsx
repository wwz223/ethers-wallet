import { useState } from 'react'
import { Card, Form, Input, Button, Typography, Alert, Space } from 'antd'
import { WalletOutlined, SendOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function Transfer() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  
  const handleTransfer = async (values) => {
    setLoading(true)
    try {
      // 这里将实现转账逻辑
      console.log('Transfer values:', values)
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTxHash('0x1234567890abcdef...')
    } catch (error) {
      console.error('Transfer failed:', error)
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

          <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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
                  {loading ? '处理中...' : '发起转账'}
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
                    <Button type="link" size="small">
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