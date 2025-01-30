import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import styled from './BrandPage.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import React, { useState } from 'react';


const BrandPage = () => {
    const [keywords, setKeywords] = useState('');

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Confirmar exclusão?',
            content: `Tem certeza que deseja excluir o fornecedor ID ${id}?`,
            onOk() {
                console.log(`Fornecedor ID ${id} excluído`);
            },
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'CNPJ', dataIndex: 'cnpj', sorter: true },
        { title: 'Nome', dataIndex: 'nome', sorter: true },
        {
            title: 'Editar',
            render: (_, row) => (
                <Button key="editar" href={`/cadastros/fornecedores/${row.id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'Deletar',
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/fornecedores/${row.id}`} onClick={() => confirmDelete(row.id)} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        const data = [
            { id: 1, cnpj: '00.000.000/0000-00', nome: 'Coca-cola' },
            { id: 2, cnpj: '00.000.000/0000-01', nome: 'Dolly' },
        ];
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'fornecedores.json';
        link.click();
    };

    const mockData = [
        { id: 1, cnpj: '00.000.000/0000-00', nome: 'Coca-cola' },
        { id: 2, cnpj: '00.000.000/0000-01', nome: 'Dolly' },
    ];

    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.id.toString().includes(keywords.toString()) ||
                item.cnpj.toLowerCase().includes(keywords.toLowerCase()) ||
                item.nome.toLowerCase().includes(keywords.toLowerCase())
        );

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Fornecedores</h1>
                    <p>{mockData.length} Fornecedor(es) cadastrado(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure um Fornecedor"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Fornecedor
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

export default BrandPage;