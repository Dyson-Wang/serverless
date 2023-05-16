import { Button, Table } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'
import { getUserNamespace } from '../../utils/axios';

const NamespaceTable = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const data = useSelector(state => state.namespaceState);
    const browsertoken = useSelector(state => state.browsertoken)
    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'ns',
            render: (text) => <Link to={`/namespace/${text}`}>{text}</Link>,

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
    return <>
        <div style={{
            display: 'flex',
            width: '70vw',
            marginLeft: 'auto',
            marginRight: 'auto',
            // marginTop: 100,
            marginBottom: 20
        }}>
            <Button
                onClick={(e) => getUserNamespace(browsertoken).then(data => dispatch({ type: 'setNewNamespaceStatus', value: data }))}
                style={{
                    marginLeft: 'auto',
                    marginRight: '10px'
                }}
            >
                <RedoOutlined />
            </Button>
            <Button type='primary' onClick={() => navigate('/namespace/new')} style={{
                width: 150,
            }}>新建命名空间</Button>
        </div>
        <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            style={{
                // height: '30vh',
                width: '70vw',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}
            pagination={{ pageSize: 10 }}
        />
    </>
}

export default NamespaceTable;