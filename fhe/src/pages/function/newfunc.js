import { useRef, useState } from 'react';
import {useNavigate} from 'react-router-dom'
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
import { getRandomFuncName, postUserFunction } from '../../utils/axios'

const NewFunc = () => {
    const [btnState, SetBtnState] = useState(false);
    const editorRef = useRef(null);
    const namespaceState = useSelector(state => state.namespaceState);
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    getRandomFuncName().then(data => form.setFieldsValue({
        maxruntime: 10,
        method: 'GET',
        funcname: data
    }))
    const onFinish = (values) => {
        var data = { code: editorRef.current.getValue(), ...values }

        postUserFunction(data).then(data => {
            console.log(data)
            messageApi.info({
                content: 'ok',
                icon: <CheckCircleFilled style={{ color: 'green' }} />,
            });
            SetBtnState(true)
        })
        console.log('Success:', data);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card
            title="add function"
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input namespace!',
                                },
                            ]}
                        >
                            <Select>
                                {namespaceState.map((ele, index) => {
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
                            editorRef.current = editor
                        }}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 10, span: 18 }}>
                    <Space>
                        <Button type="primary" htmlType="submit" disabled={btnState}>
                            创建
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

export default NewFunc;