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
    getItem('命名空间', '2', <ContainerOutlined />),
    getItem('FaaS', '3', <DesktopOutlined />),
];

// main compo
const TopMenu = ({ handleMenuOnClickFunction }) => {
    return (
        <div
            style={{
                width: '100vw',
            }}
        >
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