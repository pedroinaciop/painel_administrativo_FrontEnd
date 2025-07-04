import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import styled from './ProductsPage.module.css';
import ProTable from '@ant-design/pro-table';
import { NavLink, useNavigate } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import api from '../../services/api'

const ProductsPage = () => {
  const [keywords, setKeywords] = useState('');
  const [product, setProducts] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir esse produto?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => deleteProduct(id)
        },
        {
          label: 'Não',
          onClick: () => { }
        }
      ]
    })
  };

  const deleteProduct = (id) => {
    api.delete(`produtos/${id}`)
      .then(() => {
        window.location.reload();
        enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
      })
  }

  const columns = [
    { title: 'ID', dataIndex: 'product_id', width: 50},
    { title: 'PRODUTO', dataIndex: 'productName'},
    { title: 'CÓDIGO DE REFERÊNCIA', dataIndex: 'referenceCode', copyable: 'true'},
    { title: 'PREÇO', dataIndex: 'price', valueType: 'money'},
    { title: 'PREÇO PROMOCIONAL', dataIndex: 'pricePromocional', valueType: 'money'},
    {
      title: 'EDITAR',
      width: 140,
      render: (_, row) => (
        <Button key="editar" onClick={() => navigate(`/editar/produtos/${row.product_id}`)} icon={<EditOutlined />} >
          Editar
        </Button>
      ),
    },
    {
      title: 'DELETAR',
      width: 140,
      render: (_, row) => (
        <Button key="deletar" href={`/cadastros/produtos/${row.id}`} onClick={(e) => e.preventDefault(confirmDelete(row.product_id))} icon={<DeleteOutlined />}>
          Deletar
        </Button>
      ),
    },
  ];

  const handleDownload = () => {
    if (product.length > 0) {
      const today = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const ws = XLSX.utils.json_to_sheet(product);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Fornecedores');
      XLSX.writeFile(wb, `empresas_${today}_${month}_${year}.xlsx`);
    } else {
      enqueueSnackbar('Nenhuma empresa cadastrado', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
    }
  };

  useEffect(() => {
    api.get('produtos', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [])

  const filterData = (data, keywords) => {
    if (!keywords) return data;
    
    return data.filter((item) =>
       item.productName?.toLowerCase().includes(keywords.toLowerCase()) ||
        item.referenceCode?.toLowerCase().includes(keywords.toLowerCase()) 
    );
  };  

  return (
    <>
      <section className={styled.mainContent}>
        <header className={styled.header}>
          <h1>Produtos</h1>
          <p>{product.length} Produto(s) cadastrado(s)</p>
        </header>
        <div className={styled.functions}>
          <Input.Search className={styled.input} placeholder="Procure um Produto" onSearch={(value) => setKeywords(value)} />
          <div className={styled.buttons}>
            <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
              Baixar Dados
            </Button>
            <NavLink to={"novo"}>
              <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                Produto
              </Button>
            </NavLink>
          </div>
        </div>
        <article className={styled.stockInfo}>
          <div>
            <p className={styled.values}>R$ 893.512,99</p>
            <p className={styled.description}>Valor em estoque</p>
          </div>
          <div>
            <p className={styled.values}>R$ 1.253.512,99</p>
            <p className={styled.description}>Lucro previsto</p>
          </div>
          <div>
            <p className={styled.values}>153</p>
            <p className={styled.description}>Estoque baixo</p>
          </div>
          <div>
            <p className={styled.values}>29</p>
            <p className={styled.description}>Sem estoque</p>
          </div>
          <div>
            <p className={styled.values}>895</p>
            <p className={styled.description}>Em estoque</p>
          </div>
        </article>
      </section>
      <ConfigProvider locale={ptBR}>
        <ProTable 
          rowKey="product_id" 
          size="large" 
          search={false} 
          bordered={false} 
          columns={columns} 
          params={{ keywords }}
          dataSource={filterData(product, keywords)}
          pagination={{
            pageSize: 8,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>
    </>
  );
}

export default ProductsPage;