import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Space, Table } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import DbCom from './dbconfig';
import { getUserFunction } from '../../utils/axios';

const FCTable = ({ data, db, dbCallback }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const browsertoken = useSelector(state => state.browsertoken)

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
            {db ? <DbCom dbCallback={dbCallback} /> : <></>}
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

export default FCTable;