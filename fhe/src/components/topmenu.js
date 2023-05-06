import {
    AppstoreOutlined,
    ContainerOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useState } from 'react';

// contextify
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

// nav frame
const items = [
    getItem('首页', '1', <PieChartOutlined />),
    getItem('命名空间', '3', <ContainerOutlined />),
    getItem('FaaS', '2', <DesktopOutlined />),
];

// main compo
const TopMenu = ({ handleMenuOnClickFunction }) => {
    // const [collapsed, setCollapsed] = useState(false);
    // const toggleCollapsed = () => {
    //     setCollapsed(!collapsed);
    // };
    return (
        <div
            style={{
                width: '100vw',
            }}
        >
            {/* <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{
                    marginBottom: 16,
                }}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button> */}
            <Menu
                defaultSelectedKeys={['1']}
                // defaultOpenKeys={['sub1']}
                onClick={handleMenuOnClickFunction}
                mode="horizontal"
                theme="dark"
                // inlineCollapsed={collapsed}
                items={items}
            />
        </div>
    );
};
export default TopMenu;