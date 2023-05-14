import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Form, Input, Space, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { postModUserDB, postUserNamespace, getMain } from '../../utils/axios';
import DbCom from './dbconfig';

const NewNamespace = () => {
    const [btnState, SetBtnState] = useState(false);
    const [db, setDB] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const browserid = useSelector(state => state.browserid);

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        postUserNamespace(values.namespace).then(res => {
            if (res.status == 'ok') {
                if (db != null) {
                    postModUserDB({ ...db, namespace: values.namespace }).then((v) => {
                        messageApi.info({
                            content: 'ok',
                            icon: <CheckCircleFilled style={{ color: 'green' }} />,
                        });
                        SetBtnState(true)
                        console.log(res)
                        getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))
                    })
                    return
                }
                messageApi.info({
                    content: 'ok',
                    icon: <CheckCircleFilled style={{ color: 'green' }} />,
                });
                SetBtnState(true)
                console.log(res)
                getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return <Card
        title="namespace"
        bordered={false}
        style={{
            width: 600,
            height: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            // marginTop: 50
        }}>
        {contextHolder}
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
                <DbCom dbCallback={(v) => {
                    setDB(v)
                    console.log('newns', v)
                }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10 }}>
                <Space>
                    <Button type="primary" htmlType="submit" disabled={btnState}>
                        创建
                    </Button>
                    <Button type="default" onClick={() => navigate('/namespace')}>
                        返回
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    </Card>
}

export default NewNamespace;