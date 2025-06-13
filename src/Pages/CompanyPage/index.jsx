import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import { confirmAlert } from 'react-confirm-alert';
import React, { useState, useEffect } from 'react';
import styled from './CompanyPage.module.css';
import ProTable from '@ant-design/pro-table';
import { NavLink, useNavigate } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import VMasker from 'vanilla-masker';
import api from '../../services/api'
import * as XLSX from 'xlsx';

const CompanyPage = () => {
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState('');
    const [company, setCompany] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const cnpjMask = (value) => {
        return VMasker.toPattern(value, '99.999.999/9999-99');
    };

    const columns = [
        { title: 'ID', dataIndex: 'company_id', width: 50},
        { title: 'CNPJ', dataIndex: 'cnpj', copyable: true, 
            render: (text) => {
            const cnpj = text.props.children;
            return cnpjMask(cnpj);
        }},
        { title: 'EMPRESA', dataIndex: 'corporateReason'},
        { title: 'ÚLTIMA ALTERAÇÃO', dataIndex: 'updateDate'},
        { title: 'USUÁRIO ALTERAÇÃO', dataIndex: 'updateUser'},
        {
            title: 'EDITAR',
            width: 140,
            render: (_, row) => (
                <Button key="editar" onClick={() => navigate(`/editar/empresas/${row.company_id}`)} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            width: 140,
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/empresas/${row.id}`} onClick={(e) => e.preventDefault(confirmDelete(row.id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja excluir essa empresa?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => deleteCompany(id)
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        })
    };

    const deleteCompany = (id) => {
        api.delete(`empresas/${id}`)
        .then(() => {
            window.location.reload();
            enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
        })
    }

    const handleDownload = () => {
        if (company.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(company);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Fornecedores');
            XLSX.writeFile(wb, `empresas_${today}_${month}_${year}.xlsx`);
        } else {
            enqueueSnackbar('Nenhuma empresa cadastrado', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }
    };

    useEffect(() => {
        api.get('/empresas', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                setCompany(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])

    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.company_id.toString().includes(keywords.toString()) ||
                item.cnpj.toLowerCase().includes(keywords.toLowerCase()) ||
                item.corporateReason.toLowerCase().includes(keywords.toLowerCase()) ||
                item.updateDate.toString().includes(keywords.toString())
        );

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Empresas</h1>
                    <p>{company.length} Empresa(s) cadastrada(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure uma Empresa"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Empresa
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <ConfigProvider locale={ptBR}>
                <ProTable
                    rowKey="company_id"
                    size="large"
                    search={false}
                    bordered={false}
                    columns={columns}
                    params={{ keywords }}
                    dataSource={company}
                    request={async (params) => {
                        const filteredData = filterData(company, params.keywords || keywords);
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

export default CompanyPage;