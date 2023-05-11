import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TopMenu from './pages/topmenu.js';
import Main from './pages/main.js';
import NamespacePage from './pages/namespace/nspage.js';
import FuncPage from './pages/function/funcpage.js';

import { getUserFunction, getUserNamespace, login } from './utils/axios.js';

const App = () => {
  var browsertoken = window.localStorage.getItem('browsertoken');
  var browserid = window.localStorage.getItem('browserid');

  const [bsert, setBsert] = useState({ browserid, browsertoken });
  const dispatch = useDispatch();


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

  const handleMenuOnClickFunction = ({ key }) => {
    setMenuKey(key);
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw'
    }}>
      <TopMenu handleMenuOnClickFunction={handleMenuOnClickFunction} />
      <div style={{
        height: '1200px',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {menuKey == '1' ? <Main /> : menuKey == '2' ? <NamespacePage /> : <FuncPage />}
      </div>
    </div>
  );
}

export default App;
