import { Space, Table, Tag } from 'antd';
import instance from '../../utils/axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import store from '../../utils/redux'

const NamespaceTable = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(store.getState().namespaceState)
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
            dataIndex: 'createtime'
        }
    ];
    return <Table columns={columns} dataSource={data} style={{ height: '30vh', width: '70vw', marginLeft: 'auto', marginRight: 'auto' }} />
}

export default NamespaceTable;