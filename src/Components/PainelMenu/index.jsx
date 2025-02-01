import { FileOutlined, TeamOutlined, UserOutlined, BorderOutlined, ShoppingCartOutlined, HomeOutlined, AppstoreAddOutlined, TagsOutlined, SettingOutlined, ShopOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from "./PainelMenu.module.css";
const { Sider } = Layout;

function getItem(label, key, icon, children, pathname) {
  return {
    key,
    icon,
    children,
    label,
    pathname
  };
}

const items = [
  getItem('Home', '1', <HomeOutlined />, null, '/home'),
  getItem('Cadastros', 'sub1', <AppstoreAddOutlined />, [
    getItem('Empresas', '2', <ShopOutlined />, null, '/cadastros/empresa'),
    getItem('Usuários', '3', <UserOutlined />, null, '/cadastros/usuarios'),
    getItem('Produtos', '4', <ShoppingCartOutlined />, null, '/cadastros/produtos'),
    getItem('Fornecedores', '5', <TagsOutlined />, null, '/cadastros/fornecedores'),
    getItem('Categorias', '6', <BorderOutlined />, null, '/cadastros/categorias'),
  ]),
  getItem('Configurações', 'sub2', <SettingOutlined />, [
    getItem('Team 1', '8', <TeamOutlined />, null, '/team1'),
  ]),
  getItem('Relatórios', '9', <FileOutlined />, null, '/relatorios'),
];

const PainelMenu = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const item = e.item;
    if (item.pathname) {
      navigate(item.pathname);
    }
  };

  const mapItems = (items) => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? mapItems(item.children) : undefined,
      onClick: () => handleClick({ item }),
    }));
  };

  return (
    <Sider className={styled.sider}>
      <Space className={styled.userData} direction="vertical">
        <Avatar size={64} icon={<UserOutlined />} />
        <p className={styled.userName}>Pedro Inácio</p>
        <p className={styled.userType}>Administrador</p>
      </Space>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={mapItems(items)} />
    </Sider>
  );
};

export default PainelMenu;
