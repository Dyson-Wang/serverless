import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Space, Table, Form, Input, Modal, Radio, message } from 'antd';
import { RedoOutlined, CheckCircleTwoTone, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { delUserNamespace, getUserFunction, postModUserDB, postTestUserDB, getMain, getUserNamespace } from '../../utils/axios';

const onFinish = (values) => {
};
const onFinishFailed = (errorInfo) => {
};
const DbCom = ({ dbCallback, iV = undefined, namespace }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [hadSetDB, setHadSetDB] = useState(false);
    const [db, setDb] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const browsertoken = useSelector(state => state.browsertoken)

    const initialValues = iV ? iV : { host: null, username: null, password: null, port: 3306, database: null, option: 'mysql' }
    const showModal = () => {
        setDb(true);
    };
    const handleOk = () => {
        const data = form.getFieldsValue()
        setConfirmLoading(true);
        postTestUserDB(data, browsertoken).then((v) => {
            if (v.message == 'ok') {
                postModUserDB({ ...data, namespace: namespace }, browsertoken).then((v) => {
                    messageApi.info({
                        content: 'ok',
                        icon: <CheckCircleFilled style={{ color: 'green' }} />,
                    });
                    setDb(false);
                    setConfirmLoading(false);
                    setHadSetDB(true);
                    form.setFieldsValue(initialValues)
                })
            } else {
                messageApi.info({
                    content: 'connection error',
                    icon: <CloseCircleFilled style={{ color: 'red' }} />,
                });
                setConfirmLoading(false);
            }
        })

    };
    const handleCancel = () => {
        setDb(false);
    };
    return (
        <>
            {hadSetDB ? <Button type='default'>
                <CheckCircleTwoTone />
            </Button> : <Button type='default' onClick={showModal}>
                设置数据库服务
            </Button>}

            <Modal
                title="DB serve"
                open={db}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                mask={false}
                maskClosable={false}
            >
                {contextHolder}
                <Form
                    name="basic"
                    form={form}
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                        marginTop: 50
                    }}
                    initialValues={initialValues}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Host"
                        name="host"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your database!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Port"
                        name="port"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Database"
                        name="database"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your database!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Option" name="option" rules={[{ required: true }]}>
                        <Radio.Group >
                            <Radio value="mysql"> mysql </Radio>
                            {/* <Radio value="new" > 新建数据库 </Radio> */}
                        </Radio.Group>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
};

const ChildNamespacePage = () => {
    const params = useParams()
    // 浅拷贝
    const data = useSelector(state => state.functionState.filter((ele, i) => {
        if (ele.namespace == params.id) return true
    }));

    const namespace = useSelector(state => state.namespaceState.filter((ele, i) => {
        if (ele.namespace == params.id) return true
    }))[0]

    const browsertoken = useSelector(state => state.browsertoken)

    var iV = undefined

    if (namespace.dbhost != null) {
        iV = {
            username: namespace.dbusername,
            password: namespace.dbpassword,
            host: namespace.dbhost,
            port: namespace.dbport,
            database: namespace.dbname,
            option: 'mysql',
        }
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const columns = [
        {
            title: '函数名称',
            dataIndex: 'faasname',
            key: 'name',
            render: (text) => <Link to={`/function/${text}`}>{text}</Link>,
        },
        {
            title: '调用次数',
            dataIndex: 'invoketimes',
            key: 'times',
        },
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'ns',
        },
        {
            title: '创建者',
            key: 'owner',
            dataIndex: 'owner'
        },
        {
            title: '创建时间',
            key: 'time',
            dataIndex: 'createtime'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/function/${record.faasname}`}>详情</Link>
                </Space>
            )
        },
    ];

    return <>
        <div style={{
            display: 'flex',
            width: '70vw',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20
        }}>
            <DbCom iV={iV} namespace={namespace.namespace} />
            <Button
                onClick={(e) => getUserFunction(browsertoken).then(data => dispatch({ type: 'setNewFunctionStatus', value: data }))}
                style={{
                    marginLeft: 'auto',
                    marginRight: '10px'
                }}
            >
                <RedoOutlined />
            </Button>
            <Button type='primary' onClick={() => navigate('/function/new')} style={{
                marginLeft: '0',
            }}>新建函数</Button>
            <Button
                type='primary'
                onClick={() => {
                    delUserNamespace(namespace.namespace, browsertoken).then(v => {
                        navigate(`/namespace`)
                        getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))

                        getUserNamespace(browsertoken).then(value => {
                            dispatch({ type: 'setNewNamespaceStatus', value });
                        })
                    })
                }}
                style={{
                    marginLeft: '10px',
                }}
                danger
            >删除命名空间</Button>
        </div>
        <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            style={{
                height: '30vh', width: '70vw', marginLeft: 'auto', marginRight: 'auto'
            }}
            pagination={{ pageSize: 10 }}
        />
    </>
}

export default ChildNamespacePage;