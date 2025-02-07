import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import InputField from '../../Components/InputField';
import { useNavigate } from 'react-router-dom';
import styled from './ProviderForm.module.css'
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import VMasker from 'vanilla-masker';
import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';

const ProviderForm = () => {
    const updateDate = new Date();
    const navigate = useNavigate();
    const [cnpj, setCnpj] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;
    
    const createBrandSchema = z.object({
        cnpj: z.string()
            .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Formato de CNPJ inválido")
            .min(14, "CNPJ inválido")
            .nonempty("CNPJ é obrigatório"),

        provider: z.string()
            .min(10, "Nome do fornecedor deve ter pelo menos 10 caracteres"),
    })

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(createBrandSchema),
    });
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createBrand = (data) => {
        setCnpj("");

        const formattedData = {
            ...data,
            cnpj: data.cnpj.replace(/\D/g, ""),
        };

        axios.post('http://localhost:8080/cadastro/fornecedores/novo', {
            cnpj: formattedData.cnpj,
            provider: formattedData.provider.toUpperCase(),
            updateDate: formattedDate,
            updateUser: "ADM",
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function () {
            enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/cadastros/fornecedores')
        })
        .catch(function (error) {
            if (axios.isAxiosError(error)) {
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
        });
    };

    const cnpjMask = (e) => {
        const maskedValue = VMasker.toPattern(e.target.value, '99.999.999/9999-99');
        setCnpj(maskedValue);
        setValue("cnpj", maskedValue);
    };

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Fornecedor"} />
            <form onSubmit={handleSubmit(createBrand)} onKeyDown={handleKeyDown} autoComplete="off">
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
                        idInput="provider"
                        idDiv={styled.brandNameField}
                        label="Nome do Fornecedor*"
                        type="text"
                        register={register}
                        error={errors?.provider}
                    />
                </div>
                <FooterForm />
            </form>
        </section>
    );
};

export default ProviderForm;