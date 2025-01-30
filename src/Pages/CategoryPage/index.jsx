import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button, Modal } from 'antd';
import styled from './CategoryPage.module.css';
import ProTable from '@ant-design/pro-table';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import React, { useState } from 'react';


const CategoryPage = () => {
    const [keywords, setKeywords] = useState('');

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Confirmar exclusão?',
            content: `Tem certeza que deseja excluir a categoria ID ${id}?`,
            onOk() {
                console.log(`Categoria ID ${id} excluído`);
            },
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'Categoria', dataIndex: 'categoria', sorter: true },
        {
            title: 'Editar',
            render: (_, row) => (
                <Button key="editar" href={`/cadastros/categorias/${row.id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'Deletar',
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/categorias/${row.id}`} onClick={() => confirmDelete(row.id)} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        const data = [
            { id: 1, categoria: 'Camisa' },
            { id: 2, categoria: 'Bermuda' },
        ];
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'categorias.json';
        link.click();
    };

    const mockData = [
        { id: 1, categoria: 'Camisa' },
        { id: 2, categoria: 'Bermuda' },
    ];

    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.id.toString().includes(keywords.toString()) ||
                item.categoria.toLowerCase().includes(keywords.toLowerCase())
        );

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Categorias</h1>
                    <p>{mockData.length} Categoria(s) cadastrada(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure uma Categoria"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Categoria
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <ConfigProvider locale={ptBR}>
                <ProTable
                    size="large"
                    scroll={{ x: 1000, y: 220 }}
                    search={false}
                    bordered={false}
                    columns={columns}
                    rowKey="id"
                    params={{ keywords }}
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

export default CategoryPage;