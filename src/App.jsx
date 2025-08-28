import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigProvider, Layout, Menu, Drawer, Button, Space } from 'antd'
import { HomeOutlined, SendOutlined, SearchOutlined, MenuOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Transfer from './pages/Transfer'
import Query from './pages/Query'
import HeaderWallet from './components/HeaderWallet'
import './App.css'

const { Header, Content } = Layout

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [wallet, setWallet] = useState(null)

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/transfer', 
      icon: <SendOutlined />,
      label: '转账上链'
    },
    {
      key: '/query',
      icon: <SearchOutlined />,
      label: '数据查询'
    }
  ]

  const handleMenuClick = (e) => {
    navigate(e.key)
    setDrawerVisible(false)
  }

  const showDrawer = () => {
    setDrawerVisible(true)
  }

  const onCloseDrawer = () => {
    setDrawerVisible(false)
  }

  const handleWalletChange = (walletInfo) => {
    setWallet(walletInfo)
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginRight: '24px', 
              color: '#1890ff',
              cursor: 'pointer'
            }} onClick={() => navigate('/')}>
              Web3 数据上链
            </div>
            
            {/* Desktop Menu */}
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ 
                flex: 1, 
                border: 'none',
                display: 'none'
              }}
              className="desktop-menu"
            />
            
            {/* Header Wallet */}
            <Space style={{ marginLeft: 'auto', marginRight: '16px' }} className="header-wallet-space">
              <HeaderWallet onWalletChange={handleWalletChange} />
            </Space>
            
            {/* Mobile Menu Button */}
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={showDrawer}
              style={{ display: 'none' }}
              className="mobile-menu-btn"
            />
          </div>
        </Header>
        
        {/* Mobile Drawer */}
        <Drawer
          title="导航菜单"
          placement="right"
          onClose={onCloseDrawer}
          open={drawerVisible}
          width={250}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          />
        </Drawer>
        
        <Content style={{ backgroundColor: '#f5f5f5', flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home wallet={wallet} />} />
            <Route path="/transfer" element={<Transfer wallet={wallet} />} />
            <Route path="/query" element={<Query wallet={wallet} />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App