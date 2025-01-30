import InputField from '../../Components/InputField';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import styled from './CompanyForm.module.css';
import { useForm } from "react-hook-form";
import * as React from 'react';
import VMasker from 'vanilla-masker';

const CompanyForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  
  const createCompany = (data) => {
  
    const formattedData = {
      ...data,
      cnpj: data.cnpj.replace(/\D/g, ""),
      telefone: data.telefone.replace(/\D/g, ""),
      cep: data.cep.replace(/\D/g, ""),
    };

    console.log("Enviando dados da empresa:", formattedData);
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

  return (
    <section className={styled.appContainer}>
      <HeaderForm title={"Empresa"} />
      <form onSubmit={handleSubmit(createCompany)} className={styled.form} onKeyDown={handleKeyDown}>
        <section className={styled.contextForm}>
          <div className={styled.row}>
            <InputField 
              idInput="cnpj"
              autoFocus
              idDiv={styled.cnpjField}
              label="CNPJ*"
              type="text"
              register={register} 
              validation={{ required: "Campo obrigatório" }}
              onChange={cnpjMask}
              error={errors.cnpj}
            />

            <InputField
              idInput="razao_social"
              idDiv={styled.corporateReasonField}
              label="Razão Social*"
              type="text"
              register={register}
              validation={{ required: "Campo obrigatório" }}
              error={errors.razao_social}
            />
          </div>

          <div className={styled.row}>
            <InputField
              idInput="inscricao_estadual"
              idDiv={styled.stateRegistrationField}
              label="Inscrição Estadual*"
              type="text"
              register={register} 
              validation={{ required: "Campo obrigatório" }}
              error={errors.inscricao_estadual}
            />

            <InputField
              idInput="email"
              idDiv={styled.emailAddressField}
              label="E-mail"
              type="email"
              register={register}
              error={errors.emailAddress}
            />

            <InputField
              idInput="telefone"
              idDiv={styled.phoneField}
              label="Telefone*"
              type="text"
              register={register} 
              validation={{ required: "Campo obrigatório" }}
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
              register={register} 
              validation={{ required: "Campo obrigatório" }}
              onChange={cepMask}
              error={errors.cep}
            />

            <InputField
              readOnly
              idInput="rua"
              idDiv={styled.streetField}
              label="Rua"
              type="text"
              register={register}
            />

            <InputField
              readOnly
              idInput="numero_endereco"
              idDiv={styled.numberAdressField}
              label="Número"
              type="text"
              register={register}
            />
          </div>

          <div className={styled.row}>
            <InputField
              readOnly
              idInput="bairro"
              idDiv={styled.neighborhoodField}
              label="Bairro"
              type="text"
              register={register}
            />

            <InputField
              readOnly
              idInput="cidade"
              idDiv={styled.cityField}
              label="Cidade"
              type="text"
              register={register}
            />

            <InputField
              readOnly
              idInput="estado"
              idDiv={styled.stateField}
              label="Estado"
              type="text"
              register={register}
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
