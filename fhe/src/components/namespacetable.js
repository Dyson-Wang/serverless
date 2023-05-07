import { Space, Table, Tag } from 'antd';
import instance from '../utils/axios';
import { useState, useEffect } from 'react';

const NamespaceTable = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        instance.get('/funclist')
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));

    }, [])
    const columns = [
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
        }
    ];
    return <Table columns={columns} dataSource={data} style={{ height: '30vh', width: '70vw' }} />
}

export default NamespaceTable;