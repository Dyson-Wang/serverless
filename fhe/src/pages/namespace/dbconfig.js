import { useState } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons'

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const DbCom = () => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hadSetDB, setHadSetDB] = useState(false);
  const [db, setDb] = useState(false);
  // const [initialValues, setInitialValues] = useState({username: null, password: null, port: 3306, option: 'old'});
  const initialValues = { username: null, password: null, port: 3306, option: 'old' }
  const showModal = () => {
    setDb(true);
  };
  const handleOk = () => {
    console.log(form.getFieldsValue());
    form.setFieldsValue(initialValues)
    setConfirmLoading(true);
    setTimeout(() => {
      setDb(false);
      setConfirmLoading(false);
      setHadSetDB(true);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
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

      >
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

          <Form.Item label="Option" name="option" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value="old"> 连接已存在的数据库 </Radio>
              <Radio value="new" > 新建数据库 </Radio>
            </Radio.Group>
          </Form.Item>

        </Form>
      </Modal>
    </>
  )
};
export default DbCom;