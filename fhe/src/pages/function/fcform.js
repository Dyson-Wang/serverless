import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import {
    Button,
    Card,
    Form,
    Input,
    Radio,
    Select,
    InputNumber,
    Space,
    Divider,
    notification,
    message,
    Alert
} from 'antd';
import { CheckCircleFilled } from '@ant-design/icons'
import { Editor } from '@monaco-editor/react';
import { getRandomFuncName, postModUserFunctionConfig, postUserFunction } from '../../utils/axios'

const FCForm = ({ props }) => {
    const { faasname, namespace, owner, createtime, invoketimes, code, config } = props
    const editorRef = useRef(null);
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    form.setFieldsValue({
        maxruntime: config.maxruntime,
        method: config.method,
        comments: config.comments,
        scanobj: config.scanobj,
        funcname: faasname,
        namespace,
        owner,

        createtime,
        invoketimes
    })
    const onFinish = (values) => {
        var data = { code: editorRef.current.getValue(), ...values }

        postModUserFunctionConfig(data).then(data => {
            console.log(data)
            messageApi.info({
                content: 'ok',
                icon: <CheckCircleFilled style={{ color: 'green' }} />,
            });
        })
        console.log('Success:', data);
        messageApi.info({
            content: 'ok',
            icon: <CheckCircleFilled style={{ color: 'green' }} />,
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card
            title="function config"
            style={{
                width: 1000, marginTop: 50, marginLeft: 'auto', marginRight: 'auto'
            }}
            bordered={true}
            headStyle={{ textAlign: 'center' }}
        >
            {contextHolder}
            <Form
                form={form}
                name="basic"
                labelAlign='right'
                labelCol={{
                    span: 6,
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
                        >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            label="Namespace"
                            name="namespace"
                        >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            label="creator"
                            name="owner"
                        >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            label="createtime"
                            name="createtime"
                        >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            label="invoketimes"
                            name="invoketimes"
                        >
                            <Input disabled={true} />
                        </Form.Item>
                        <Form.Item label="Method" name="method" rules={[{ required: true }]}>
                            <Radio.Group>
                                <Radio value="GET"> GET </Radio>
                                <Radio value="POST"> POST </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    <Divider type='vertical' style={{ height: 300 }} />
                    <div style={{
                        width: 450,
                    }}>
                        <Form.Item label="maxruntime" name="maxruntime">
                            <InputNumber
                                min={0}
                                max={15000}
                                addonAfter={'ms'}
                            />
                        </Form.Item>
                        <Form.Item
                            label="函数描述"
                            name="comments"
                        >
                            <Input.TextArea rows={4} placeholder="输入函数描述信息" maxLength={1500} />
                        </Form.Item>
                        <Form.Item
                            label="输入对象实例"
                            name="scanobj"
                        >
                            <Input.TextArea rows={4} placeholder="输入对象示例(JSON)" maxLength={1500} />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item style={{ display: 'grid', justifyItems: 'center' }}>
                    <Editor
                        height="300px"
                        width="800px"
                        defaultLanguage='javascript'
                        defaultValue={`function func(){return "express"};func();`}
                        onMount={(editor, monaco) => {
                            editor.setValue(code)
                            editorRef.current = editor
                        }}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 10, span: 18 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            修改
                        </Button>
                        <Button type="default" onClick={() => navigate('/function')}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default FCForm;