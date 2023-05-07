import { Space, Table, Tag } from 'antd';
import instance from '../utils/axios';
import { useState, useEffect } from 'react';
import store from '../utils/redux'

const TableFaas = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(store.getState().functionState);
    }, [])
    const columns = [
        {
            title: '函数名称',
            dataIndex: 'faasName',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '调用次数',
            dataIndex: 'invokeTimes',
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
            dataIndex: 'createTime'
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
    return <Table columns={columns} dataSource={data} style={{ height: '30vh', width: '70vw' }} />
}

export default TableFaas;