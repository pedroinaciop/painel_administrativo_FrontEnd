import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm';
import HeaderForm from '../../Components/HeaderForm';
import InputField from '../../Components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import styled from './ProviderForm.module.css'
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import VMasker from 'vanilla-masker';
import { useEffect, useState } from 'react';
import api from '../../services/api'
import { z } from 'zod';

const ProviderForm = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
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

    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(createBrandSchema),
    });
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createProvider = (data) => {
        setCnpj("");

        const formattedData = {
            ...data,
            cnpj: data.cnpj.replace(/\D/g, ""),
        };

        api.post('cadastros/fornecedores/novo', {
            cnpj: formattedData.cnpj,
            provider: formattedData.provider.toUpperCase(),
            createDate: formattedDate,
            createUser: sessionStorage.getItem('user'),
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function() {
            enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/cadastros/fornecedores');
        })
        .catch(function(error) {
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
        });
    };

    const editProvider = (data) => {
        console.log(data);
        api.put(`/editar/fornecedores/${id}`, {
            providerName: data.provider.toUpperCase(),
            updateDate: formattedDate,
            updateUser: sessionStorage.getItem("user"),
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function() {
            enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/cadastros/fornecedores');
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
    

    const cnpjMask = (e) => {
        const maskedValue = VMasker.toPattern(e.target.value, '99.999.999/9999-99');
        setCnpj(maskedValue);
        setValue("cnpj", maskedValue);
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            api.get(`/editar/fornecedores/${id}`)
            .then (response => {
                const fornecedor = response.data
                const cnpjMascarado = VMasker.toPattern(fornecedor.cnpj, '99.999.999/9999-99');
                reset ({
                    cnpj: cnpjMascarado,
                    provider: fornecedor.providerName,
                    updateDate: fornecedor.updateDate,
                    updateUser: fornecedor.updateUser,
                    createDate: fornecedor.createDate,
                    createUser: fornecedor.createUser,
                })
            }).catch(error => {
                enqueueSnackbar("Erro ao carregar fornecedor", { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right"}});
            })
            .finally (() => setLoading(true))
        }
    }, [id])

    const updateDateField = watch("updateDate");
    const updateUserField = watch("updateUser");
    const createUserField = watch("createUser");
    const createDateField = watch("createDate");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Fornecedor"} />
            <form onSubmit={id ? handleSubmit(editProvider) : handleSubmit(createProvider)} onKeyDown={handleKeyDown} autoComplete="off">
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
                        readOnly={id ? true : false}
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
                <FooterForm title={id ? "Atualizar" : "Adicionar"} updateDateField={updateDateField} updateUserField={updateUserField} createDateField={createDateField} createUserField={createUserField}/>
            </form>
        </section>
    );
};

export default ProviderForm;