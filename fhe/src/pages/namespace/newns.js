import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Form, Input, Space, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { postModUserDB, postUserNamespace, getMain, getUserFunction, getUserNamespace } from '../../utils/axios';
import DbCom from './dbconfig';

const NewNamespace = () => {
    const [btnState, SetBtnState] = useState(false);
    const [db, setDB] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const browserid = useSelector(state => state.browserid);
    const browsertoken = useSelector(state => state.browsertoken)

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values) => {
        postUserNamespace(values.namespace, browsertoken).then(res => {
            if (res.status == 'ok') {
                if (db != null) {
                    postModUserDB({ ...db, namespace: values.namespace }, browsertoken).then((v) => {
                        messageApi.info({
                            content: 'ok',
                            icon: <CheckCircleFilled style={{ color: 'green' }} />,
                        });
                        SetBtnState(true)
                        getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))
                        getUserNamespace(browsertoken).then(value => dispatch({ type: 'setNewNamespaceStatus', value }))
                        // getUserFunction(browsertoken).then(value => dispatch({ type: 'setNewFunctionStatus', value }))
                    })
                    return
                }
                messageApi.info({
                    content: 'ok',
                    icon: <CheckCircleFilled style={{ color: 'green' }} />,
                });
                SetBtnState(true)
                getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))
                getUserNamespace(browsertoken).then(value => dispatch({ type: 'setNewNamespaceStatus', value }))
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
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

            {/* <Form.Item style={{ marginLeft: '50%', marginRight: 'auto' }}> */}
            <div style={{ width: '100%', display: 'flex', justifyContent:'center' }}>
                <DbCom dbCallback={(v) => {
                    setDB(v)
                }} />
            </div>
            {/* </Form.Item> */}

            <Form.Item>
                <Space style={{width: '552px', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
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