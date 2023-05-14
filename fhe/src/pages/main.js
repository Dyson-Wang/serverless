import { Row, Col, Statistic, Space, Card, Typography } from 'antd';
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
const { Title } = Typography;

const Main = () => {
    const navigate = useNavigate()
    const insideSpace = 50, groupSpace = 50, staticSpace = 140;
    const state = useSelector(state => state.main)
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
                        <Statistic title={<Title level={3}>命名空间</Title>} value={state.nscount} valueStyle={{ fontSize: 30 }} />
                        <Statistic title={<Title level={3}>函数</Title>} value={state.fscount} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>

                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>数据库服务次数</Title>} value={state.sqlservice} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>

            </Space>
            <Space
                direction='vertical'
                size={insideSpace}
            >
                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>HTTP GET</Title>} value={state.httpget} valueStyle={{ fontSize: 30 }} />
                        <Statistic title={<Title level={3}>HTTP POST</Title>} value={state.httppost} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>
                <Card>
                    <Space direction='horizontal' size={staticSpace}>
                        <Statistic title={<Title level={3}>Total Success</Title>} value={state.totalsc} valueStyle={{ fontSize: 30 }} />
                        <Statistic title={<Title level={3}>Total Failure</Title>} value={state.totalfail} valueStyle={{ fontSize: 30 }} />
                    </Space>
                </Card>


            </Space>

        </Space>
    );
}

export default Main;