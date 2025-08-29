import { Card, Typography, Button, Row, Col, Space } from 'antd'
import { Link } from 'react-router-dom'
import { RocketOutlined, SearchOutlined } from '@ant-design/icons'
import WalletConnect from '../components/WalletConnect'

const { Title, Text } = Typography

function Home() {

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-title">
          <Title level={1} style={{ marginBottom: '16px' }}>Web3 数据上链项目</Title>
          <Text style={{ fontSize: '16px', color: '#666', display: 'block' }}>
            基于React的Web3应用，实现数据上链的两种核心方式
          </Text>
        </div>
        
        <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          {/* 钱包连接组件 */}
          <WalletConnect />
          
          <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{ 
                height: 'auto', 
                minHeight: '260px',
                textAlign: 'center',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              cover={
                <div style={{ 
                  padding: '32px 24px', 
                  backgroundColor: '#f8f9ff',
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #e6f7ff 100%)'
                }}>
                  <RocketOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </div>
              }
              actions={[
                <Link to="/transfer" key="transfer">
                  <Button type="primary" size="large" style={{ minWidth: '120px' }}>
                    开始转账
                  </Button>
                </Link>
              ]}
            >
              <Card.Meta
                title={<span style={{ fontSize: '18px', fontWeight: 600 }}>直接转账上链</span>}
                description={
                  <Text style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                    发送ETH转账，将交易数据记录在区块链上。通过MetaMask钱包完成链上交易操作。
                  </Text>
                }
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{ 
                height: 'auto', 
                minHeight: '260px',
                textAlign: 'center',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              cover={
                <div style={{ 
                  padding: '32px 24px', 
                  backgroundColor: '#f6ffed',
                  background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)'
                }}>
                  <SearchOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                </div>
              }
              actions={[
                <Link to="/query" key="query">
                  <Button type="primary" size="large" style={{ minWidth: '120px' }}>
                    开始查询
                  </Button>
                </Link>
              ]}
            >
              <Card.Meta
                title={<span style={{ fontSize: '18px', fontWeight: 600 }}>第三方服务查询</span>}
                description={
                  <Text style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                    使用Infura和Alchemy等服务读取链上数据，查询交易记录和账户信息。
                  </Text>
                }
              />
            </Card>
          </Col>
          </Row>
        </Space>
      </div>
    </div>
  )
}

export default Home