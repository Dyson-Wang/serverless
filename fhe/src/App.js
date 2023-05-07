import { useState } from 'react';

import Main from './pages/main.js';
import NamespacePage from './pages/namespace.js';
import FuncPage from './pages/funcpage.js';

import TopMenu from './components/topmenu.js';

const App = () => {
  const [menuKey, setMenuKey] = useState('1');

  const handleMenuOnClickFunction = ({ item, key, keyPath, domEvent }) => {
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
        height: '100vh',
        width: '100vw',
        alignContent: 'center',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        {menuKey == '1' ? <Main /> : menuKey == '2' ? <NamespacePage /> : <FuncPage />}

      </div>
    </div>
  );
}

export default App;
