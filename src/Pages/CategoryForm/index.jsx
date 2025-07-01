import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm'
import HeaderForm from '../../Components/HeaderForm'
import InputField from '../../Components/InputField';
import styled from './CategoryForm.module.css';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import api from '../../services/api'
import { useEffect, useState } from 'react';
import { z } from 'zod';


const CategoryForm = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const updateDate = new Date();
    const { enqueueSnackbar } = useSnackbar();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

    const createCategorySchema = z.object({
        nome_categoria: z.string()
        .min(5, "Categoria deve ter ao menos 5 caracteres")
        .nonempty("O nome da categoria é obrigatório")
    })

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        resolver: zodResolver(createCategorySchema) 
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createCategory = (data) => {
        console.log(data);
        api.post("cadastros/categorias/novo", {
            categoryName: data.nome_categoria.toUpperCase(),
            createDate: formattedDate,
            createUser: sessionStorage.getItem("user"),
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function() {
            enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/cadastros/categorias');
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

    const editCategory = (data) => {
        console.log(data);
        api.put(`/editar/categorias/${id}`, {
            categoryName: data.nome_categoria.toUpperCase(),
            updateDate: formattedDate,
            updateUser: sessionStorage.getItem("user")
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function() {
            enqueueSnackbar("Cadastro editado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/cadastros/categorias');
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
            setLoading(true);
            api.get(`/editar/categorias/${id}`)
                .then(response => {
                    const category = response.data;  
                    console.log(category);
                    reset({
                        nome_categoria: category.categoryName,
                        createUser: category.createUser,
                        createDate: category.createDate,
                        updateDate: category.updateDate,
                        updateUser: category.updateUser,
                    });
                })
                .catch(error => {
                    enqueueSnackbar("Erro ao carregar categoria", { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right"}});
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const updateDateField = watch("updateDate");
    const updateUserField = watch("updateUser");
    const createUserField = watch("createUser");
    const createDateField = watch("createDate");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={id ? "Atualizar Categoria" : "Nova Categoria"} />
            <form onSubmit={id ? handleSubmit(editCategory) : handleSubmit(createCategory)} onKeyDown={handleKeyDown} autoComplete="off">
                <div className={styled.row}>
                    <InputField
                        idInput="nome_categoria"
                        idDiv={styled.categoryNameField}
                        label="Nome da Categoria*"
                        type="text"
                        register={register}
                        error={errors?.nome_categoria}
                    />
                </div>
                <FooterForm title={id ? "Atualizar" : "Adicionar"} updateDateField={updateDateField} updateUserField={updateUserField} createUserField={createUserField} createDateField={createDateField}/>
            </form>
        </section>
    );
};

export default CategoryForm;