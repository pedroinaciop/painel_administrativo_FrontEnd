import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import { useNavigate } from 'react-router-dom';
import styled from './ProductForm.module.css';
import AsyncSelect from 'react-select/async';
import { useForm, } from "react-hook-form";
import { useSnackbar } from 'notistack';
import Tabs from '@mui/material/Tabs';
import api from '../../services/api';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import * as React from 'react';
import { z } from 'zod';

const ProductForm = () => {
  const updateDate = new Date();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = React.useState(0);
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
      required_error: "Preço de venda é obrigatório",
      invalid_type_error: "O preço de venda deve ser maior ou igual a 0",
    }).min(0, "O preço de venda deve ser maior ou igual a R$ 0,00"),

    preco_promocional: z.number({
      required_error: "Preço promocional é obrigatório",
      invalid_type_error: "O preço promocional deve ser maior ou igual a 0",
    }).min(0, "O preço promocional deve ser maior ou igual a R$ 0,00"),

    fornecedor: z.string()
      .nonempty("Fornecedor é obrigatório"),

    estoque_alertas: z.number({
      required_error: "Estoque para alertas é obrigatório",
      invalid_type_error: "Estoque para alertas deve ser maior ou igual a 0",
    }).min(0, "Estoque para alertas deve ser maior ou igual a 0"),

    cor: z.string()
      .optional(),

    tamanho: z.string()
      .optional(),

    codigo_barras: z.string()
      .optional(),

    descricao: z.string()
      .nonempty("Descrição é obrigatória"),

    categoria: z.string()
      .nonempty("Categoria é obrigatória"),

    quantidade_embalagem: z.string()
      .nonempty("Quantidade por embalagem é obrigatória"),

    unidade_medida: z.enum(["Unidade", "Pacote", "Caixa"], {
      errorMap: () => ({ message: "Unidade de medida é obrigatória" })
    }),

    peso_liquido: z.string()
      .nonempty("Peso líquido deve ser maior ou igual a 0"),

    peso_bruto: z.string()
      .nonempty("Peso bruto deve ser maior ou igual a 0"),

    dimensoes: z.string()
      .optional(),

    registro_anvisa: z.string()
      .optional(),

    origem_produto: z.enum(["Nacional", "Importado"], {
      errorMap: () => ({ message: "Origem do produto é obrigatório" })
    }),

    localizacao_estoque: z.string()
      .optional(),

    icms: z.string()
      .optional(),

    cfop: z.string()
      .optional(),

    ncm: z.string()
      .optional(),

    cst: z.string()
      .optional(),

    imagens_produtos: z.any()
      .optional(),

    produto_ativo: z.boolean()
      .optional(),

    esterilidade: z.boolean()
      .optional(),

    frete_gratis: z.boolean()
      .optional(),
  }).refine(data => data.preco_promocional < data.preco_venda, {
    message: "O preço de venda é menor ou igual ao preço promocional",
    path: ["preco_promocional"]
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
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
    if (!selected) {
      setSelectedOptionProvider(null);
      setValue('fornecedor', '');
      return;
    }
    setSelectedOptionProvider(selected);
    console.log(selected)
    setValue('fornecedor', selected.label);
  };

  const handleChangeSelectedCategory = (selected) => {
    if (!selected) {
      setSelectedOptionCategory(null);
      setValue('categoria', '');
      return;
    }
    setSelectedOptionCategory(selected);
    console.log(selected)
    setValue('categoria', selected.label);
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

  const promiseOptions = (inputValue, path, labelField, id) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await fetchData(inputValue, path, labelField, id));
      }, 1000);
    });
  };

  const createProduct = (data) => {
    if (!selectedOptionProvider || !selectedOptionCategory) {
      enqueueSnackbar("Erro: Fornecedor ou Categoria não selecionados!", { variant: "error" });
      return;
    }

    const productData = {
      productName: data.nome_produto,
      referenceCode: data.codigo_referencia,
      price: Number(data.preco_venda) || 0,
      pricePromocional: Number(data.preco_promocional) || 0,
      provider: {
        provider_id: selectedOptionProvider.id,
        cnpj: "",
        name: selectedOptionProvider.label || "",
        updateDate: "",
        updateUser: ""
      },
      stockAlert: Number(data.estoque_alertas) || 0,
      color: data.cor || "",
      size: data.tamanho || "",
      barCodeField: data.codigo_barras || "",
      description: data.descricao || "",
      category: {
        category_id: selectedOptionCategory.id,
        categoryName: selectedOptionCategory.label || "",
        updateDate: "",
        updateUser: ""
      },
      packagingQuantity: Number(data.quantidade_embalagem) || 0,
      unity: data.unidade_medida || "",
      netWeight: Number(data.peso_liquido) || 0,
      grossWeight: Number(data.peso_bruto) || 0,
      dimension: data.dimensoes || "",
      anvisaRegister: data.registro_anvisa || "",
      origin: data.origem_produto || "",
      stockLocation: data.localizacao_estoque || "",
      icms: data.icms || "",
      cfop: data.cfop || "",
      ncm: data.ncm || "",
      cst: data.cst || "",
      image: Array.isArray(data.imagens_produtos) ? data.imagens_produtos.join(",") : "",
      active: Boolean(data.produto_ativo),
      sterility: Boolean(data.esterilidade),
      freeShipping: Boolean(data.frete_gratis),
      perishable: Boolean(data.produto_perecivel),
      updateDate: formattedDate,
      updateUser: "ADM"
    };

    console.log("Enviando JSON:", JSON.stringify(productData, null, 2));
    console.log("C" + JSON.stringify(selectedOptionCategory));
    console.log("P" + selectedOptionProvider);
      

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
            enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
          } else if (error.request) {
            enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
          } else {
            enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
          }
        } else {
          enqueueSnackbar("Erro inesperado", { variant: "error" });
        }
      });
  };


  return (
    <section className={styled.appContainer}>
      <HeaderForm title={"Novo Produto"} />
      <form onSubmit={handleSubmit(createProduct)} onKeyDown={handleKeyDown} autoComplete="off">
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
                    maxLength={60}
                    {...register('nome_produto')} />
                  {errors?.nome_produto?.message && <p className={styled.errorMessage}>{errors.nome_produto.message}</p>}
                </div>

                <div className={styled.formGroup} id={styled.referenceCodeField}>
                  <label htmlFor="codigo_referencia">Código de Referência*</label>
                  <input
                    className={errors?.codigo_referencia && (styled.inputError)}
                    id="codigo_referencia"
                    type="text"
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
                    min={0}
                    {...register('preco_venda', { valueAsNumber: true })} />
                  {errors?.preco_venda?.message && <p className={styled.errorMessage}>{errors.preco_venda.message}</p>}
                </div>

                <div className={styled.formGroup} id={styled.pricePromocionalField}>
                  <label htmlFor="preco_promocional">Preço Promocional*</label>
                  <input
                    id="preco_promocional"
                    type="number"
                    min={0}
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
                      loadOptions={(inputValue) => promiseOptions(inputValue, 'fornecedores', 'provider', 'provider_id')}
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
                    {...register('color')}
                  />
                </div>

                <div className={styled.formGroup} id={styled.sizeField}>
                  <label htmlFor="tamanho">Tamanho(s)</label>
                  <input
                    id="tamanho"
                    type="text"
                    {...register('tamanho')}
                  />
                </div>

                <div className={styled.formGroup} id={styled.barCodeField}>
                  <label htmlFor="codigo_barras">Código de Barras</label>
                  <input
                    id="codigo_barras"
                    type="number"
                    min={0}
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
                      className={errors?.fornecedor && (styled.inputError)}
                    />
                  </div>
                </div>

                <div className={styled.formGroup} id={styled.packagingQuantityField}>
                  <label htmlFor="quantidade_embalagem">Quantidade por Embalagem*</label>
                  <input
                    id="quantidade_embalagem"
                    type="number" {...register('quantidade_embalagem')}
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
                    min={0}
                    {...register('peso_liquido')}
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
                    min={0}
                    {...register('peso_bruto')}
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
                    id='icms'
                    type="text"
                    {...register('icms')} />
                </div>

                <div className={styled.formGroup} id={styled.cfopField}>
                  <label htmlFor="cfop">CFOP</label>
                  <input
                    id='cfop'
                    type="text"
                    {...register('cfop')}
                  />
                </div>

                <div className={styled.formGroup} id={styled.ncmField}>
                  <label htmlFor="ncm">NCM</label>
                  <input
                    id='ncm'
                    type="text"
                    {...register('ncm')}
                  />
                </div>

                <div className={styled.formGroup} id={styled.cstField}>
                  <label htmlFor="cst">CST</label>
                  <input
                    id='cst'
                    type="text"
                    {...register('cst')}
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
          <FooterForm />
        </Box>
      </form>
    </section>
  );
};

export default ProductForm;