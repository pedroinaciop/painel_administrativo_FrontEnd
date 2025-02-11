import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import styled from './CategoryPage.module.css';
import ProTable from '@ant-design/pro-table';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import * as XLSX from 'xlsx';

const CategoryPage = () => {
    const [keywords, setKeywords] = useState('');
    const [categories, setCategories] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const deleteCategory = (id) => {
        axios.delete(`http://localhost:8080/categorias/${id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            })
    };

    useEffect(() => {
        axios.get('http://localhost:8080/categorias', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                setCategories(response.data);
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'CATEGORIA', dataIndex: 'categoryName', sorter: true },
        { title: 'ÚLTIMA ALTERAÇÃO', dataIndex: 'updateDate', sorter: true },
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
                <Button key="deletar" href={`/cadastros/categorias/${row.id}`} onClick={() => deleteCategory(row.id)} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        if (categories.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(categories);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Usuários');
            XLSX.writeFile(wb, `categorias_${today}_${month}+${year}.xlsx`);
        } else {
            enqueueSnackbar('Nenhuma categoria cadastrada', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }
    };

    const filterData = (data, keywords) =>
        data.filter(
            (item) =>
                item.id.toString().includes(keywords.toString()) ||
                item.categoryName.toLowerCase().includes(keywords.toLowerCase()) ||
                item.updateDate.toString().includes(keywords.toString())
        );

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Categorias</h1>
                    <p>{categories.length} Categoria(s) cadastrada(s)</p>
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
                    //scroll={{ x: 1000, y: 220 }}
                    search={false}
                    bordered={false}
                    columns={columns}
                    rowKey="id"
                    params={{ keywords }}
                    request={async (params) => {
                        const filteredData = filterData(categories, params.keywords || keywords);
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

export default CategoryPage;