import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import { data, useNavigate, useParams } from 'react-router-dom';
import styled from './ClientForm.module.css';
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import Tabs from '@mui/material/Tabs';
import api from '../../services/api';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { z } from 'zod';
import VMasker from 'vanilla-masker';

const ClientForm = () => {
  const { id } = useParams();
  const [tipoPessoa, setTipoPessoa] = useState('PESSOA_FISICA');
  const updateDate = new Date();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

  const createClientSchema = z.object({
    nome_cliente: z.string()
      .nonempty("Nome do cliente é obrigatório")
      .max(60, "Escreva um nome menor do que 60 caracteres")
      .transform(name => {
        return name.trim().split(' ').map(word => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        }).join(' ');
      }),

    nome_fantasia: z.string()
      .max(60, "Escreva um nome fantasia menor do que 60 caracteres"),   

    inscricao_estadual: z.string()
      .optional(),  

    inscricao_municipal: z.string()
      .optional(),

    status_imposto: z.enum(["CONTRIBUINTE_ICMS", "CONTRIBUINTE_ISENTO_ICMS", "NAO_CONTRIBUINTE"]),

    codigo_regime_tributario: z.enum(["NAO_DEFINIDO", "SIMPLES_NACIONAL", "SIMPLES_NACIONAL_EXCESSO_SUBLIMITE_RECEITA_BRUTA", "REGIME_NACIONAL", "MEI"])
    .optional(),

    tipo_cliente: z.enum(["PESSOA_FISICA", "PESSOA_JURIDICA", "ESTRANGEIRO"], {
      errorMap: () => ({ message: "Tipo do Cliente é obrigatória" })
    }).refine(val => val !== "0", {
      message: "Tipo do Cliente é obrigatório"
    }),

    cpfCnpj: z.string()
      .min(8, "CNPJ inválido")
      .nonempty("CNPJ é obrigatório"),

    rg: z.string()
      .optional(),

    email: z.string()
      .toLowerCase()
      .nonempty("O e-mail é obrigatório")
      .email('Formato de e-mail inválido'),

    telefone: z.string()
      .nonempty("Número de telefone é obrigatório"),

    telefone_secundario: z.string()
      .optional(),

    dataNascimento: z.string()
      .optional(),

    cep: z.string()
     .nonempty("CEP é obrigatório"),

    logradouro: z.string()
      .nonempty("Logradouro é obrigatório"),

    bairro: z.string()
      .nonempty("Bairro é obrigatório"),

    cidade: z.string()
      .nonempty("Cidade é obrigatório"),

    estado: z.string()
      .nonempty("Estado é obrigatório"),

    numero_endereco: z.number(),

    complemento: z.string()
      .max(80, "Escreva um complemento menor do que 80 caracteres")
      .optional(),

    country: z.string()
      .optional(),  

    codigoIbgeCidade: z.string(),

    notas: z.string()
      .max(200, "Escreva uma nota menor do que 200 caracteres")
      .optional(),

    cliente_ativo: z.boolean()
      .default(true),

    ie_isento: z.boolean()
      .default(false)
  });

  async function searchCEP(cep) {
    try {
      if (!cep) {
        setValue("logradouro", "");
        setValue("bairro", "");
        setValue("cidade", "");
        setValue("estado", "");
        setValue("codigoIbgeCidade", "")
        return;
      } else {
        const cepResult = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const resultCepConversion = await cepResult.json();

        if (resultCepConversion.erro) {
          enqueueSnackbar('CEP inválido', { variant: 'error', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }

        setValue("logradouro", resultCepConversion.logradouro);
        setValue("bairro", resultCepConversion.bairro);
        setValue("cidade", resultCepConversion.localidade);
        setValue("estado", resultCepConversion.uf);
        setValue("codigoIbgeCidade", resultCepConversion.ibge);
      }
    } catch (e) {
      enqueueSnackbar('Ocorreu um erro ao buscar o CEP', { variant: 'error', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
    }
  }

  function formattedFieldDate(data) {
    if (!data) return '';

    if (typeof data === 'string' && data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return data;
    }
    const dateObj = new Date(data);
    
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('pt-BR');
  }

  const cepMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "99999-999");
    setValue("cep", maskedValue);
  };

  const cnpjMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "99.999.999/9999-99");
    setValue("cpfCnpj", maskedValue);
  }; 


  const cpfMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "999.999.999-99");
    setValue("cpfCnpj", maskedValue);
  }; 

  const rgMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "99.999.999-9");
    setValue("rg", maskedValue);
  }; 

  const telefoneMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "(99) 99999-9999");
    setValue("telefone", maskedValue);
  }; 

  const telefoneSecundarioMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "(99) 99999-9999");
    setValue("telefone_secundario", maskedValue);
  }; 

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    resolver: zodResolver(createClientSchema),
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
    setTabValue(newValue);
  }

  const createClient = (data) => {
    const currentUser = sessionStorage.getItem("user");

    const clientData = {
      clientType: data.tipo_cliente,
      fullName: data.nome_cliente,
      fantasyName: data.nome_fantasia,
      stateRegistration: data.inscricao_estadual,
      municipalRegistration: data.inscricao_municipal,
      statusTax: data.status_imposto,
      cpfCnpj: data.cpfCnpj.replace(/\D/g, ""),
      rg: data.rg.replace(/\D/g, ""),
      email: data.email,
      phone: data.telefone.replace(/\D/g, ""),
      secondaryPhone: data.telefone_secundario.replace(/\D/g, ""),
      birthDate: formattedFieldDate(data.dataNascimento),
      cep: data.cep.replace(/\D/g, ""),
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.cidade,
      state: data.estado,
      numberAddress: data.numero_endereco,
      complement: data.complemento,
      notes: data.notas,
      exemptStateRegistration: data.ie_isento,
      taxRegimeCode: data.codigo_regime_tributario,
      ibgeCityCode: data.codigoIbgeCidade,
      active: data.cliente_ativo,
      createDate: formattedDate,
      createUser: currentUser
    }; 

    api.post('cadastros/clientes/novo', clientData, {
      headers: {
          'Content-Type': 'application/json'
        }
    })
      .then(() => {
        enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        navigate('/cadastros/clientes');

        
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

  const editClient = (data) => {
    const clientData = {
      clientType: data.tipo_cliente,
      fullName: data.nome_cliente,
      fantasyName: data.nome_fantasia,
      stateRegistration: data.inscricao_estadual,
      municipalRegistration: data.inscricao_municipal,
      statusTax: data.status_imposto,
      cpfCnpj: data.cpfCnpj,
      rg: data.rg,
      email: data.email,
      phone: data.telefone,
      secondaryPhone: data.telefone_secundario,
      gender: data.genero,
      birthDate: data.dataNascimento,
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.cidade,
      state: data.estado,
      numberAddress: data.numero_endereco,
      complement: data.complemento,
      ibgeCityCode: data.codigoIbgeCidade,
      notes: data.notas,
      exemptStateRegistration: data.ie_isento,
      taxRegimeCode: data.codigo_regime_tributario,
      active: data.cliente_ativo,
      updateDate: formattedDate,
      updateUser: sessionStorage.getItem("user")
    };

    api.put(`/editar/clientes/${id}`, clientData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function () {
        enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        navigate('/cadastros/clientes');
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

      api.get(`editar/clientes/${id}`)
        .then(response => {
          const client = response.data;
          setTipoPessoa(client.clientType);

          const cpfMask = VMasker.toPattern(client.cpfCnpj, '99.999.999-99');
          const cnpjMask = VMasker.toPattern(client.cpfCnpj, '991.999.999/9999-99');
          const rgMask = VMasker.toPattern(client.rg, '99.999.999-9');
          const cepMask = VMasker.toPattern(client.cep, '99999-999');
          const telefoneMask = VMasker.toPattern(client.phone, '(99) 99999-9999');
          const telefoneSecundarioMask = VMasker.toPattern(client.secondaryPhone, '(99) 99999-9999');
      
          reset({
            tipo_cliente: client.clientType,
            nome_cliente: client.fullName,
            nome_fantasia: client.fantasyName,
            inscricao_estadual: client.stateRegistration,
            inscricao_municipal: client.municipalRegistration,
            status_imposto: client.statusTax,
            cpfCnpj: client.clientType === 'PESSOA_FISICA' ? cpfMask : cnpjMask,
            rg: rgMask,
            email: client.email,
            telefone: telefoneMask,
            telefone_secundario: telefoneSecundarioMask,
            dataNascimento: client.birthDate,
            cep: cepMask,
            logradouro: client.street,
            bairro: client.neighborhood,
            cidade: client.city,
            estado: client.state,
            numero_endereco: client.numberAddress,
            complemento: client.complement,
            codigoIbgeCidade: client.ibgeCityCode,
            notas: client.notes,
            ie_isento: client.exemptStateRegistration,
            codigo_regime_tributario: client.taxRegimeCode,
            cliente_ativo: client.active,
            updateDate: client.updateDate,
            updateUser: client.updateUser,
            createDate: client.createDate,
            createUser: client.createUser,
          });
        })
        .catch(error => {
          console.error("Erro ao carregar cliente:", error);
          enqueueSnackbar("Erro ao carregar dados do cliente", { variant: "error" });
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
      <HeaderForm title={id ? "Editar Cliente" : "Novo Cliente"} />
      <form onSubmit={id ? handleSubmit(editClient) : handleSubmit(createClient)} onKeyDown={handleKeyDown} autoComplete="off">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange} aria-label="nav tabs example">
              <Tab label="Informações Principais" {...a11yProps(0)} />
              <Tab label="Endereço do Cliente" {...a11yProps(1)} />
              <Tab label="Dados adicionais" {...a11yProps(2)} />
              <Tab label="Opções" {...a11yProps(3)} />
            </Tabs>
          </Box>

          <CustomTabPanel className={styled.contextForm} value={tabValue} index={0}>
            <section className={styled.tabs}>
              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.nameField}>
                  <label htmlFor="nome_cliente">Nome*</label>
                  <input
                    className={errors?.nome_cliente && (styled.inputError)}
                    id="nome_cliente"
                    type="text"
                    {...register('nome_cliente')} />
                  {errors?.nome_cliente?.message && <p className={styled.errorMessage}>{errors.nome_cliente.message}</p>}
                </div>

                 <div className={styled.formGroup} id={styled.fantasyNameField}>
                  <label htmlFor="nome_fantasia">Nome Fantasia</label>
                  <input
                    className={errors?.nome_fantasia && (styled.inputError)}
                    id="nome_fantasia"
                    type="text"
                    {...register('nome_fantasia')} />
                  {errors?.nome_fantasia?.message && <p className={styled.errorMessage}>{errors.nome_fantasia.message}</p>}
                </div>
              </div>
          
              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.clientType}>
                  <label htmlFor="tipo_cliente">Tipo do Cliente*</label>
                  <select
                    {...register('tipo_cliente', {
                      validate: (value) => {
                        return value !== "0";
                      }
                    })}
                    value={tipoPessoa}
                    disabled={!!id}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTipoPessoa(value);
                      setValue('tipo_cliente', value);
                    }}
                  >
                    <option value="PESSOA_FISICA">PESSOA FÍSICA</option>
                    <option value="PESSOA_JURIDICA">PESSOA JURÍDICA</option>
                    <option value="ESTRANGEIRO">ESTRANGEIRO</option>
                  </select>
                  {errors?.tipo_cliente?.message && (<p className={styled.errorMessage}>{errors.tipo_cliente.message}</p>)}
                </div>

                {tipoPessoa === 'ESTRANGEIRO' && (
                  <div className={styled.row}>
                    <div className={styled.formGroup} id={styled.countryField}>
                      <label htmlFor="country">País</label>
                      <input
                        id="country"
                        type="text"
                        {...register('country')}
                      />
                      {errors?.country?.message && <p className={styled.errorMessage}>{errors.country.message}</p>}
                    </div>
                  </div>
                )}

                {tipoPessoa !== 'ESTRANGEIRO' && (
                  <div className={styled.formGroup} id={styled.cpfCnpjField}>
                    <label htmlFor="cpfCnpj">CPF/CNPJ*</label>
                    <input
                      className={errors?.cpfCnpj && (styled.inputError)}
                      id="cpfCnpj"
                      type="text"
                      readOnly={id ? true : false}
                      placeholder={
                          tipoPessoa === 'PESSOA_FISICA'
                            ? '___.___.___-__'
                            : '__.___.___/____-__'
                        }
                      {...register('cpfCnpj')}
                      onChange={(e) => {
                        if (tipoPessoa === 'PESSOA_FISICA') {
                            cpfMask(e);
                          } else {
                            cnpjMask(e);
                          }
                        }}
                      />
                    {errors?.cpfCnpj?.message && <p className={styled.errorMessage}>{errors.cpfCnpj.message}</p>}
                  </div>
                )}

                {tipoPessoa !== 'ESTRANGEIRO' && (
                  <div className={styled.formGroup} id={styled.taxStatus}>
                    <label htmlFor="status_imposto">Contribuinte*</label>
                    <select {...register('status_imposto', {
                      validate: (value) => {
                        return value !== "0";
                      }
                    })}>
                      <option value="CONTRIBUINTE_ICMS">1 - CONTRIBUITE ICMS</option>
                      <option value="CONTRIBUINTE_ISENTO_ICMS">2 - CONTRIBUITE ISENTO DE INSCRIÇÃO</option>
                      <option value="NAO_CONTRIBUINTE" selected>9 - NÃO CONTRIBUITE</option>
                    </select>
                    {errors?.status_imposto?.message && (<p className={styled.errorMessage}>{errors.status_imposto.message}</p>)}
                  </div>
                )}  
              </div>
                
              <div className={styled.row}>
                {tipoPessoa === 'PESSOA_JURIDICA' &&  (
                  <div className={styled.formGroup} id={styled.taxRegimeCodeField}>
                    <label htmlFor="codigo_regime_tributario">Código de Regime Tributário</label>
                    <select
                      {...register('codigo_regime_tributario', {
                        validate: (value) => {
                          return value !== "0";
                        }
                      })}
                    >
                      <option value="NAO_DEFINIDO" selected>NÃO DEFINIDO</option>
                      <option value="SIMPLES_NACIONAL">SIMPLES NACIONAL</option>
                      <option value="SIMPLES_NACIONAL_EXCESSO_SUBLIMITE_RECEITA_BRUTA">SIMPLES NACIONAL - EXCESSO DE SUBLIMITE DE RECEITA BRUTA</option>
                      <option value="REGIME_NACIONAL">REGIME NACIONAL</option>
                      <option value="MEI">MEI</option>
                    </select>
                    {errors?.codigo_regime_tributario?.message && (<p className={styled.errorMessage}>{errors.codigo_regime_tributario.message}</p>)}
                  </div>
                )}

                {tipoPessoa === 'PESSOA_JURIDICA' && (
                  <div className={styled.formGroup} id={styled.municipalRegistrationField}>
                    <label htmlFor="inscricao_municipal">Inscrição Municipal</label>
                    <input
                      className={errors?.inscricao_municipal && (styled.inputError)}
                      id="inscricao_municipal"
                      type="text"
                      {...register('inscricao_municipal')} />
                    {errors?.inscricao_municipal?.message && <p className={styled.errorMessage}>{errors.inscricao_municipal.message}</p>}
                  </div>
                )}

                {tipoPessoa !== 'ESTRANGEIRO' && (<div className={styled.formGroup} id={styled.stateRegistrationField}>
                  <label htmlFor="inscricao_estadual">Inscrição Estadual</label>
                  <input
                    className={errors?.inscricao_estadual && (styled.inputError)}
                    id="inscricao_estadual"
                    type="text"
                    {...register('inscricao_estadual')} 
                  />
                  {errors?.inscricao_estadual?.message && <p className={styled.errorMessage}>{errors.inscricao_estadual.message}</p>}
                </div> 
                )}

                {tipoPessoa === 'PESSOA_JURIDICA' &&  (
                <div className={styled.formGroup}>
                      <label htmlFor="ie_isento">IE Isento</label>
                        <input
                          id={styled.activeField}
                          type="checkbox"
                          defaultChecked={false}
                          className={errors?.ie_isento && "input-error"}
                          {...register('ie_isento')}
                          />
                </div>
                )}

                  {tipoPessoa === 'PESSOA_FISICA' && (
                    <div className={styled.formGroup} id={styled.rgField}>
                      <label htmlFor="rg">RG</label>
                        <input
                          id="rg"
                          type="text"
                          placeholder='__.___.___-_'
                          {...register('rg')}
                          onChange={(e) => rgMask(e)}
                        />
                        {errors?.rg?.message && <p className={styled.errorMessage}>{errors.rg.message}</p>}
                    </div>
                  )}
              </div>

                <div className={styled.formGroup} id={styled.notesField}>
                  <label htmlFor="notas">Notas</label>
                  <textarea
                    id="notas"
                    type="text"
                    maxLength={200}
                    {...register('notas')}
                  />
                  {errors?.notas?.message && <p className={styled.errorMessage}>{errors.notas.message}</p>}
                </div>
            

            </section>
          </CustomTabPanel>

          <CustomTabPanel className={styled.contextForm} value={tabValue} index={1}>
            <section className={styled.tabs}>

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.emailField}>
                  <label htmlFor="email">E-mail*</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                  />
                  {errors?.email?.message && <p className={styled.errorMessage}>{errors.email.message}</p>}
                </div>

                <div className={styled.formGroup} id={styled.phone}>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    type="text"
                    placeholder='(  ) _____-____'
                    {...register('telefone')}
                    onChange={(e) => telefoneMask(e)}
                  />
                  {errors?.telefone?.message && <p className={styled.secondPhone}>{errors.telefone.message}</p>}
                </div>

                <div className={styled.formGroup} id={styled.phoneSecundary}>
                  <label htmlFor="telefone_secundario">Telefone secundário</label>
                  <input
                    id="telefone_secundario"
                    type="text"
                    placeholder='(  ) _____-____'
                    {...register('telefone_secundario')}
                    onChange={(e) => telefoneSecundarioMask(e)}
                  />
                  {errors?.telefone_secundario?.message && <p className={styled.errorMessage}>{errors.telefone_secundario.message}</p>}
                </div>
              </div>

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.cepField}>
                    <label htmlFor="cep">CEP*</label>
                    <input
                      id="cep"
                      type="text"
                      {...register('cep')}
                      onBlur={(e) => searchCEP(e.target.value)}
                      onChange={(e) => cepMask(e)}
                    />
                    {errors?.cep?.message && <p className={styled.errorMessage}>{errors.cep.message}</p>}
                  </div>

                <div className={styled.formGroup} id={styled.streetField}>
                  <label htmlFor="logradouro">Logradouro*</label>
                  <input
                    id="logradouro"
                    type="text"
                    readOnly={true}
                    {...register('logradouro')}
                  />
                  {errors?.logradouro?.message && <p className={styled.errorMessage}>{errors.logradouro.message}</p>}
                </div>

                <div className={styled.formGroup} id={styled.numberAdressField}>
                  <label htmlFor="numero_endereco">Número*</label>
                  <input
                    id="numero_endereco"
                    type="number"
                    min={0}
                    defaultValue={0}
                    {...register('numero_endereco', { valueAsNumber: true})}
                  />
                  {errors?.numero_endereco?.message && <p className={styled.errorMessage}>{errors.numero_endereco.message}</p>}
                </div>

              </div>

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.neighborhoodField}>
                  <label htmlFor="bairro">Bairro*</label>
                  <input
                    id="bairro"
                    type="text"
                    readOnly={true}
                    {...register('bairro')}
                  />
                  {errors?.bairro?.message && <p className={styled.errorMessage}>{errors.bairro.message}</p>}
                </div>
            
                <div className={styled.formGroup} id={styled.cityField}>
                  <label htmlFor="cidade">Cidade*</label>
                  <input
                    id="cidade"
                    type="text"
                    readOnly={true}
                    {...register('cidade')}
                  />
                  {errors?.cidade?.message && <p className={styled.errorMessage}>{errors.cidade.message}</p>}
                </div>       

                <div className={styled.formGroup} id={styled.stateField}>
                  <label htmlFor="estado">Estado*</label>
                  <input
                    id="estado"
                    type="text"
                    readOnly={true}
                    {...register('estado')}
                  />
                  {errors?.estado?.message && <p className={styled.errorMessage}>{errors.estado.message}</p>}
                </div>  
              </div>  

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.complementField}>
                  <label htmlFor="complemento">Complemento*</label>
                  <input
                    id="complemento"
                    type="text"
                    {...register('complemento')}
                  />
                  {errors?.complemento?.message && <p className={styled.errorMessage}>{errors.complemento.message}</p>}
                </div>    
              </div>

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.ibgeCityCodeField}>
                  <label htmlFor="codigoIbgeCidade">codigoIbgeCidade*</label>
                  <input
                    id="codigoIbgeCidade"
                    type="text"
                    {...register('codigoIbgeCidade')}
                  />
                  {errors?.codigoIbgeCidade?.message && <p className={styled.errorMessage}>{errors.codigoIbgeCidade.message}</p>}
                </div>
              </div>

            </section>
          </CustomTabPanel>

          <CustomTabPanel className={styled.contextForm} value={tabValue} index={2}>
            <section className={styled.tabs}>

              <div className={styled.row}>
                <div className={styled.formGroup} id={styled.birthdateField}>
                  <label htmlFor="dataNascimento">Data de Nascimento</label>
                  <input
                    id="dataNascimento"
                    type="date"
                    {...register('dataNascimento')}
                  />
                  {errors?.dataNascimento?.message && <p className={styled.errorMessage}>{errors.dataNascimento.message}</p>}
                </div>
              
              </div>
            </section>
          </CustomTabPanel>

          <CustomTabPanel className={styled.contextForm} value={tabValue} index={3}>
            <section className={styled.tabs}>
              <div className={styled.row}>
                
                  <div className={styled.formGroup}>
                    <label htmlFor="cliente_ativo">Ativo</label>
                    <input
                      type='checkbox'
                      defaultChecked
                      id={styled.activeField}
                      className={errors?.cliente_ativo && "input-error"}
                      {...register('cliente_ativo')}
                    />
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

export default ClientForm;