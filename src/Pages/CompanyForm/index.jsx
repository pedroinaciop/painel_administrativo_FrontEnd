import InputField from '../../Components/InputField';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from './CompanyForm.module.css';
import { useForm } from "react-hook-form";
import VMasker from 'vanilla-masker';
import Swal from 'sweetalert2';
import * as React from 'react';
import { z } from 'zod';

const CompanyForm = () => {
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
      .min(0, "Número inválido")
  })

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(createCompanyFormSchema),
  });

  const createCompany = (data) => {
    const formattedData = {
      ...data,
      cnpj: data.cnpj.replace(/\D/g, ""),
      telefone: data.telefone.replace(/\D/g, ""),
      cep: data.cep.replace(/\D/g, ""),
    };

    Swal.fire({
      title: "Cadastro Finalizado",
      text: "Empresa cadastrada com sucesso!",
      icon: "success",
      willOpen: () => {
        Swal.getPopup().style.fontFamily =  'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
      }
    });

    console.log("Enviando dados da empresa:", formattedData);
    reset();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const cnpjMask = (e) => {
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
      const cepResult = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const resultCepConversion = await cepResult.json();

      if (resultCepConversion.erro) {
        Swal.fire({
          icon: "error",
          title: "CEP inválido",
          text: "Por favor, inclua um CEP válido.",
          footer: '<a href="https://buscacepinter.correios.com.br/app/localidade_logradouro/index.php" target="_blank">Não sabe qual o CEP correto?</a>',
          willOpen: () => {
            Swal.getPopup().style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
          }
        });
        return;
      }

      setValue("logradouro", resultCepConversion.logradouro);
      setValue("bairro", resultCepConversion.bairro);
      setValue("cidade", resultCepConversion.localidade);
      setValue("estado", resultCepConversion.uf);
    } catch (erro) {
      console.error(erro);
    }
  }

  console.log(errors)

  return (
    <section className={styled.appContainer}>
      <HeaderForm title={"Nova Empresa"} />
      <form onSubmit={handleSubmit(createCompany)} className={styled.form} onKeyDown={handleKeyDown} autoComplete="off">
        <section className={styled.contextForm}>
          <div className={styled.row}>
            <InputField
              idInput="cnpj"
              autoFocus
              idDiv={styled.cnpjField}
              label="CNPJ*"
              type="text"
              placeholder={"__.___.___/____.__"}
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
        <FooterForm />
      </form>
    </section>
  );
};

export default CompanyForm;
