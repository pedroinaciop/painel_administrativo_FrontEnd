import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import styled from './CityPage.module.css';
import ProTable from '@ant-design/pro-table';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import api from '../../services/api'


const CityPage = () => {
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState('');
    const [cidades, setCidades] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const deleteCity = (city_id) => {
        api.delete(`cidades/${city_id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            })
    };

    const confirmDelete = (city_id) => {
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja excluir essa cidade?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => deleteCity(city_id)
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        })
    };

    useEffect(() => {
        api.get('cidades', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                console.log(response.data);
                setCidades(response.data);
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'city_id', width: 80},
        { title: 'CIDADE', dataIndex: 'cityName', ellipsis: true},
        { title: 'UF', dataIndex: 'uf', ellipsis: true},
        { title: 'CÓDIGO IBGE', dataIndex: 'ibgeCode', ellipsis: true},
        { title: 'PAÍS', dataIndex: 'countryCode', ellipsis: true},
        {
            title: 'EDITAR',
            width: 140,
            render: (_, row) => (
                <Button key="editar" 
                onClick={() => navigate(`/editar/cidades/${row.city_id}`)} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            width: 140,
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/cidades/${row.city_id}`} onClick={(e) => e.preventDefault(confirmDelete(row.city_id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        if (cidades.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(cidades);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Cidades');
            XLSX.writeFile(wb, `cidades_${today}_${month}_${year}.xlsx`);
        } else {
            enqueueSnackbar('Nenhuma cidade cadastrada', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }
    };

    const filterData = (data, keywords) => {
    if (!keywords) return data;
    
    return data.filter((item) =>
            item.cityName?.toLowerCase()?.includes(keywords.toLowerCase())
        );
    };    

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Cidades</h1>
                    <p>{cidades.length} Cidades(s) cadastrada(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure uma Cidade"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Cidade
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <ConfigProvider locale={ptBR}>
                <ProTable
                    rowKey="city_id"
                    size="large"
                    search={false}
                    bordered={false}
                    columns={columns}
                    params={{ keywords }}
                    dataSource={filterData(cidades, keywords)}
                    pagination={{
                        pageSize: 4,
                        showQuickJumper: true,
                    }}
                />
            </ConfigProvider>
        </>
    );
}

export default CityPage;
