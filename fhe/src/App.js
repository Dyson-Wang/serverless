import { useState, useEffect } from 'react';

import Main from './pages/main.js';
import NamespacePage from './pages/namespace/namespace.js';
import FuncPage from './pages/function/funcpage.js';
import TopMenu from './pages/topmenu.js';

import instance, { getUserFunction, getUserNamespace, login } from './utils/axios.js';
import { useDispatch, useSelector } from 'react-redux'
import store from './utils/redux.js';



const App = () => {
  var browsertoken = window.localStorage.getItem('browsertoken');
  var browserid = window.localStorage.getItem('browserid')
  const [bsert, setBsert] = useState({ browserid, browsertoken });
  useEffect(() => {
    if (!bsert.browsertoken && !bsert.browserid) {
      login().then(o => {
        setBsert(o)
        store.dispatch({ type: 'setBrowserTokenAndId', value: o });
      })
    } else {
      getUserNamespace().then(value => store.dispatch({ type: 'setNewNamespaceStatus', value }))
      getUserFunction().then(value => store.dispatch({ type: 'setNewFunctionStatus', value }))
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
        // backgroundColor: '#d8e3e3',
        height: '1200px',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent:'center',
        // alignItems:'center'
        // justifyItems: 'center',
        // alignItems: 'center'
      }}>

        {
          menuKey == '1' ?
            <Main /> :
            menuKey == '2' ?
              <NamespacePage username={'fffff'} /> :
              <FuncPage username={'fffff'} />
        }

      </div>
    </div>
  );
}

export default App;
