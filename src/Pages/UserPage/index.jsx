import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import styled from './UserPage.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPage = () => {
    const [keywords, setKeywords] = useState('');
    const [users, setUsers] = useState([]);

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Confirmar exclusão?',
            content: `Tem certeza que deseja excluir o usuario ID ${id}?`,
            onOk() {
                console.log(`Usuário ID ${id} excluído`);
            },
        });
    };
  
    useEffect(() => {
        axios.get('http://localhost:8080/fornecedores', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                setUsers(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])

    const columns = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'NOME COMPLETO', dataIndex: 'fullName', sorter: true },
        { title: 'EMAIL', dataIndex: 'email', sorter: true },
        {
            title: 'Editar',
            render: (_, row) => (
                <Button key="editar" href={`/cadastros/usuarios/${row.id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'Deletar',
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/usuarios/${row.id}`} onClick={() => confirmDelete(row.id)} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        const data = [
            { id: 1, nome: 'Pedro Inácio Penha dos Santos', email: 'inaciopedro2004@gmail.com' },
            { id: 2, nome: 'Maria Silva', email: 'mariasilva@gmail.com' },
            { id: 3, nome: 'José Carlos', email: 'josecarlos@gmail.com' },
                
        ];
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'usuarios.json';
        link.click();
    };

    const mockData = [
        { id: 1, nome: 'Pedro Inácio Penha dos Santos', email: 'inaciopedro2004@gmail.com' },
        { id: 2, nome: 'Maria Silva', email: 'mariasilva@gmail.com' },
        { id: 3, nome: 'José Carlos', email: 'josecarlos@gmail.com' },
        
    ];

    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.id.toString().includes(keywords.toString()) ||
                item.nome.toLowerCase().includes(keywords.toLowerCase()) ||
                item.email.toLowerCase().includes(keywords.toLowerCase())
        );

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Usuários</h1>
                    <p>{mockData.length} Usuário(s) cadastrado(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure um Usuário"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Usuário
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
                        pageSize: 4,
                        showQuickJumper: true,
                    }}
                />
            </ConfigProvider>
        </>
    );
}

export default UserPage;