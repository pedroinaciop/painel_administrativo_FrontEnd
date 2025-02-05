import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import styled from './Provider.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProviderPage = () => {
    const [keywords, setKeywords] = useState('');
    const [providers, setProviders] = useState([]);

    const confirmDelete = (id) => {
        axios.delete(`http://localhost:8080/fornecedores/${id}`)
            .then(() => {
                Swal.fire({
                    title: "Drag me!",
                    icon: "success",
                    draggable: true
                });
            })
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'CNPJ', dataIndex: 'cnpj', sorter: true },
        { title: 'Nome', dataIndex: 'provider', sorter: true },
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
                <Button key="deletar" href={`/cadastros/fornecedores/${row.id}`}
                    onClick={() => confirmDelete(row.id)} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        const data = providers;
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'fornecedores.json';
        link.click();
    };

    useEffect(() => {
        axios.get('http://localhost:8080/fornecedores', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                setProviders(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])


    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.id.toString().includes(keywords.toString()) ||
                item.cnpj.toLowerCase().includes(keywords.toLowerCase()) ||
                item.provider.toLowerCase().includes(keywords.toLowerCase())
        );

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Fornecedores</h1>
                    <p>{providers.length} Fornecedor(es) cadastrado(s)</p>
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
                    size="middle"
                    //scroll={providers.length > 0 ? { x: 1000, y: 250 } : { x: 1000 }}
                    search={false}
                    bordered={false}
                    columns={columns}
                    rowKey="id"
                    params={{ keywords }}
                    request={async (params) => {
                        const filteredData = filterData(providers, params.keywords || keywords);
                        return { data: filteredData, success: true };
                    }}
                    pagination={{
                        pageSize: 8,
                        showQuickJumper: true,
                        showTotal: (total) => `Total de ${total} itens`, // Mantém o footer da paginação mesmo vazio
                        hideOnSinglePage: false, // Impede o sumiço da paginação com poucos dados
                    }}
                />
            </ConfigProvider>
        </>
    );
}

export default ProviderPage;