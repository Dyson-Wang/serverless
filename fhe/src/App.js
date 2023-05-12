import { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom'
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
import ChildFuncPage from './pages/function/childfunc';
import NewFunc from './pages/function/newfunc.js';
import TableFaas from './pages/function/tablefaas.js';
import NamespaceTable from './pages/namespace/nstable';
import NewNamespace from './pages/namespace/newns';
import ChildNamespacePage from './pages/namespace/childns.js'

import { getUserFunction, getUserNamespace, login } from './utils/axios.js';
import Title from 'antd/es/typography/Title.js';
// import '../public/favicon.ico'

const { Header, Content, Footer } = Layout;

const App = () => {
  var browsertoken = window.localStorage.getItem('browsertoken');
  var browserid = window.localStorage.getItem('browserid');


  const [bsert, setBsert] = useState({ browserid, browsertoken });
  const [menuKey, setMenuKey] = useState('1');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const arr = location.pathname.split('/')
  arr.shift()

  const menuClick = ({ key }) => {
    switch (key) {
      case '2':
        navigate('/namespace')
        break;
      case '3':
        navigate('/function')
        break;

      default:
        navigate('/')
        break;
    }
  }

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
      navigate('/')
      dispatch({ type: 'setBrowserTokenAndId', value: bsert });
      getUserNamespace().then(value => dispatch({ type: 'setNewNamespaceStatus', value }))
      getUserFunction().then(value => dispatch({ type: 'setNewFunctionStatus', value }))
    }
  }, [bsert])

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
            color: 'white',
            height: 31,
            margin: '16px 24px 16px 0',
          }}
        >
          <Title level={3} style={{ color: 'white' }}>Serverless</Title>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', label: 'main', icon: <PieChartOutlined /> },
            { key: '2', label: 'namespace', icon: <ContainerOutlined /> },
            { key: '3', label: 'function', icon: <DesktopOutlined /> }
          ]}
          onClick={menuClick}
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
          {arr.map((item, index, a) => {
            return <Breadcrumb.Item key={index}>
              <Link to={'/' + a.slice(0, index + 1).join('/')}>
                {item == '' ? 'main' : item}
              </Link>
            </Breadcrumb.Item>
          })}
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          <div style={{
            height: '100vh',
            // width: '100vw',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/namespace'>
                <Route path='new' element={<NewNamespace />} />
                <Route path='' element={<NamespaceTable />} />
                <Route path=':id' element={<ChildNamespacePage />} />
              </Route>
              <Route path='/function'>
                <Route path='new' element={<NewFunc />} />
                <Route path='' element={<TableFaas />} />
                <Route path=':id' element={<ChildFuncPage />} />
              </Route>
            </Routes>
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
