import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { ConfigProvider, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import styled from './ProviderPage.module.css';
import ProTable from '@ant-design/pro-table';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import api from '../../services/api'
import VMasker from 'vanilla-masker';
import * as XLSX from 'xlsx';

const ProviderPage = () => {
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState('');
    const [providers, setProviders] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const cnpjMask = (value) => {
        return VMasker.toPattern(value, '99.999.999/9999-99');
    };

    const columns = [
        { title: 'ID', dataIndex: 'provider_id', width: 50,},
        { title: 'CNPJ', dataIndex: 'cnpj', copyable: true, 
            render: (text) => {
            const cnpj = text.props.children;
            return cnpjMask(cnpj);
        }},
        { title: 'NOME', dataIndex: 'provider', ellipsis: true},
        { title: 'ÚLTIMA ALTERAÇÃO', dataIndex: 'updateDate'},
        { title: 'USUÁRIO ALTERAÇÃO', dataIndex: 'updateUser', ellipsis: true},
        {
            title: 'EDITAR',
            width: 140,
            render: (_, row) => (
                <Button key="editar" onClick={() => navigate(`/editar/fornecedores/${row.provider_id}`)} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            width: 140,
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/fornecedores/${row.provider_id}`} onClick={(e) => e.preventDefault(confirmDelete(row.provider_id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const deleteProvider = (provider_id) => {
        api.delete(`fornecedores/${provider_id}`)
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
        api.get('fornecedores', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                console.log(resposta.data);
                setProviders(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])

    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.cnpj?.toLowerCase().includes(keywords.toLowerCase()) ||
                item.provider?.toLowerCase().includes(keywords.toLowerCase())
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
                    dataSource={filterData(providers, keywords)}
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