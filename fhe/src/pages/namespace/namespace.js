import { useState } from 'react';
import { Button, Modal, Card, Form, Checkbox, Input, Radio, Space } from 'antd';
import NamespaceTable from './namespacetable';
import instance, { postUserNamespace } from '../../utils/axios';
import DbCom from './dbcom'
import store from '../../utils/redux';

const NamespacePage = ({ username }) => {
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState([])
    const { browserid, browsertoken } = store.getState()

    const onFinish = (values) => {
        postUserNamespace(values.namespace).then(res => console.log(res));
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {open == false ?
                <>

                    <div style={{
                        display: 'flex',
                        marginTop: 100,
                        marginBottom: 50
                    }}><Button type='primary' onClick={() => setOpen(true)} style={{
                        width: 150,
                        marginLeft: 'auto',
                        marginRight: '15vw',
                        // marginTop: '100px'
                        // alignSelf: 'center'
                        // position: 'relative',
                        // right: 0,
                        // justifySelf: 'flex-end'
                    }}>新建命名空间</Button></div>
                    <NamespaceTable />
                </>
                :
                <Card title="namespace" style={{ width: 600, height: 400, marginLeft: 'auto', marginRight: 'auto', marginTop: 50 }}>
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
                            display: 'block'
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={{
                            owner: browserid
                        }}
                    >
                        <Form.Item label="User" name="owner" >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item label="Namespace" name="namespace" rules={[{ required: true, message: 'Please input namespace!' }]}>
                            <Input />
                        </Form.Item>


                        <Form.Item style={{ marginLeft: '50%', marginRight: 'auto' }}>
                            <DbCom />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 10 }}>
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
            }
        </>
    );
}

export default NamespacePage;