import React, { useState } from 'react';
import { ConfigProvider, Input, Button, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import ptBR from 'antd/lib/locale/pt_BR';
import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import styled from './ProductsPage.module.css';


const ProductsPage = () => {
  const [keywords, setKeywords] = useState('');

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Confirmar exclusão?',
      content: `Tem certeza que deseja excluir o produto ID ${id}?`,
      onOk() {
        console.log(`Produto ID ${id} excluído`);
      },
    });
  };

  const columns = [
    { title: 'Produto', dataIndex: 'produto', sorter: true },
    { title: 'Categoria', dataIndex: 'categoria', sorter: true },
    { title: 'Estoque', dataIndex: 'estoque', sorter: true },
    { title: 'Preço', dataIndex: 'preco', valueType: 'money', sorter: true },
    {
      title: 'Editar',
      render: (_, row) => (
        <Button key="editar" href={`/cadastros/produtos/${row.id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
          Editar
        </Button>
      ),
    },
    {
      title: 'Deletar',
      render: (_, row) => (
        <Button key="deletar" href={`/cadastros/produtos/${row.id}`} onClick={() => confirmDelete(row.id)} icon={<DeleteOutlined />}>
          Deletar
        </Button>
      ),
    },
  ];

  const handleDownload = () => {
    const data = [
      { produto: 'Jack', categoria: 'Categoria 1', estoque: 20, preco: 100 },
      { produto: 'Pedro', categoria: 'Categoria 1', estoque: 40, preco: 60 },
    ];
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'produtos.json';
    link.click();
  };

  const mockData = [
    { id: 1, produto: 'Jack', categoria: 'Categoria 1', estoque: 20, preco: 100 },
    { id: 2, produto: 'Pedro', categoria: 'Categoria 1', estoque: 40, preco: 60 },
    { id: 3, produto: 'Ana', categoria: 'Categoria 2', estoque: 15, preco: 80 },
  ];

  const filterData = (data, keywords) =>
    data.filter(
      (item) =>
        item.produto.toLowerCase().includes(keywords.toLowerCase()) ||
        item.categoria.toLowerCase().includes(keywords.toLowerCase())
    );

  return (
    <>
      <section className={styled.mainContent}>
        <header className={styled.header}>
          <h1>Produtos</h1>
          <p>{mockData.length} itens cadastrados</p>
        </header>
        <div className={styled.functions}>
          <Input.Search className={styled.input} placeholder="Procure um produto" onSearch={(value) => setKeywords(value)} />
          <div className={styled.buttons}>
            <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
              Baixar Dados
            </Button>
            <NavLink to={"novo"}>
              <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                Produto
              </Button>
            </NavLink>
          </div>
        </div>
        <article className={styled.stockInfo}>
          <div>
            <p className={styled.values}>R$ 893.512,99</p>
            <p className={styled.description}>Valor em estoque</p>
          </div>
          <div>
            <p className={styled.values}>R$ 1.253.512,99</p>
            <p className={styled.description}>Lucro previsto</p>
          </div>
          <div>
            <p className={styled.values}>153</p>
            <p className={styled.description}>Estoque baixo</p>
          </div>
          <div>
            <p className={styled.values}>29</p>
            <p className={styled.description}>Sem estoque</p>
          </div>
          <div>
            <p className={styled.values}>895</p>
            <p className={styled.description}>Em estoque</p>
          </div>
        </article>
      </section>
      <ConfigProvider locale={ptBR}>
        <ProTable size="large" scroll={{ x: 1000, y: 220 }}
          search={false} bordered={false} columns={columns} rowKey="id" params={{ keywords }}
          request={async (params) => {
            const filteredData = filterData(mockData, params.keywords || keywords);
            return { data: filteredData, success: true };
          }}
          pagination={{
            pageSize: 8,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>
    </>
  );
}

export default ProductsPage;