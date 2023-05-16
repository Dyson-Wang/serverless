import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Radio, message } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, CloseCircleFilled } from '@ant-design/icons'
import { postTestUserDB } from '../../utils/axios';

const onFinish = (values) => {
};
const onFinishFailed = (errorInfo) => {
};
const DbCom = ({ dbCallback, iV = undefined }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hadSetDB, setHadSetDB] = useState(false);
  const [db, setDb] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const browsertoken = useSelector(state => state.browsertoken)

  // const [initialValues, setInitialValues] = useState({username: null, password: null, port: 3306, option: 'old'});
  const initialValues = iV ? iV : { host: null, username: null, password: null, port: 3306, database: null, option: 'mysql' }
  const showModal = () => {
    setDb(true);
  };
  const handleOk = () => {
    const data = form.getFieldsValue()
    setConfirmLoading(true);
    postTestUserDB(data, browsertoken).then((v) => {
      if (v.message == 'ok') {
        dbCallback(data);
        setDb(false);
        setConfirmLoading(false);
        setHadSetDB(true);
        form.setFieldsValue(initialValues)
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
      </Button> :
        <Button type='default' onClick={showModal}>
          设置数据库服务
        </Button>
      }

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
export default DbCom;