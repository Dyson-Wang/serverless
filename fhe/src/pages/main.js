import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from 'antd';
import instance from '../utils/axios';

const Main = () => {
    const editorRef = useRef(null)

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
      }

    let handleOnClick = (e) => {
        console.log(editorRef.current.getValue());
        instance.post('/addfunc', {
            author: 'fffff',
            namespace: 'test',
            code: editorRef.current.getValue()
        }).then(function (res) {
            console.log(res)
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
            <Editor height="30vh" width="70vw" defaultLanguage='javascript' defaultValue='function func(){"code here."};func()' onMount={handleEditorDidMount} />
            <Button type='primary' onClick={handleOnClick} style={{
                height: '40px',
                width: '120px'
            }}>上传函数</Button>
        </>
    );
}

export default Main;