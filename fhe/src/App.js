import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Breadcrumb, Image, Layout, Menu, theme } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

import Main from './pages/main.js';
import NamespacePage from './pages/namespace/nspage.js';
import FuncPage from './pages/function/funcpage.js';

import { getUserFunction, getUserNamespace, login } from './utils/axios.js';
// import '../public/favicon.ico'

const { Header, Content, Footer } = Layout;

const App = () => {
  var browsertoken = window.localStorage.getItem('browsertoken');
  var browserid = window.localStorage.getItem('browserid');

  const [bsert, setBsert] = useState({ browserid, browsertoken });
  const dispatch = useDispatch();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (!(bsert.browserid && bsert.browsertoken)) {
      login().then(o => {
        window.localStorage.setItem('browsertoken', o.browsertoken);
        window.localStorage.setItem('browserid', o.browserid);
        setBsert(o);
        dispatch({ type: 'setBrowserTokenAndId', value: o });
      })
    } else {
      dispatch({ type: 'setBrowserTokenAndId', value: bsert });
      getUserNamespace().then(value => dispatch({ type: 'setNewNamespaceStatus', value }))
      getUserFunction().then(value => dispatch({ type: 'setNewFunctionStatus', value }))
    }
  }, [bsert])

  const [menuKey, setMenuKey] = useState('1');

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}
      >
        <div
          style={{
            float: 'left',
            width: 120,
            height: 31,
            margin: '16px 24px 16px 0',
            background: 'rgba(255, 255, 255, 1)',
          }}
        >Serverless</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', label: 'main', icon: <PieChartOutlined /> },
            { key: '2', label: 'namespace', icon: <ContainerOutlined /> },
            { key: '3', label: 'function', icon: <DesktopOutlined /> }
          ]}
          onClick={({ key }) => setMenuKey(key)}
        />
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: '0 50px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          <div style={{
            height: '80vh',
            // width: '100vw',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {menuKey == '1' ? <Main /> : menuKey == '2' ? <NamespacePage /> : <FuncPage />}
          </div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default App;
