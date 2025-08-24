import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import { useNavigate, useParams } from 'react-router-dom';
import styled from './ProductForm.module.css';
import AsyncSelect from 'react-select/async';
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import Tabs from '@mui/material/Tabs';
import api from '../../services/api';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { z } from 'zod';

const ProductForm = () => {
  const { id } = useParams();
  const updateDate = new Date();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const currentUser = sessionStorage.getItem("user");
  const [selectedOptionProvider, setSelectedOptionProvider] = useState(null);
  const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);
  const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

  const createProductSchema = z.object({
    nome_produto: z.string()
      .nonempty("Nome do produto é obrigatório")
      .transform(name => {
        return name.trim().split(' ').map(word => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        }).join(' ');
      }),

    codigo_referencia: z.string()
      .nonempty("Código de referência é obrigatório"),

    preco_venda: z.number({
      required_error: "Preço é obrigatório",
      invalid_type_error: "O preço deve ser maior ou igual a 0",
    }).min(0, "O preço deve ser maior ou igual a R$ 0,00"),

    preco_promocional: z.number({
      required_error: "Preço promocional é obrigatório",
      invalid_type_error: "O preço promocional deve ser maior ou igual a 0",
    }).min(0, "O preço promocional deve ser maior ou igual a R$ 0,00"),

    fornecedor: z.object({
      provider_id: z.number(),
      providerName: z.string().nonempty("Fornecedor é obrigatório"),
      cnpj: z.string().optional(),
      updateDate: z.string().default(new Date().toISOString()),
      updateUser: z.string().optional(),
    }).required(),

    estoque_alertas: z.number({
      required_error: "Estoque para alertas é obrigatório",
      invalid_type_error: "Estoque para alertas deve ser maior ou igual a 0",
    }).min(0, "Estoque para alertas deve ser maior ou igual a 0"),

    color: z.string()
      .optional(),

    tamanho: z.string()
      .optional(),

    codigo_barras: z.string()
      .optional(),

    descricao: z.string()
      .optional(),

    categoria: z.object({
      category_id: z.number(),
      categoryName: z.string().nonempty("Categoria é obrigatória"),
      updateDate: z.string().default(new Date().toISOString()),
      updateUser: z.string().optional()
    }).required(),

    quantidade_embalagem: z.number()
      .optional(),

    unidade_medida: z.enum(["Unidade", "Pacote", "Caixa"], {
      errorMap: () => ({ message: "Unidade de medida é obrigatória" })
    }),

    peso_liquido: z.number()
      .optional(),

    peso_bruto: z.number()
      .optional(),

    dimensoes: z.string()
      .optional(),

    registro_anvisa: z.string()
      .optional(),

    origem_produto: z.enum(["Nacional", "Importado"], {
      errorMap: () => ({ message: "Origem do produto é obrigatório" })
    }),

    localizacao_estoque: z.string()
      .optional(),

    icms: z.number()
      .optional(),

    cfop: z.number()
      .optional(),

    ncm: z.number()
      .optional(),

    cst: z.number()
      .optional(),

    imagens_produtos: z.any()
      .optional(),

    produto_ativo: z.boolean()
      .optional(),

    esterilidade: z.boolean()
      .optional(),

    frete_gratis: z.boolean()
      .optional(),

    produto_perecivel: z.boolean()
      .optional(),
  }).refine(data => data.preco_promocional < data.preco_venda, {
    message: "O preço de venda é menor ou igual ao preço promocional",
    path: ["preco_promocional"]
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    resolver: zodResolver(createProductSchema),
    
  });

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue); // Usando tabValue
  };

  const handleChangeSelectedProvider = (selected) => {
    const providerValue = selected ? {
      provider_id: selected.id,
      providerName: selected.label,
      cnpj: selected.cnpj || "",
      updateDate: formattedDate,
      updateUser: currentUser
    } : {
      provider_id: 0,
      providerName: "",
      cnpj: "",
      updateDate: formattedDate,
      updateUser: currentUser
    };

    setSelectedOptionProvider(selected);
    setValue('fornecedor', providerValue, { shouldValidate: true });
  };

  const handleChangeSelectedCategory = (selected) => {
    const categoryValue = selected ? {
      category_id: selected.id,
      categoryName: selected.label,
      updateDate: formattedDate,
      updateUser: currentUser
    } : {
      category_id: 0,
      categoryName: "",
      updateDate: formattedDate,
      updateUser: currentUser
    };

    setSelectedOptionCategory(selected);
    setValue('categoria', categoryValue, { shouldValidate: true });
  };

  const fetchData = async (inputValue, path, labelField, id) => {
    try {
      const response = await api.get(`${path}`);
      return response.data.map((data) => ({
        id: data[id],
        label: data[labelField]
      }));
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      return [];
    }
  };

    const promiseOptions = async (inputValue, path, labelField, id, cnpjField) => {

    const url = inputValue
      ? `http://localhost:8080/api/${path}/${encodeURIComponent(inputValue)}`
      : `http://localhost:8080/api/${path}?limit=5`;

    const response = await fetch(url);
    const data = await response.json();

    return data.map(data => ({
      id: data[id],
      label: data[labelField],
      cnpj: cnpjField ? data[cnpjField] : undefined
    }));
  };


  const createProduct = (data) => {
    const defaultUser = sessionStorage.getItem("user");

    const selectedProvider = selectedOptionProvider || {
      id: 0,
      label: "",
      cnpj: ""
    };

    const selectedCategory = selectedOptionCategory || {
      id: 0,
      label: ""
    };

    const productData = {
      productName:  data.nome_produto.toUpperCase(),
      referenceCode: data.codigo_referencia,
      price: Number(data.preco_venda) || 0,
      pricePromocional: Number(data.preco_promocional) || 0,
      
       provider: {
        provider_id: Number(selectedProvider.id) || 0,
        cnpj: selectedProvider.cnpj || "",
        providerName: selectedProvider.providerName || "",
        updateDate: formattedDate,
        updateUser: defaultUser
      },

      stockAlert: Number(data.estoque_alertas) || 0,
      color: data.color || "",
      size: data.tamanho || "",
      barCodeField: data.codigo_barras || "",
      description: data.descricao || "",
      
      category: {
        category_id: Number(selectedCategory.id) || 0,
        categoryName: selectedCategory.label || "",
        updateDate: formattedDate,
        updateUser: defaultUser
      },

      packagingQuantity: Number(data.quantidade_embalagem) || 0,
      unity: data.unidade_medida || "",
      netWeight: Number(data.peso_liquido) || 0,
      grossWeight: Number(data.peso_bruto) || 0,
      dimension: data.dimensoes || "",
      anvisaRegister: data.registro_anvisa || "",
      origin: data.origem_produto || "",
      stockLocation: data.localizacao_estoque || "",
      icms: data.icms || 0,
      cfop: data.cfop || 0,
      ncm: data.ncm || 0,
      cst: data.cst || 0,
      image: Array.isArray(data.imagens_produtos) ? data.imagens_produtos.join(",") : "",
      active: Boolean(data.produto_ativo),
      sterility: Boolean(data.esterilidade),
      freeShipping: Boolean(data.frete_gratis),
      perishable: Boolean(data.produto_perecivel),
      createDate: formattedDate,
      createUser: sessionStorage.getItem("user"),
    };
    console.log("Produto que será enviado:", productData);

    api.post('cadastros/produtos/novo', productData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        navigate('/cadastros/produtos');
      })
      .catch((error) => {
        if (api.isAxiosError(error)) {
          if (error.response) {
            console.error("Erro do servidor:", error.response.data);
            console.error("Status:", error.response.status);
            enqueueSnackbar(`Erro ${error.response.status}: ${JSON.stringify(error.response.data)}`, { variant: "error" });
          } else if (error.request) {
            console.error("Sem resposta do servidor:", error.request);
            enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning" });
          } else {
            console.error("Erro na configuração da requisição:", error.message);
            enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error" });
          }
        } else {
          console.error("Erro inesperado:", error);
          enqueueSnackbar("Erro inesperado", { variant: "error" });
        }
      });
  };

  const editProduct = (data) => {
    const defaultUser = sessionStorage.getItem("user");
    const selectedProvider = selectedOptionProvider || {
      id: 0,
      label: "",
      cnpj: ""
    };

    const selectedCategory = selectedOptionCategory || {
      id: 0,
      label: ""
    };

    const productData = {
      productName: data.nome_produto.toUpperCase(),
      referenceCode: data.codigo_referencia,
      price: Number(data.preco_venda) || 0,
      pricePromocional: Number(data.preco_promocional) || 0,
      
       provider: {
        provider_id: Number(selectedProvider.id) || 0,
        cnpj: selectedProvider.cnpj || "",
        providerName: selectedProvider.providerName || "",
        updateDate: formattedDate,
        updateUser: defaultUser
      },

      stockAlert: Number(data.estoque_alertas) || 0,
      color: data.color || "",
      size: data.tamanho || "",
      barCodeField: data.codigo_barras || "",
      description: data.descricao || "",
      
      category: {
        category_id: Number(selectedCategory.id) || 0,
        categoryName: selectedCategory.label || "",
        updateDate: formattedDate,
        updateUser: defaultUser
      },

      packagingQuantity: Number(data.quantidade_embalagem) || 0,
      unity: data.unidade_medida || "",
      netWeight: Number(data.peso_liquido) || 0,
      grossWeight: Number(data.peso_bruto) || 0,
      dimension: data.dimensoes || "",
      anvisaRegister: data.registro_anvisa || "",
      origin: data.origem_produto || "",
      stockLocation: data.localizacao_estoque || "",
      icms: data.icms || 0,
      cfop: data.cfop || "",
      ncm: data.ncm || "",
      cst: data.cst || "",
      image: Array.isArray(data.imagens_produtos) ? data.imagens_produtos.join(",") : "",
      active: Boolean(data.produto_ativo),
      sterility: Boolean(data.esterilidade),
      freeShipping: Boolean(data.frete_gratis),
      perishable: Boolean(data.produto_perecivel),
      updateDate: formattedDate,
      updateUser: sessionStorage.getItem("user")
    };

    api.put(`/editar/produtos/${id}`, productData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function () {
        enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        navigate('/cadastros/produtos');
      }).catch(function (error) {
        if (api.isAxiosError(error)) {
          if (error.response) {
            enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
          } else if (error.request) {
            enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
          } else {
            enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
          }
        } else {
          enqueueSnackbar("Erro inesperado", { variant: "error" });
        }
      })
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`editar/produtos/${id}`)
        .then(response => {
          const product = response.data;
          const currentUser = sessionStorage.getItem("user");
          console.log(product);
          
          if (product.provider) {
            const provider = {
              id: product.provider.provider_id,
              label: product.provider.providerName, 
              cnpj: product.provider.cnpj || ""
            };
            
            setSelectedOptionProvider(provider);
            setValue('provider', {
              provider_id: provider.id,
              providerName: provider.label,
              cnpj: provider.cnpj,
              updateDate: product.provider.updateDate || formattedDate,
              updateUser: product.provider.updateUser || currentUser
            }, { shouldValidate: true });
          }
          
          if (product.category) {
            const category = {
              id: product.category.category_id,
              label: product.category.categoryName
            };
            
            setSelectedOptionCategory(category);
            setValue('category', {
              category_id: category.id,
              categoryName: category.label,
              updateDate: product.category.updateDate || formattedDate,
              updateUser: product.category.updateUser || currentUser
            }, { shouldValidate: true });
          }
          
          reset({
            nome_produto: product.productName || "",
            codigo_referencia: product.referenceCode || "",
            preco_venda: product.price || 0,
            preco_promocional: product.pricePromocional || 0,
            estoque_alertas: product.stockAlert || 0,
            color: product.color || "",
            tamanho: product.size || "",
            codigo_barras: product.barCodeField || "",
            descricao: product.description || "",
            quantidade_embalagem: product.packagingQuantity || 0,
            unidade_medida: product.unity || "Unidade", 
            peso_liquido: product.netWeight || 0,
            peso_bruto: product.grossWeight || 0,
            dimensoes: product.dimension || "",
            registro_anvisa: product.anvisaRegister || "",
            origem_produto: product.origin || "Nacional", 
            localizacao_estoque: product.stockLocation || "",
            icms: product.icms || 0,
            cfop: product.cfop || 0,
            ncm: product.ncm || 0,
            cst: product.cst || 0,
            produto_ativo: product.active,
            esterilidade: product.sterility ?? false,
            frete_gratis: product.freeShipping ?? false,
            produto_perecivel: product.perishable ?? false,
            updateUser: product.updateUser,
            updateDate: product.updateDate,
            createUser: product.createUser,
            createDate: product.createDate,
            fornecedor: {
              provider_id: product.provider.provider_id,
              providerName: product.provider.providerName,
              cnpj: product.provider.cnpj,
              updateDate: product.provider.updateDate || formattedDate,
              updateUser: product.provider.updateUser || currentUser
            },
            categoria: {
              category_id: product.category.category_id,
              categoryName: product.category.categoryName,
              updateDate: product.category.updateDate || formattedDate,
              updateUser: product.category.updateUser || currentUser
            }
          });
        })
        .catch(error => {
          console.error("Erro ao carregar produto:", error);
          enqueueSnackbar("Erro ao carregar dados do produto", { variant: "error" });
        })
        .finally(() => setLoading(false));
    }
  }, [id, reset, setValue, enqueueSnackbar]);

  const updateDateField = watch("updateDate");
  const updateUserField = watch("updateUser");
  const createUserField = watch("createUser");
  const createDateField = watch("createDate");

  return (
    <section className={styled.appContainer}>
      <HeaderForm title={id ? "Editar Produto" : "Novo Produto"} />
      <form onSubmit={id ? handleSubmit(editProduct) : handleSubmit(createProduct)} onKeyDown={handleKeyDown} autoComplete="off">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange} aria-label="nav tabs example">
              <Tab label="Informações Principais" {...a11yProps(0)} />
              <Tab label="Especificações do Produto" {...a11yProps(1)} />
              <Tab label=" Imagem e outros" {...a11yProps(2)} />
            </Tabs>
          </Box>

        <CustomTabPanel className={styled.contextForm} value={tabValue} index={0}>
            <section className={styled.tabs}>
              <div className={styled.row}>
                
                <div className={styled.formGroup} id={styled.nameField}>
                  <label htmlFor="nome_produto">Nome do Produto*</label>
                  <input
                    className={errors?.nome_produto && (styled.inputError)}
                    id="nome_produto"
                    type="text"
                    maxLength={80}
                    {...register('nome_produto')} />
                  {errors?.nome_produto?.message && <p className={styled.errorMessage}>{errors.nome_produto.message}</p>}
                </div>

            <div className={styled.formGroup} id={styled.referenceCodeField}>
              <label htmlFor="codigo_referencia">Código de Referência*</label>
              <input
                className={errors?.codigo_referencia && (styled.inputError)}
                id="codigo_referencia"
                type="text"
                readOnly={id ? true : false}
                maxLength={50}
                {...register('codigo_referencia')} />
              {errors?.codigo_referencia?.message && <p className={styled.errorMessage}>{errors.codigo_referencia.message}</p>}
            </div>
          </div>

          <div className={styled.row}>
            <div className={styled.formGroup} id={styled.priceField}>
              <label htmlFor="preco_venda">Preço de Venda*</label>
              <input
                className={errors?.preco_venda && (styled.inputError)}
                id="preco_venda"
                type="number"
                step="0.01"
                min="0.01"
               {...register('preco_venda', {valueAsNumber: true})} />
              {errors?.preco_venda?.message && <p className={styled.errorMessage}>{errors.preco_venda.message}</p>}
            </div>

            <div className={styled.formGroup} id={styled.pricePromocionalField}>
              <label htmlFor="preco_promocional">Preço Promocional*</label>
              <input
                id="preco_promocional"
                type="number"
                step="0.01"
                min="0.01"
                {...register('preco_promocional', { valueAsNumber: true })}
              />
              {errors?.preco_promocional?.message && <p className={styled.errorMessage}>{errors.preco_promocional.message}</p>}
            </div>

            <div className={styled.formGroup} id={styled.brandField}>
              <label htmlFor="fornecedor">Fornecedor*</label>
              <div>
                <AsyncSelect
                  id="fornecedor"
                  cacheOptions
                  defaultOptions
                  value={selectedOptionProvider}
                  loadOptions={(inputValue) => promiseOptions(inputValue, 'fornecedores', 'providerName', 'provider_id', 'cnpj')}
                  onChange={handleChangeSelectedProvider}
                  placeholder="Digite para buscar o fornecedor..."
                  className={errors?.fornecedor && (styled.inputError)}
                />
              </div>
            </div>
          </div>

          <div className={styled.row}>
            <div className={styled.formGroup} id={styled.stockAlertField}>
              <label htmlFor="estoque_alertas">Estoque para Alerta*</label>
              <input
                id="estoque_alertas"
                type="number"
                min={0}
                {...register('estoque_alertas', { valueAsNumber: true })}
              />
              {errors?.estoque_alertas?.message && <p className={styled.errorMessage}>{errors.estoque_alertas.message}</p>}
            </div>

            <div className={styled.formGroup} id={styled.colorField}>
              <label htmlFor="color">Cor(es)</label>
              <input
                id="color"
                type="text"
                maxLength={50}
                {...register('color')}
              />
            </div>

            <div className={styled.formGroup} id={styled.sizeField}>
              <label htmlFor="tamanho">Tamanho(s)</label>
              <input
                id="tamanho"
                type="text"
                maxLength={50}
                {...register('tamanho')}
              />
            </div>

            <div className={styled.formGroup} id={styled.barCodeField}>
              <label htmlFor="codigo_barras">Código de Barras</label>
              <input
                id="codigo_barras"
                type="text"
                maxLength={50}
                {...register('codigo_barras')}
              />
            </div>
          </div>

          <div className={styled.formGroup} id={styled.descriptionField}>
            <label htmlFor="descricao">Descrição do Produto*</label>
            <textarea
              className={errors?.descricao && (styled.inputError)}
              id="descricao"
              type="text"
              maxLength={1500}
              {...register('descricao')}
            />
            {errors?.descricao?.message && <p className={styled.errorMessage}>{errors.descricao.message}</p>}
          </div>
        </section>
        </CustomTabPanel>

        <CustomTabPanel className={styled.contextForm} value={tabValue} index={1}>
        <section className={styled.tabs}>
          <div className={styled.row}>

            <div className={styled.formGroup} id={styled.categoryField}>
              <label htmlFor="categoria">Categoria*</label>
              <div>
                <AsyncSelect
                  id="categoria"
                  cacheOptions
                  defaultOptions
                  value={selectedOptionCategory}
                  loadOptions={(inputValue) => promiseOptions(inputValue, 'categorias', 'categoryName', 'category_id')}
                  onChange={handleChangeSelectedCategory}
                  placeholder="Digite para buscar a categoria..."
                  className={errors?.categoria && (styled.inputError)}
                />
              </div>
            </div>

            <div className={styled.formGroup} id={styled.packagingQuantityField}>
              <label htmlFor="quantidade_embalagem">Quantidade por Embalagem*</label>
              <input
                id="quantidade_embalagem"
                type="number"
                defaultValue={1}
                min={1}
                {...register('quantidade_embalagem', { valueAsNumber: true })}
              />
              {errors?.quantidade_embalagem?.message && <p className={styled.errorMessage}>{errors.quantidade_embalagem.message}</p>}
            </div>
          </div>

          <div className={styled.row}>
            <div className={styled.formGroup} id={styled.unitField}>
              <label htmlFor="unidade_medida">Unidade de Medida*</label>
              <select {...register('unidade_medida', {
                validate: (value) => {
                  return value !== "0";
                }
              })}>
                <option id="unidade_medida" value="">Selecione uma unidade</option>
                <option value="Unidade">Unidade</option>
                <option value="Pacote">Pacote</option>
                <option value="Caixa">Caixa</option>
              </select>
              {errors?.unidade_medida?.message && (<p className={styled.errorMessage}>{errors.unidade_medida.message}</p>)}
            </div>

            <div className={styled.formGroup} id={styled.netWeight}>
              <label htmlFor="peso_liquido">Peso Líquido*</label>
              <input
                className={errors?.peso && (styled.inputError)}
                id="peso_liquido"
                type="number"
                defaultValue={1}
                min={0}
                {...register('peso_liquido', { valueAsNumber: true })}
              />
              {errors?.peso_liquido?.message === 'Required'
                ? <p className={styled.errorMessage}>Peso líquido é obrigatório</p>
                : <p className={styled.errorMessage}>{errors?.peso_liquido?.message}</p>}
            </div>

            <div className={styled.formGroup} id={styled.grossWeight}>
              <label htmlFor="peso_bruto">Peso Bruto*</label>
              <input
                className={errors?.peso && (styled.inputError)}
                id="peso_bruto"
                type="number"
                defaultValue={1}
                min={0}
                {...register('peso_bruto', { valueAsNumber: true })}
              />
              {errors?.peso_bruto?.message === 'Required'
                ? <p className={styled.errorMessage}>Peso bruto é obrigatório</p>
                : <p className={styled.errorMessage}>{errors?.peso_bruto?.message}</p>}
            </div>

            <div className={styled.formGroup} id={styled.dimensionField}>
              <label htmlFor="dimensoes">Dimensões</label>
              <input
                id="dimensoes"
                type="text"
                placeholder="C x L x A"
                {...register('dimensoes')}
              />
            </div>
          </div>

          <div className={styled.row}>
            <div className={styled.formGroup} id={styled.anvisaRegisterField}>
              <label htmlFor="registro_anvisa">Registro ANVISA</label>
              <input
                id="registro_anvisa"
                type="text"
                {...register('registro_anvisa')} />
            </div>

            <div className={styled.formGroup} id={styled.originField}>
              <label htmlFor="origem_produto">Origem do produto*</label>
              <select {...register('origem_produto')}>
                <option id="origem_produto" value="0">Selecione a origem do produto</option>
                <option value="Nacional">Nacional</option>
                <option value="Importado">Importado</option>
              </select>
              {errors?.origem_produto?.message && (<p className={styled.errorMessage}>{errors.origem_produto.message}</p>)}
            </div>

            <div className={styled.formGroup} id={styled.stockLocationField}>
              <label htmlFor="localizacao_estoque">Localização no estoque</label>
              <input
                id="localizacao_estoque"
                type="text" {...register('localizacao_estoque')}
              />
            </div>
          </div>

          <div className={styled.row}>
            <div className={styled.formGroup} id={styled.icmsField}>
              <label htmlFor="icms">ICMS</label>
              <input
                id="icms"
                type="number"
                defaultValue={0}
                min={0}
                {...register("icms", { valueAsNumber: true })} />
            </div>

            <div className={styled.formGroup} id={styled.cfopField}>
              <label htmlFor="cfop">CFOP</label>
              <input
                id="cfop"
                defaultValue={0}
                min={0}
                type="number"
                {...register("cfop", {valueAsNumber: true})}
              />
            </div>

            <div className={styled.formGroup} id={styled.ncmField}>
              <label htmlFor="ncm">NCM</label>
              <input
                id="ncm"
                type="number"
                defaultValue={0}
                {...register('ncm', {valueAsNumber: true})}
              />
            </div>

            <div className={styled.formGroup} id={styled.cstField}>
              <label htmlFor="cst">CST</label>
              <input
                id="cst"
                type="number"
                defaultValue={0}
                 min={0}
                {...register("cst", {valueAsNumber: true})}
              />
            </div>
          </div>
        </section>
        </CustomTabPanel>

        <CustomTabPanel className={styled.contextForm} value={tabValue} index={2}>
        <section className={styled.tabs}>
          <div className={styled.row}>
            <div className={styled.formGroup} id={styled.imageField}>
              <label>Imagem do Produto</label>
              <input
                type="file"
                accept="image/*"
                {...register('imagens_produtos')}
              />
            </div>

            <div id={styled.options}>
              <div className={styled.formGroup}>
                <label htmlFor="produto_ativo">Ativo</label>
                <input
                  type='checkbox'
                  defaultChecked
                  id={styled.activeField}
                  className={errors?.produto_ativo && "input-error"}
                  {...register('produto_ativo')}
                />
              </div>

              <div className={styled.formGroup} >
                <label htmlFor='esterilidade'>Esterilidade</label>
                <input
                  defaultChecked={false}
                  type='checkbox'
                  id={styled.sterilityField} className={errors?.esterilidade && "input-error"}
                  {...register('esterilidade')}
                />
              </div>

              <div className={styled.formGroup}>
                <label htmlFor='frete_gratis'>Frete Grátis</label>
                <input
                  defaultChecked={false}
                  type='checkbox'
                  id={styled.freeShippingField}
                  className={errors?.frete_gratis && "input-error"}
                  {...register('frete_gratis')}
                />
              </div>

              <div className={styled.formGroup}>
                <label htmlFor='produto_perecivel'>Produto Perecível</label>
                <input
                  defaultChecked={false}
                  type='checkbox'
                  id={styled.perishableField}
                  className={errors?.frete_gratis && "input-error"}
                  {...register('produto_perecivel')}
                />
              </div>
            </div>
          </div>
        </section>
        </CustomTabPanel>
        <FooterForm title={id ? "Atualizar" : "Adicionar"} updateDateField={updateDateField} updateUserField={updateUserField} createDateField={createDateField} createUserField={createUserField}/>
        </Box>
      </form>
    </section>
  );
};

export default ProductForm;