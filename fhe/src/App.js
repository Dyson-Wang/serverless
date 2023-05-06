import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Button, Table } from 'antd';

import TopMenu from './components/topmenu.js';
import TableFaas from './components/tablefaas.js'
import InputFaas from './components/input.js';

const App = () => {
  const editorRef = useRef(null)
  const [menuKey, setMenuKey] = useState('1');

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
  }
  // onclick
  let handleOnClick = (e) => {
    console.log(editorRef.current.getValue());
    axios.post('/addfunc', {
      author: 'ffffffffffffffffffffffffffffffff',
      namespace: 'test',
      code: editorRef.current.getValue()
    }).then(function (res) {
      console.log(res)
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleMenuOnClickFunction=({ item, key, keyPath, domEvent }) => {
    setMenuKey(key);
  }

  return (

    <div style={{
      height: '100vh',
      width: '100vw'
    }}>
      <TopMenu handleMenuOnClickFunction = {handleMenuOnClickFunction} />
      <div style={{
        backgroundColor: '#d8e3e3',
        height: '100vh',
        width: '100vw',
        alignContent: 'center',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {menuKey == '1' ? <>
          <TableFaas />
          <br />
          <Editor height="30vh" width="70vw" defaultLanguage='javascript' defaultValue='function func(){"code here."};func()' onMount={handleEditorDidMount} />
          <Button type='primary' onClick={handleOnClick} style={{
            height: '40px',
            width: '120px'
          }}>上传函数</Button>
        </> : <InputFaas />}
      </div>
    </div>
  );
}

export default App;
