import { useState, useEffect } from 'react';

import Main from './pages/main.js';
import NamespacePage from './pages/namespace.js';
import FuncPage from './pages/funcpage.js';
import TopMenu from './components/topmenu.js';

import instance from './utils/axios.js';
import { useDispatch, useSelector } from 'react-redux'
import store from './utils/redux.js';

const App = () => {
  useEffect(() => {
    instance.get('/namespace').then((res) => {
      store.dispatch({ type: 'setNewNamespaceStatus', value: res.data });
    }).catch(err => console.log(err));
    instance.get('/funclist').then((res) => {
      store.dispatch({ type: 'setNewFunctionStatus', value: res.data });
    }).catch(err => console.log(err))
  }, [])
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
        backgroundColor: '#d8e3e3',
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
