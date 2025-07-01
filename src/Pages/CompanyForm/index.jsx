import InputField from '../../Components/InputField';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import styled from './CompanyForm.module.css';
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import VMasker from 'vanilla-masker';
import api from '../../services/api'
import { useEffect, useState } from 'react';
import { z } from 'zod';

const CompanyForm = () => {
  const { id }  = useParams();
  const updateDate = new Date();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;
  const { enqueueSnackbar } = useSnackbar();

  const createCompanyFormSchema = z.object({
    cnpj: z.string()
      .min(14, "CNPJ inválido")
      .nonempty("CNPJ é obrigatório"),

    razao_social: z.string()
      .min(10, "Razão Social deve ter pelo menos 10 caracteres"),

    inscricao_estadual: z.string(),

    telefone: z.string(),

    email: z.string()
      .toLowerCase()
      .nonempty("O e-mail é obrigatório")
      .email('Formato de e-mail inválido'),

    cep: z.string()
      .min(8, "CEP inválido"),

    logradouro: z.string()
      .nonempty("Logradouro é obrigatório"),

    bairro: z.string()
      .nonempty("Bairro é obrigatório"),

    cidade: z.string()
      .nonempty("Cidade é obrigatório"),

    estado: z.string()
      .nonempty("Estado é obrigatório"),

    numero_endereco: z.number()
      .min(0, "Número inválido"),

    complemento: z.string()
      .max(55, "Escreva um complemento menor do que 55 caracteres")
  })

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(createCompanyFormSchema),
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const cnpjMask = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const maskedValue = VMasker.toPattern(e.target.value, "99.999.999/9999-99");
    setValue("cnpj", maskedValue);
  };

  const phoneMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "(99) 99999-9999");
    setValue("telefone", maskedValue);
  };

  const cepMask = (e) => {
    const maskedValue = VMasker.toPattern(e.target.value, "99999-999");
    setValue("cep", maskedValue);
  };

  async function searchCEP(cep) {
    try {
      if (!cep) {
        setValue("logradouro", "");
        setValue("bairro", "");
        setValue("cidade", "");
        setValue("estado", "");
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
      }
    } catch (e) {
      enqueueSnackbar('Ocorreu um erro ao buscar o CEP', { variant: 'error', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
    }
  }

  const createCompany = (data) => {
    api.post('cadastros/empresas/novo', {
    cnpj: data.cnpj.replace(/\D/g, ""),
    corporateReason: data.razao_social,
    stateRegistration: data.inscricao_estadual,
    email: data.email,
    phone: data.telefone.replace(/\D/g, ""),
    cep: data.cep.replace(/\D/g, ""),
    numberAddress: data.numero_endereco,
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.cidade,
    state: data.estado,
    complement: data.complemento,
    createDate: formattedDate,
    createUser: sessionStorage.getItem("user"),
  }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function () {
      enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } })
      navigate('/cadastros/empresas')
    }).catch(function (error) {
      console.log(error)
      if (api.isAxiosError(error)) {
        if (error.response) {
          enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error" });
        } else if (error.request) {
          enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning" });
        } else {
          enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error" });
        }
      } else {
        enqueueSnackbar("Erro inesperado", { variant: "error" });
      }
    })

    console.log(data);
  };

   const editCompany = (data) => {
    api.put(`/editar/empresas/${id}`,  {
    cnpj: data.cnpj.replace(/\D/g, ""),
    corporateReason: data.razao_social,
    stateRegistration: data.inscricao_estadual,
    email: data.email,
    phone: data.telefone.replace(/\D/g, ""),
    cep: data.cep.replace(/\D/g, ""),
    numberAddress: data.numero_endereco,
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.cidade,
    state: data.estado,
    complement: data.complemento,
    updateDate: formattedDate,
    updateUser: sessionStorage.getItem("user"),
  }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function() {
        enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
        navigate('/cadastros/empresas');
    }).catch(function(error) {
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
        setLoading(true)
        api.get(`editar/empresas/${id}`)
        .then(response => {
          const company = response.data;
          const cnpjMascarado = VMasker.toPattern(company.cnpj, '99.999.999/9999-99');
          const cepMascarado = VMasker.toPattern(company.cep, '99999-999');
          reset({
            cnpj: cnpjMascarado,
            razao_social: company.corporateReason,
            inscricao_estadual: company.stateRegistration,
            email: company.email,
            telefone: company.phone,
            cep: cepMascarado,
            logradouro: company.street,
            numero_endereco: company.numberAddress,
            bairro: company.neighborhood,
            cidade: company.city,
            estado: company.state,
            complemento: company.complement,

            updateDate: company.updateDate,
            updateUser: company.updateUser,

            createUser: company.createUser,
            createDate: company.createDate,
          });
        }) 
        .catch(error => {
          enqueueSnackbar("Erro ao carregar categoria", { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right"}});
        })
        .finally(() => setLoading(false));
    }
  }, [id])

  const updateDateField = watch("updateDate");
  const updateUserField = watch("updateUser");
  const createUserField = watch("createUser");
  const createDateField = watch("createDate");

  return (
    <section className={styled.appContainer}>
      <HeaderForm title={"Nova Empresa"} />
      <form onSubmit={id ? handleSubmit(editCompany) : handleSubmit(createCompany)} className={styled.form} onKeyDown={handleKeyDown}>
        <section className={styled.contextForm}>
          <div className={styled.row}>
            <InputField
              idInput="cnpj"
              autoFocus
              idDiv={styled.cnpjField}
              label="CNPJ*"
              type="text"
              placeholder={"__.___.___/____.__"}
              readOnly={id ? true : false}
              register={register}
              onChange={cnpjMask}
              error={errors.cnpj}
            />

            <InputField
              idInput="razao_social"
              idDiv={styled.corporateReasonField}
              label="Razão Social*"
              type="text"
              register={register}
              error={errors.razao_social}
            />
          </div>

          <div className={styled.row}>
            <InputField
              idInput="inscricao_estadual"
              idDiv={styled.stateRegistrationField}
              label="Inscrição Estadual"
              type="text"
              register={register}
              error={errors.inscricao_estadual}
            />

            <InputField
              idInput="email"
              idDiv={styled.emailAddressField}
              label="E-mail*"
              type="email"
              register={register}
              error={errors.email}
            />

            <InputField
              idInput="telefone"
              idDiv={styled.phoneField}
              label="Telefone"
              type="text"
              placeholder={"(__) _____-____"}
              register={register}
              onChange={phoneMask}
              error={errors.telefone}
            />
          </div>

          <div className={styled.row}>
            <InputField
              idInput="cep"
              idDiv={styled.cepField}
              label="CEP*"
              type="text"
              placeholder={"_____-___"}
              register={register}
              onChange={cepMask}
              onBlur={(e) => searchCEP(e.target.value)}
              error={errors.cep}
            />

            <InputField
              readOnly
              idInput="logradouro"
              idDiv={styled.streetField}
              label="Logradouro*"
              type="text"
              register={register}
              error={errors.logradouro}
            />

            <InputField
              idInput="numero_endereco"
              idDiv={styled.numberAdressField}
              label="Número*"
              type="number"
              defaultValue={0}
              register={register}
              valueAsNumber={true}
              error={errors.numero_endereco}
            />
          </div>

          <div className={styled.row}>
            <InputField
              readOnly
              idInput="bairro"
              idDiv={styled.neighborhoodField}
              label="Bairro*"
              type="text"
              register={register}
              error={errors.bairro}
            />

            <InputField
              readOnly
              idInput="cidade"
              idDiv={styled.cityField}
              label="Cidade*"
              type="text"
              register={register}
              error={errors.cidade}
            />

            <InputField
              readOnly
              idInput="estado"
              idDiv={styled.stateField}
              label="Estado*"
              type="text"
              register={register}
              error={errors.estado}
            />
          </div>

          <div className={styled.row}>
            <InputField
              idInput="complemento"
              idDiv={styled.complementField}
              label="Complemento"
              type="text"
              register={register}
              error={errors.complemento}
            />
          </div>
        </section>
        <FooterForm title={id ? "Atualizar" : "Adicionar"} updateDateField={updateDateField} updateUserField={updateUserField} createUserField={createUserField} createDateField={createDateField}/>
      </form>
    </section>
  );
};

export default CompanyForm;