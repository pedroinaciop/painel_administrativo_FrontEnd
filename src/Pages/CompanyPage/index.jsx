import styled from './CompanyPage.module.css';
import { useForm } from "react-hook-form";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';
import InputField from '../../Components/InputField';
import TextAreaField from '../../Components/TextAreaField';

const ProductForm = () => {
  const [value, setValue] = React.useState(0);
  const {register, handleSubmit, formState: { errors }, trigger, watch} = useForm();
  const formData = watch();
  
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel"
        hidden={value !== index} 
        id={`simple-tabpanel-${index}`} 
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{ display: value === index ? 'block' : 'none' }} // Esconde com CSS
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (isValid) {
      console.log("Formulário enviado com sucesso:", data);
    } else {
      console.log("Há erros no formulário.");
    }
  };

  console.log(errors);

  return (
    <section className={styled.appContainer}>

      <header className={styled.header}>
        <h1>Empresa</h1>
        <p>Campos com (*) são obrigatórios</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className={styled.form}>
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
                <InputField idInput="nome_produto"
                  idDiv={styled.nameField} 
                  label="Nome do Produto*" 
                  type="text" 
                  register={register} 
                  validation={{ required: 'Campo obrigatório' }} 
                  error={errors.nome_produto} 
                />

                <InputField
                  idInput="codigo_referencia" 
                  idDiv={styled.referenceCodeField} 
                  label="Código de Referência*" 
                  type="text" 
                  register={register} 
                  validation={{ required: 'Campo obrigatório' }} 
                  error={errors.codigo_referencia} 
                />
              </div>

              <div className={styled.row}>
                <InputField 
                  idInput="preco_venda" 
                  idDiv={styled.priceField} 
                  label="Preço de Venda*" 
                  type="number" 
                  min={0} 
                  register={register} validation={{ required: 'Campo obrigatório' }} error={errors.preco_venda} 
                />

                <InputField 
                  idInput="preco_promocional" 
                  idDiv={styled.pricePromocionalField} 
                  label="Preço Promocional" 
                  type="number" 
                  min={0} 
                  register={register}
                />

                <InputField 
                  idInput="marca" 
                  idDiv={styled.brandField} 
                  label="Marca*" 
                  type="text" 
                  register={register} 
                  validation={{ required: 'Campo obrigatório' }} 
                  error={errors.marca}  
                />
              </div>

              <div className={styled.row}>
                <InputField  
                  idInput="estoque_alertas"  
                  idDiv={styled.stockAlertField} 
                  label="Estoque p/ Alertas"  
                  type="number"  
                  min={0} 
                  register={register}
                />

                <InputField  
                  idInput="color"  
                  idDiv={styled.colorField}  
                  label="Cor(es)"  
                  type="text" 
                  register={register}
                />

                <InputField  
                  idInput="tamanho"  
                  idDiv={styled.sizeField} 
                  label="Tamanho(s)"  
                  type="text" 
                  register={register}
                />


                <InputField  
                  idInput="codigo_barras"  
                  idDiv={styled.barCodeField}  
                  label="Código de Barras" 
                  type="number" 
                  min={0}
                  register={register}
                />
              </div>

              <TextAreaField 
                idInput="descricao" 
                idDiv={styled.descriptionField} 
                label="Descrição do Produto*" 
                type="textarea"
                register={register} 
                validation={{ required: 'Campo obrigatório' }} 
                error={errors.descricao} 
              />
            </section>

          </CustomTabPanel>

          <CustomTabPanel className={styled.contextForm} value={value} index={1}>
            <section className={styled.tabs}>
              <div className={styled.row}>
                <InputField 
                  idInput="categoria" 
                  idDiv={styled.categoryField} 
                  label="Categoria*" 
                  type="text" 
                  register={register} 
                  validation={{ required: 'Campo obrigatório' }} 
                  error={errors.categoria} 
                />

                <InputField 
                  idInput="subcategoria" 
                  idDiv={styled.subCategoryField} 
                  label="Subcategoria" 
                  type="text" 
                  register={register}
                />

                <InputField 
                  idInput="localizacao_estoque" 
                  idDiv={styled.stockLocationField} 
                  label="Localização no estoque" 
                  type="text" 
                  register={register}
                />
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

                <InputField 
                  idInput="peso_liquido" 
                  idDiv={styled.netWeight} 
                  label="Peso Líquido(Kg)*" 
                  type="number" 
                  min={0} 
                  register={register} 
                  validation={{ required: 'Campo obrigatório' }} 
                  error={errors.pesoLiquido} 
                />

                <InputField 
                  idInput="peso_bruto" 
                  idDiv={styled.grossWeight} 
                  label="Peso Bruto(Kg)*" 
                  type="number" 
                  min={0} 
                  register={register} 
                  validation={{ required: 'Campo obrigatório' }} 
                  error={errors.pesoBruto} 
                />

                <InputField 
                  idInput="dimensoes" 
                  idDiv={styled.dimensionField} 
                  label="Dimensões" 
                  type="text" 
                  placeholder="C x L x A"
                  register={register}
                />
              </div>

              <div className={styled.row}>
                
                <InputField 
                  idInput="registro_anvisa" 
                  idDiv={styled.anvisaRegisterField} 
                  label="Registro ANVISA" 
                  type="text"
                  register={register} 
                  error={errors.registro_anvisa}
                />

                <div className={styled.formGroup} id={styled.originField}>
                  <label htmlFor="origem_produto">Origem do produto*</label>
                  <select {...register('origem_produto', {
                    validate: (value) => {
                      return value !== "0";
                    }
                  })}>
                    <option id="unidade_medida" value="0">Selecione uma unidade</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Importado">Importado</option>
                  </select>
                  {errors?.unidade_medida?.type === 'validate' && (<p className={styled.errorMessage}>Esse campo é obrigatório</p>)}
                </div>
              </div>

              <div className={styled.row}>
                <InputField 
                  idInput="icms" 
                  idDiv={styled.icmsField} 
                  label="ICMS" 
                  type="text" 
                  register={register} 
                  error={errors.icms} 
                />

                <InputField 
                  idInput="cfop" 
                  idDiv={styled.cfopField} 
                  label="CFOP" 
                  type="text" 
                  register={register} 
                  error={errors.cfop}
                />

                <InputField 
                  idInput="ncm" 
                  idDiv={styled.ncmField} 
                  label="NCM" 
                  type="text"
                  register={register} 
                  error={errors.ncm} 
                />

                <InputField 
                  idInput="cst" 
                  idDiv={styled.cstField} 
                  label="CST" 
                  type="text" 
                  register={register} 
                  error={errors.cst}
                />
              </div>
            </section>
          </CustomTabPanel>

          <CustomTabPanel className={styled.contextForm} value={value} index={2}>
            <section className={styled.tabs}>
              <div className={styled.row}>
                <InputField 
                  idInput="imagens_produtos" 
                  idDiv={styled.imageField} 
                  label="Imagem do Produto" 
                  type="file" 
                  accept="image/*" 
                  register={register} 
                  error={errors.imagens_produtos}
                />

                <div id={styled.options}>
                  <InputField 
                    idInput={styled.activeField} 
                    label="Ativo" 
                    type="checkbox"
                    register={register} 
                    error={errors.produto_ativo}
                    />

                  <InputField 
                    idInput={styled.sterilityField} 
                    label="Esterilidade" 
                    type="checkbox" 
                    defaultChecked={false}
                    register={register} 
                    error={errors.esterilidade} 
                  />

                  <InputField 
                    idInput={styled.freeShippingField} 
                    label="Frete Grátis" 
                    type="checkbox" 
                    defaultChecked={false}
                    register={register} 
                    error={errors.frete_gratis}
                  />

                  <InputField 
                    idInput={styled.perishableField} 
                    label="Produto Perecível" 
                    type="checkbox"
                    defaultChecked={false}
                    register={register} 
                    error={errors.produto_perecivel} 
                  />
                </div>
              </div>
            </section>
          </CustomTabPanel>

          <button className={styled.btnRegister} type="submit">      
            Adicionar Produto
          </button>

          <button className={styled.btnRegister} type="reset">
            Limpar
          </button>
        </Box>
      </form>
    </section>
  );
};

export default ProductForm;