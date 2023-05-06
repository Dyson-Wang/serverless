import { Button, Input, Select, Space } from 'antd';

const { Search } = Input;

const InputFaas = () => (
    <Space direction="vertical" size="middle">
        <Input placeholder="userid" />
        <Input placeholder="namespace" />
        <Input placeholder="method" />
        <Input placeholder="objscan" />
        <Input placeholder="comment" />
        <Input placeholder="maxruntime" />
        <Space.Compact
            style={{
                width: '100%',
            }}
        >
            <Button type="primary">Submit</Button>
        </Space.Compact>
    </Space>
);
export default InputFaas;