import { useState } from 'react'
import { Card, Form, Input, Button, Typography, Table, Space, Tag, Divider } from 'antd'
import { SearchOutlined, LinkOutlined, WalletOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function Query({ wallet }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [queryResult, setQueryResult] = useState(null)
  const [transactions, setTransactions] = useState([])

  const handleQuery = async (values) => {
    setLoading(true)
    try {
      console.log('Query values:', values)
      // 模拟查询延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟查询结果
      setQueryResult({
        address: values.address,
        balance: '1.2345',
        txCount: 42
      })
      
      // 模拟交易记录
      setTransactions([
        {
          key: '1',
          hash: '0xabc123...def456',
          from: '0x742d35...14e3',
          to: '0x8ba1f1...09aF',
          value: '0.5',
          status: 'success',
          timestamp: '2024-01-15 14:30:22'
        },
        {
          key: '2', 
          hash: '0xdef789...abc123',
          from: '0x8ba1f1...09aF',
          to: '0x742d35...14e3',
          value: '0.3',
          status: 'success',
          timestamp: '2024-01-14 09:15:10'
        }
      ])
    } catch (error) {
      console.error('Query failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '交易哈希',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash) => (
        <Space>
          <Text code>{hash}</Text>
          <Button type="link" size="small" icon={<LinkOutlined />}>
            查看详情
          </Button>
        </Space>
      )
    },
    {
      title: '发送方',
      dataIndex: 'from',
      key: 'from',
      render: (from) => <Text code>{from}</Text>
    },
    {
      title: '接收方',
      dataIndex: 'to', 
      key: 'to',
      render: (to) => <Text code>{to}</Text>
    },
    {
      title: '金额 (ETH)',
      dataIndex: 'value',
      key: 'value',
      render: (value) => <Text strong>{value} ETH</Text>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    }
  ]

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-title">
          <SearchOutlined style={{ 
            fontSize: '48px', 
            color: '#52c41a', 
            marginBottom: '16px',
            display: 'block'
          }} />
          <Title level={2} style={{ marginBottom: '12px' }}>链上数据查询</Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            通过第三方服务查询以太坊地址信息和交易记录
          </Text>
        </div>

        <Card style={{ 
          marginBottom: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleQuery}
            style={{ width: '100%' }}
            className={window.innerWidth <= 767 ? 'ant-form-inline' : ''}
          >
            <Form.Item
              name="address"
              rules={[
                { required: true, message: '请输入查询地址' },
                { pattern: /^0x[a-fA-F0-9]{40}$/, message: '请输入有效的以太坊地址' }
              ]}
              style={{ flex: 1, minWidth: '280px' }}
            >
              <Input 
                placeholder="输入要查询的以太坊地址 (0x...)"
                prefix={<WalletOutlined />}
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                icon={<SearchOutlined />}
                style={{ 
                  borderRadius: '8px',
                  minWidth: '100px',
                  fontWeight: 500
                }}
              >
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {queryResult && (
          <>
            <Card 
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>地址信息</span>} 
              style={{ 
                marginBottom: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ padding: '8px 0' }}>
                  <Text strong style={{ marginRight: '12px', minWidth: '80px', display: 'inline-block' }}>
                    地址:
                  </Text>
                  <Text code style={{ wordBreak: 'break-all', fontSize: '14px' }}>
                    {queryResult.address}
                  </Text>
                </div>
                <div style={{ padding: '8px 0' }}>
                  <Text strong style={{ marginRight: '12px', minWidth: '80px', display: 'inline-block' }}>
                    余额:
                  </Text>
                  <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    {queryResult.balance} ETH
                  </Text>
                </div>
                <div style={{ padding: '8px 0' }}>
                  <Text strong style={{ marginRight: '12px', minWidth: '80px', display: 'inline-block' }}>
                    交易次数:
                  </Text>
                  <Text style={{ fontSize: '15px' }}>{queryResult.txCount}</Text>
                </div>
              </Space>
            </Card>

            <Card 
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>最近交易记录</span>}
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <Table 
                  columns={columns}
                  dataSource={transactions}
                  pagination={{ 
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                  }}
                  scroll={{ x: 800 }}
                  size="middle"
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default Query