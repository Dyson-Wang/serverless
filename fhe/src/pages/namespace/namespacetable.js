import { Button, Table } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNamespace } from '../../utils/axios';

const NamespaceTable = ({ setOpen }) => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.namespaceState);
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
    return <>
        <div style={{
            display: 'flex',
            marginTop: 100,
            marginBottom: 50
        }}>
            <Button
                onClick={(e) => getUserNamespace().then(data => dispatch({ type: 'setNewNamespaceStatus', value: data }))}
                style={{
                    marginLeft: 'auto',
                    marginRight: '10px'
                }}
            >
                <RedoOutlined />
            </Button>
            <Button type='primary' onClick={() => setOpen(true)} style={{
                width: 150,
                marginRight: '15vw'
            }}>新建命名空间</Button>
        </div>
        <Table
            columns={columns}
            dataSource={data}
            style={{
                height: '30vh',
                width: '70vw',
                marginLeft: 'auto',
                marginRight: 'auto'
            }} />
    </>
}

export default NamespaceTable;