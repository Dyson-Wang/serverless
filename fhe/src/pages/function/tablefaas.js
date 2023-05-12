import { Button, Space, Table } from 'antd';
import { RedoOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux';

import { getUserFunction } from '../../utils/axios';

const TableFaas = ({ setOpen }) => {
    const dispatch = useDispatch()
    const data = useSelector(state => state.functionState);
    const columns = [
        {
            title: '函数名称',
            dataIndex: 'faasname',
            key: 'name',
            render: (text) => <a>{text}</a>,
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
                    <a>详情</a>
                    <a>修改</a>
                </Space>
            ),
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
            <Button
                onClick={(e) => getUserFunction().then(data => dispatch({ type: 'setNewFunctionStatus', value: data }))}
                style={{
                    marginLeft: 'auto',
                    marginRight: '10px'
                }}
            >
                <RedoOutlined />
            </Button>
            <Button type='primary' onClick={() => setOpen(true)} style={{
                marginLeft: '0',
            }}>新建函数</Button>
        </div>
        <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            style={{
                height: '30vh', width: '70vw', marginLeft: 'auto', marginRight: 'auto'
            }} />
    </>
}

export default TableFaas;