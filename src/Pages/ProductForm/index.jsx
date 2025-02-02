import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import styled from './ProductForm.module.css';
import { useForm } from "react-hook-form";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';

const ProductForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [value, setValue] = React.useState(0);

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
    setValue(newValue);
  };

  const createProduct = (data) => {
    console.log(data);
    reset();
  };

  console.log(errors);

  return (
    <section className={styled.appContainer}>

      <HeaderForm title={"Novo Produto"} />

      <form onSubmit={handleSubmit(createProduct)} onKeyDown={handleKeyDown}  autocomplete="off">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
              <Tab label="Informações Principais" {...a11yProps(0)} />
              <Tab label="Especificações do Produto" {...a11yProps(1)} />
              <Tab label=" Imagem e outros" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <CustomTabPanel className={styled.contextForm} value={value} index={0}>
            <section className={styled.tabs}>
              <div className={styled.row}>

                <div className={styled.formGroup} id={styled.nameField}>
                  <label htmlFor="nome_produto">Nome do Produto*</label>
                  <input
                    autoFocus
                    className={errors?.nome_produto && (styled.inputError)}
                    id="nome_produto"
                    type="text"
                    maxLength={60}
                    {...register('nome_produto', { required: true })} />
                  {errors?.nome_produto?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
                </div>

                <div className={styled.formGroup} id={styled.referenceCodeField}>
                  <label htmlFor="codigo_referencia">Código de Referência*</label>
                  <input
                    className={errors?.codigo_referencia && (styled.inputError)}
                    id="codigo_referencia"
                    type="text"
                    {...register('codigo_referencia', { required: true })} />
                  {errors?.codigo_referencia?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
                </div>
              </div>

              <div className={styled.row}>
                <div className={styled.formGroup}>
                  <label htmlFor="preco_venda">Preço de Venda*</label>
                  <input
                    className={errors?.preco_venda && (styled.inputError)}
                    id="preco_venda" type="number"
                    min={0}
                    {...register('preco_venda', { required: true })} />
                  {errors?.preco_venda?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
                </div>

                <div className={styled.formGroup} id={styled.pricePromocionalField}>
                  <label htmlFor="preco_promocional">Preço Promocional</label>
                  <input
                    id="preco_promocional"
                    type="number"
                    min={0}
                    {...register('preco_promocional')}
                  />
                </div>

                <div className={styled.formGroup} id={styled.brandField}>
                  <label htmlFor="marca">Marca*</label>
                  <input
                    className={errors?.marca && (styled.inputError)}
                    id="marca"
                    type="text"
                    {...register('marca', { required: true })}
                  />
                  {errors?.marca?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
                </div>
              </div>

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.stockAlertField}>
                  <label htmlFor="estoque_alertas">Estoque para Alerta</label>
                  <input
                    id="estoque_alertas"
                    type="number"
                    min={0}
                    {...register('estoque_alertas')}
                  />
                </div>

                <div className={styled.formGroup} id={styled.colorField}>
                  <label htmlFor="color">Cor(es)</label>
                  <input
                    id="color"
                    type="text"
                    min={0}
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
                  {...register('descricao', { required: true })}
                />
                {errors?.descricao?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
              </div>
            </section>
          </CustomTabPanel>

          <CustomTabPanel className={styled.contextForm} value={value} index={1}>
            <section className={styled.tabs}>
              <div className={styled.row}>

                <div className={styled.formGroup} id={styled.categoryField}>
                  <label htmlFor="categoria">Categoria*</label>
                  <input
                    autoFocus
                    id="categoria"
                    className={errors?.categoria && (styled.inputError)}
                    type="text"
                    {...register('categoria', { required: true })}
                  />
                  {errors?.categoria?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
                </div>

                <div className={styled.formGroup} id={styled.packagingQuantityField}>
                  <label htmlFor="quantidade_embalagem">Quantidade por Embalagem</label>
                  <input
                    id="quantidade_embalagem"
                    type="number" {...register('quantidade_embalagem')}
                  />
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
                    <option id="unidade_medida" value="0">Selecione uma unidade</option>
                    <option value="Unidade">Unidade</option>
                    <option value="Pacote">Pacote</option>
                    <option value="Caixa">Caixa</option>
                  </select>
                  {errors?.unidade_medida?.type === 'validate' && (<p className={styled.errorMessage}>Esse campo é obrigatório</p>)}
                </div>

                <div className={styled.formGroup} id={styled.netWeight}>
                  <label htmlFor="peso_liquido">Peso Líquido*</label>
                  <input
                    className={errors?.peso && (styled.inputError)}
                    id="peso_liquido"
                    type="number"
                    min={0}
                    {...register('peso_liquido', { required: true })}
                  />
                  {errors?.peso_liquido?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
                </div>

                <div className={styled.formGroup} id={styled.grossWeight}>
                  <label htmlFor="peso_bruto">Peso Bruto*</label>
                  <input
                    className={errors?.peso && (styled.inputError)}
                    id="peso_bruto"
                    type="number"
                    min={0}
                    {...register('peso_bruto', { required: true })}
                  />
                  {errors?.peso_bruto?.type === 'required' && <p className={styled.errorMessage}>Esse campo é obrigatório</p>}
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
                  <select {...register('origem_produto', {
                    validate: (value) => {
                      return value !== "0";
                    }
                  })}>
                    <option id="origem_produto" value="0">Selecione a origem do produto</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Importado">Importado</option>
                  </select>
                  {errors?.unidade_medida?.type === 'validate' && (<p className={styled.errorMessage}>Esse campo é obrigatório</p>)}
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
                    type="icms"
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
                    type="ncm"
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

          <CustomTabPanel className={styled.contextForm} value={value} index={2}>
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
                    <label htmlFor="ativo">Ativo</label>
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
                      id={styled.freeShippingField}
                      className={errors?.frete_gratis && "input-error"}
                      {...register('produto_perecivel')}
                    />
                  </div>
                </div>
              </div>
            </section>
          </CustomTabPanel>

          <FooterForm/>

        </Box>
      </form>
    </section>
  );
};

export default ProductForm;