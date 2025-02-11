import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ConfigProvider, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import ProTable from '@ant-design/pro-table';
import styled from './Provider.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ProviderPage = () => {
    const [keywords, setKeywords] = useState('');
    const [providers, setProviders] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'CNPJ', dataIndex: 'cnpj', sorter: true },
        { title: 'NOME', dataIndex: 'provider', sorter: true },
        { title: 'ÚLTIMA ALTERAÇÃO', dataIndex: 'updateDate', sorter: true },
        {
            title: 'EDITAR',
            render: (_, row) => (
                <Button key="editar" href={`/cadastros/fornecedores/${row.id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/fornecedores/${row.id}`} onClick={(e) => e.preventDefault(confirmDelete(row.id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const deleteProvider = (id) => {
        axios.delete(`http://localhost:8080/fornecedores/${id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            })
    }

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja excluir esse fornecedor?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => deleteProvider(id)
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        })

    };

    const handleDownload = () => {
        if (providers.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(providers);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Fornecedores');
            XLSX.writeFile(wb, `fornecedores_${today}_${month}_${year}.xlsx`);
        } else {
            enqueueSnackbar('Nenhum fornecedor cadastrado', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }
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
                        showTotal: (total) => `Total de ${total} itens`,
                        hideOnSinglePage: false,
                    }}
                />
            </ConfigProvider>
        </>
    );
}

export default ProviderPage;