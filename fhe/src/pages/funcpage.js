import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Modal, Card, Form, Checkbox, Input, Radio, Select, InputNumber, Space } from 'antd';
import instance from '../utils/axios';
import TableFaas from '../components/tablefaas';
import store from '../utils/redux';
import { Editor } from '@monaco-editor/react';



const FuncPage = ({ username }) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        if (open == true) instance.get('/randomfuncname').then((res) => {
            form.setFieldsValue({
                funcname: res.data
            })
        });
    }, [open])



    const editorRef = useRef(null)

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
    }

    let handleOnClick = (e) => {
        instance.post('/addfunc', {
            namespace: 'test',
            code: editorRef.current.getValue()
        }).then(function (res) {
            console.log(res)
        }).catch((err) => {
            console.log(err);
        })
    }


    const onFinish = (values) => {
        // instance.post('/namespace', values)
        //     .then((res) => console.log(res))
        //     .catch((err) => console.log(err))
        console.log(editorRef.current.getValue());
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (<>
        {open == false ?
            <>
                <Button type='primary' onClick={() => setOpen(true)} style={{ width: 150 }}>新建函数</Button>
                <TableFaas />
            </>
            :
            <>
                <Card title="add function" style={{ width: 1000, marginTop: 50 }} headStyle={{ textAlign: 'center' }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 10,
                        }}
                        wrapperCol={{
                            span: 4
                        }}

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"

                    >
                        <Form.Item
                            label="Funcname"
                            name="funcname"
                        >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            label="Namespace"
                            name="namespace"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input namespace!',
                                },
                            ]}
                        >
                            <Select>
                                {store.getState().namespaceState.map((ele, index) => {
                                    return <Select.Option value={ele.namespace} key={index}>{ele.namespace}</Select.Option>
                                })}

                            </Select>
                        </Form.Item>

                        <Form.Item label="Method" name="method" rules={[{required: true}]}>
                            <Radio.Group>
                                <Radio value="GET"> GET </Radio>
                                <Radio value="POST"> POST </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label="函数描述"
                            name="comments"
                        >
                            <Input placeholder='none' />
                        </Form.Item>

                        <Form.Item label="InputNumber" name={'runtime'}>
                            <InputNumber
                                defaultValue={0}
                                min={0}
                                max={15000}
                                addonAfter={'ms'}
                            />
                        </Form.Item>
                        <Form.Item style={{ display: 'grid', justifyItems: 'center' }}>
                            <Editor
                                height="300px"
                                width="800px"
                                defaultLanguage='javascript'
                                defaultValue='function func(){"code here."};func()'
                                onMount={handleEditorDidMount}
                            />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 10,
                                span: 18,
                            }}
                        >
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    创建
                                </Button>

                                <Button type="default" onClick={() => setOpen(false)}>
                                    返回
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </>
        }
    </>
    );
}

export default FuncPage;