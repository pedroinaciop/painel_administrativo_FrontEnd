import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ConfigProvider, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import ProTable from '@ant-design/pro-table';
import styled from './ProviderPage.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import api from '../../services/api'

const ProviderPage = () => {
    const [keywords, setKeywords] = useState('');
    const [providers, setProviders] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        { title: 'ID', dataIndex: 'provider_id', sorter: true },
        { title: 'CNPJ', dataIndex: 'cnpj', sorter: true },
        { title: 'NOME', dataIndex: 'provider', sorter: true },
        { title: 'ÚLTIMA ALTERAÇÃO', dataIndex: 'updateDate', sorter: true },
        {
            title: 'EDITAR',
            render: (_, row) => (
                <Button key="editar" href={`/cadastros/fornecedores/${row.provider_id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/fornecedores/${row.provider_id}`} onClick={(e) => e.preventDefault(confirmDelete(row.provider_id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const deleteProvider = (provider_id) => {
        api.delete(`http://localhost:8080/fornecedores/${provider_id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            })
    }

    const confirmDelete = (provider_id) => {
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja excluir esse fornecedor?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => deleteProvider(provider_id)
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
        api.get('http://localhost:8080/fornecedores', {
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
                item.provider_id.toString().includes(keywords.toString()) ||
                item.cnpj.toLowerCase().includes(keywords.toLowerCase()) ||
                item.provider.toLowerCase().includes(keywords.toLowerCase()) || 
                item.updateDate.toString().includes(keywords.toString())
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
                    rowKey="provider_id"
                    size="large"
                    search={false}
                    bordered={false}
                    columns={columns}
                    params={{ keywords }}
                    dataSource={providers}
                    request={async (params) => {
                        const filteredData = filterData(providers, params.keywords || keywords);
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

export default ProviderPage;