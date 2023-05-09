import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Modal, Card, Form, Checkbox, Input, Radio, Select, InputNumber, Space, Divider } from 'antd';
import { RedoOutlined } from '@ant-design/icons'
import instance from '../../utils/axios';
import TableFaas from './tablefaas';
import store from '../../utils/redux';
import { Editor } from '@monaco-editor/react';

const FuncPage = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const { browsertoken, browserid } = store.getState();

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
        instance.get('/funclist', {
            headers: {
                Authorization: browsertoken
            }
        }).then((res) => {
            res.data.map((e, i) => {
                Object.defineProperty(e, 'key', {
                    value: i
                })
            })
            // console.log(res.data)
            store.dispatch({ type: 'setNewFunctionStatus', value: res.data });
        }).catch(err => console.log(err))
    }


    const onFinish = (values) => {
        var data = { code: editorRef.current.getValue(), ...values }
        instance.post('/addfunc', data, { headers: { Authorization: browsertoken } })
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        console.log('Success:', data);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (<>
        {open == false ?
            <>

                <div style={{
                    display: 'flex',
                    marginTop: 100,
                    marginBottom: 50
                }}>
                    <Button onClick={handleOnClick} style={{
                        marginLeft: 'auto',
                        marginRight: '10px'
                    }}>
                        <RedoOutlined />
                    </Button>
                    <Button type='primary' onClick={() => setOpen(true)} style={{
                        // width: 150,
                        marginLeft: '0',
                        marginRight: '15vw',
                    }}>新建函数</Button>
                </div>
                <TableFaas />
            </>
            :
            <>
                <Card title="add function" style={{ width: 1000, marginTop: 50, marginLeft: 'auto', marginRight: 'auto' }} headStyle={{ textAlign: 'center' }}>
                    <Form
                        form={form}
                        name="basic"
                        labelAlign='right'
                        labelCol={{
                            span: 6,
                        }}
                        style={{
                            // display: 'flex'
                        }}
                        initialValues={{
                            maxruntime: 10,
                            method: 'GET'
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"

                    >
                        <div style={{ display: 'flex', marginRight: 'auto' }}>
                            <div style={{
                                width: 450
                            }}>
                                <Form.Item
                                    label="Funcname"
                                    name="funcname"
                                // wrapperCol={{
                                //     span: 10
                                // }}
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

                                <Form.Item label="Method" name="method" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value="GET" defaultChecked> GET </Radio>
                                        <Radio value="POST"> POST </Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="maxruntime" name="maxruntime">
                                    <InputNumber
                                        min={0}
                                        max={15000}
                                        addonAfter={'ms'}
                                    />
                                </Form.Item>
                            </div>

                            <Divider type='vertical' style={{ height: 220 }} />
                            <div style={{
                                width: 450,
                            }}>
                                <Form.Item
                                    label="函数描述"
                                    name="comments"
                                >
                                    <Input.TextArea rows={4} placeholder="输入函数描述信息" maxLength={1500} />
                                </Form.Item>                                <Form.Item
                                    label="输入对象实例"
                                    name="scanobj"
                                >
                                    <Input.TextArea rows={4} placeholder="输入对象示例(JSON)" maxLength={1500} />
                                </Form.Item>
                                {/* <Form.List name="users">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{
                                                        display: 'flex',
                                                        marginBottom: 8,
                                                        
                                                    }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'first']}
                                                        style={{
                                                            // width: 400,
                                                            // marginRight: 0
                                                        }}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Missing first name',
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="First Name" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'last']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Missing last name',
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Last Name" />
                                                    </Form.Item>
                                                    <Button onClick={() => remove(name)}>del</Button>
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block >
                                                    Add field
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List> */}
                            </div>
                        </div>

                        <Form.Item style={{ display: 'grid', justifyItems: 'center' }}>
                            <Editor
                                height="300px"
                                width="800px"
                                defaultLanguage='javascript'
                                defaultValue={`function func(){
    return "express"
};
func();`}
                                onMount={handleEditorDidMount}
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 10, span: 18 }}>
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