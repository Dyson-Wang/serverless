import { useSelector } from "react-redux";
import { Button, Card, Form, Input, Space } from 'antd';

import { postUserNamespace } from '../../utils/axios';
import DbCom from './dbconfig';

const NewNamespace = ({ setOpen }) => {
    const browserid = useSelector(state => state.browserid);

    const onFinish = (values) => {
        postUserNamespace(values.namespace).then(res => console.log(res));
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return <Card
        title="namespace"
        style={{
            width: 600,
            height: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 50
        }}>
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

export default NewNamespace;