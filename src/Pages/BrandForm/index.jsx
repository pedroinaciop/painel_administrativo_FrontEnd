import FooterForm from '../../Components/FooterForm'
import HeaderForm from '../../Components/HeaderForm'
import InputField from '../../Components/InputField';
import styled from './BrandForm.module.css';
import VMasker from 'vanilla-masker';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const BrandFrom = () => {
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();
    const [cnpj, setCnpj] = useState();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createBrand = (data) => {
        console.log(data);
        reset();
        setCnpj("");

        const formattedData = {
            ...data,
            cnpj: data.cnpj.replace(/\D/g, ""),
        };

        console.log("Enviando dados do fornecedor:", formattedData);
    };

    const cnpjMask = (e) => {
        const maskedValue = VMasker.toPattern(e.target.value, '99.999.999/9999-99');
        setValue("cnpj", maskedValue);
    };

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Fornecedor"} />

            <form onSubmit={handleSubmit(createBrand)} onKeyDown={handleKeyDown}>
                <div className={styled.row}>
                    <InputField
                        autoFocus
                        idInput="cnpj"
                        idDiv={styled.cnpjField}
                        label="CNPJ*"
                        type="text"
                        placeholder="__.___.___/____-__"
                        register={register}
                        validation={{ required: 'Esse campo é obrigatório' }}
                        error={errors?.cnpj}
                        onChange={cnpjMask}
                    />
                    <InputField
                        idInput="nome_fornecedor"
                        idDiv={styled.brandNameField}
                        label="Nome do Fornecedor*"
                        type="text"
                        register={register}
                        validation={{ required: 'Esse campo é obrigatório' }}
                        error={errors?.nome_fornecedor}
                    />
                </div>
                <FooterForm />
            </form>

        </section>

    );
};

export default BrandFrom;
