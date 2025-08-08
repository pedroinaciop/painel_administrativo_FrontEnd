import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import styled from './ClientPage.module.css';
import ProTable from '@ant-design/pro-table';
import { NavLink, useNavigate } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import VMasker from 'vanilla-masker';
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import api from '../../services/api'

const ClientPage = () => {
  const [keywords, setKeywords] = useState('');
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const cnpjMask = (value) => {
      return VMasker.toPattern(value, '99.999.999/9999-99');
  };

  
  const cpfMask = (value) => {
      return VMasker.toPattern(value, '999.999.999-99');
  };

  const confirmDelete = (clientId) => {
    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir esse cliente?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => deleteClient(clientId)
        },
        {
          label: 'Não',
          onClick: () => { }
        }
      ]
    })
  };

  const deleteClient = (clientId) => {
    api.delete(`clientes/${clientId}`)
      .then(() => {
        window.location.reload();
        enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
      })
  }

  const columns = [
    { title: 'ID', dataIndex: 'clientId', width: 50},
    { title: 'NOME', dataIndex: 'fullName'},
    { title: 'TIPO CLIENTE', dataIndex: 'clientType'},
    { title: 'CPF/CNPJ', dataIndex: 'cpfCnpj', copyable: 'true', 
        render: (text) => {
        const document = text.props.children;
        if (document.length > 11) {
          return cnpjMask(document);
        } else {
          return cpfMask(document);
        }
        
    }},
    { title: 'E-MAIL', dataIndex: 'email', valueType: 'email'},
    {
      title: 'EDITAR',
      width: 140,
      render: (_, row) => (
        <Button key="editar" onClick={() => navigate(`/editar/clientes/${row.clientId}`)} icon={<EditOutlined />} >
          Editar
        </Button>
      ),
    },
    {
      title: 'DELETAR',
      width: 140,
      render: (_, row) => (
        <Button key="deletar" href={`/cadastros/clientes/${row.clientId}`} onClick={(e) => e.preventDefault(confirmDelete(row.clientId))} icon={<DeleteOutlined />}>
          Deletar
        </Button>
      ),
    },
  ];

  const handleDownload = () => {
    if (clients.length > 0) {
      const today = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const ws = XLSX.utils.json_to_sheet(clients);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Fornecedores');
      XLSX.writeFile(wb, `empresas_${today}_${month}_${year}.xlsx`);
    } else {
      enqueueSnackbar('Nenhum cliente cadastrado', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
    }
  };

  useEffect(() => {
    api.get('clientes', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [])

  const filterData = (data, keywords) => {
    if (!keywords) return data;
    
    return data.filter((item) =>
       item.clientName?.toLowerCase().includes(keywords.toLowerCase()) ||
        item.cpfCnpj?.toLowerCase().includes(keywords.toLowerCase()) 
    );
  };  

  return (
    <>
      <section className={styled.mainContent}>
        <header className={styled.header}>
          <h1>Clientes</h1>
          <p>{clients.length} Clientes(s) cadastrado(s)</p>
        </header>
        <div className={styled.functions}>
          <Input.Search className={styled.input} placeholder="Procure um cliente" onSearch={(value) => setKeywords(value)} />
          <div className={styled.buttons}>
            <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
              Baixar Dados
            </Button>
            <NavLink to={"novo"}>
              <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                Cliente
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
      <ConfigProvider locale={ptBR}>
        <ProTable 
          rowKey="client_id" 
          size="large" 
          search={false} 
          bordered={false} 
          columns={columns} 
          params={{ keywords }}
          dataSource={filterData(clients, keywords)}
          pagination={{
            pageSize: 8,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>
    </>
  );
}

export default ClientPage;