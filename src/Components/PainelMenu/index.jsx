import { FileOutlined, UserOutlined, HomeOutlined, AppstoreAddOutlined, SnippetsOutlined } from '@ant-design/icons';
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
    getItem('Empresas', '2', null, null, '/cadastros/empresas'),
    getItem('Usuários', '3', null, null, '/cadastros/usuarios'),
    getItem('Produtos', '4', null, null, '/cadastros/produtos'),
    getItem('Fornecedores', '5', null, null, '/cadastros/fornecedores'),
    getItem('Categorias', '6', null, null, '/cadastros/categorias'),
    getItem('Cidades', '7', null, null, '/cadastros/cidades'),
  ]),
  getItem('Operações', '9', <SnippetsOutlined />, [
    getItem('Entrada de produto', '10', null, null, '/cadastros/entrada'),
  ]),
  getItem('Relatórios', '11', <FileOutlined />, [
    getItem('Movimentação de material', '12', null, null, '/cadastros/entrada'),
  ]),
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
