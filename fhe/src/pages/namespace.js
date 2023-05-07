import { useState } from 'react';
import { Button, Modal, Card, Form, Checkbox, Input, Radio } from 'antd';
import NamespaceTable from '../components/namespacetable';
import instance from '../utils/axios';

const NamespacePage = ({ username }) => {
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState([])
    const onFinish = (values) => {
        // instance.post('/addfunc', values)
        //     .then((res) => console.log(res))
        //     .catch((err) => console.log(err))
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            {open == false ?
                <>
                    <Button type='primary' onClick={() => setOpen(true)} style={{ width: 150 }}>新建命名空间</Button>
                    <NamespaceTable />
                </>
                :
                <Card title="namespace" style={{ width: 600, height: 400 }}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="User"
                            name="owner"
                            initialValue={username}
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
                            <Input />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 10,
                            }}

                        >
                            <Button type="primary" htmlType="submit">
                                创建
                            </Button>

                            <Button type="default" onClick={() => setOpen(false)}>
                                返回
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>}
        </>
    );
}

export default NamespacePage;