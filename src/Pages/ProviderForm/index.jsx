import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import InputField from '../../Components/InputField';
import styled from './ProviderForm.module.css'
import { useForm } from 'react-hook-form';
import VMasker from 'vanilla-masker';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { z } from 'zod';

const ProviderFrom = () => {
    const createBrandSchema = z.object({
        cnpj: z.string()
            .min(14, "CNPJ inválido")
            .nonempty("CNPJ é obrigatório"),

        nome_fornecedor: z.string()
            .min(10, "Nome do fornecedor deve ter pelo menos 10 caracteres"),
    })

    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(createBrandSchema),
    });
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

        Swal.fire({
            title: "Cadastro Finalizado",
            text: "Fornecedor cadastrado com sucesso!",
            icon: "success",
            willOpen: () => {
                Swal.getPopup().style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            }
        });

        console.log("Enviando dados do fornecedor:", formattedData);
    };

    const cnpjMask = (e) => {
        const maskedValue = VMasker.toPattern(e.target.value, '99.999.999/9999-99');
        setValue("cnpj", maskedValue);
    };

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Fornecedor"} />

            <form onSubmit={handleSubmit(createBrand)} onKeyDown={handleKeyDown} autocomplete="off">
                <div className={styled.row}>
                    <InputField
                        autoFocus
                        idInput="cnpj"
                        idDiv={styled.cnpjField}
                        label="CNPJ*"
                        type="text"
                        placeholder="__.___.___/____-__"
                        register={register}
                        onChange={cnpjMask}
                        error={errors?.cnpj}
                    />
                    <InputField
                        idInput="nome_fornecedor"
                        idDiv={styled.brandNameField}
                        label="Nome do Fornecedor*"
                        type="text"
                        register={register}
                        error={errors?.nome_fornecedor}
                    />
                </div>
                <FooterForm />
            </form>

        </section>

    );
};

export default ProviderFrom;
