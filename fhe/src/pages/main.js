import { Row, Col, Statistic, Space, Card, Typography } from 'antd';
const { Title } = Typography;

const Main = () => {
    const insideSpace = 50, groupSpace = 50, staticSpace = 140

    return (
        <Space
            direction='horizontal'
            size={groupSpace}
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '50px'
            }}
        >
            <Space
                direction='vertical'
                size={insideSpace}
            >
                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>命名空间</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                        <Statistic title={<Title level={3}>函数</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>

                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>数据库服务次数</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>

            </Space>
            <Space
                direction='vertical'
                size={insideSpace}
            >
                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>HTTP GET</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                        <Statistic title={<Title level={3}>HTTP POST</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>
                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>Total Success</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                        <Statistic title={<Title level={3}>Total Failure</Title>} value={112893} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>


            </Space>

        </Space>
    );
}

export default Main;