import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
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
    Alert,
    Modal,
    Descriptions
} from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { Editor } from '@monaco-editor/react';
import { getRandomFuncName, postUserFunction, getMain, getUserFunction } from '../../utils/axios'

const editorDefaultString = `function func() {
    /*
        全局内置了require模块、glob对象(包含请求参数键值对、mysql对象、stdw输出流方法)
    */

    // 请以此调用作为HTTP响应,传入Buffer或者Object
    glob.stdw('hello serverless!')
}
func()`

const NewFunc = () => {
    const [btnState, SetBtnState] = useState(false);
    const editorRef = useRef(null);
    const namespaceState = useSelector(state => state.namespaceState);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isGet, setIsGet] = useState(true);
    const browsertoken = useSelector(state => state.browsertoken)

    useEffect(() => {
        getRandomFuncName().then(data => form.setFieldsValue({
            maxruntime: 10,
            method: 'GET',
            funcname: data,
        }))
    }, [])

    const [esl, setESL] = useState(null);
    const [eslinfo, setESLinfo] = useState({
        funcurl: '',
        vm: '',
        esl: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        setESL(null)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setESL(null)
    };

    const onFinish = (values) => {
        if (values.method == 'GET') values.scanobj = {};
        if (values.scanobj == undefined) values.scanobj = {};
        showModal()
        var data = { code: editorRef.current.getValue(), ...values }
        console.log(data)

        postUserFunction(data, browsertoken).then(data => {
            console.log(data)
            if (data.status == 'fail') {
                setESLinfo({...eslinfo, ...data.message})
                setESL(false)
                messageApi.info({
                    content: 'error',
                    icon: <CloseCircleFilled style={{ color: 'red' }} />,
                });
                return
            }
            setESLinfo({...eslinfo, ...data})
            setESL(true)
            messageApi.info({
                content: 'ok',
                icon: <CheckCircleFilled style={{ color: 'green' }} />,
            });
            SetBtnState(true)
            getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))
            getUserFunction(browsertoken).then(value => dispatch({ type: 'setNewFunctionStatus', value }))
        })
    };
    const onFinishFailed = (errorInfo) => {
    };

    return (
        <Card
            title="add function"
            style={{
                width: 1000, marginTop: 20, marginLeft: 'auto', marginRight: 'auto'
            }}
            bordered={false}
            headStyle={{ textAlign: 'center' }}
        >
            <Modal
                title={esl == null ? <div><ExclamationCircleFilled style={{ color: 'darkorange' }} /> 正在上传并校验函数...</div> : esl ? <div><CheckCircleFilled style={{ color: 'green' }} /> 上传成功</div> : <div><CloseCircleFilled style={{ color: 'red' }} /> 运行失败</div>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={esl == null}
                mask={true}
                maskClosable={false}
            >
                {esl == null ? <p>运行校验中...</p> : esl ?
                    <Descriptions title="User Info" bordered layout='horizontal' column={4} >
                        <Descriptions.Item label="调用地址" span={4}>
                            {eslinfo.funcurl}
                        </Descriptions.Item>
                        <Descriptions.Item label="VM Tips">
                            {eslinfo.vm}
                        </Descriptions.Item>
                    </Descriptions>
                    :
                    <Descriptions title="User Info" bordered layout='horizontal' column={4} >
                        <Descriptions.Item label="ESLint Tips" span={4}>
                            {eslinfo.esl}
                        </Descriptions.Item>
                        <Descriptions.Item label="VM Tips">
                            {eslinfo.vm}
                        </Descriptions.Item>
                    </Descriptions>
                }
            </Modal>
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
                onValuesChange={(cv) => {
                    if (cv.method != undefined && cv.method == 'GET') {
                        setIsGet(true)
                    } else if (cv.method != undefined && cv.method == 'POST') {
                        setIsGet(false)
                    }
                }}
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
                            <Input.TextArea rows={4} placeholder="输入对象示例(全局作用域, 默认为空对象)" maxLength={1500} disabled={isGet} />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item style={{ display: 'grid', justifyItems: 'center' }}>
                    <Editor
                        height="300px"
                        width="800px"
                        defaultLanguage='javascript'
                        defaultValue={editorDefaultString}
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
                        <Button type="default" onClick={() => navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default NewFunc;