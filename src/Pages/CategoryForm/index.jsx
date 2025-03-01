import { zodResolver } from '@hookform/resolvers/zod';
import FooterForm from '../../Components/FooterForm'
import HeaderForm from '../../Components/HeaderForm'
import InputField from '../../Components/InputField';
import styled from './CategoryForm.module.css';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api'
import { z } from 'zod';

const CategoryForm = () => {
    const navigate = useNavigate();
    const updateDate = new Date();
    const { enqueueSnackbar } = useSnackbar();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

    const createCategorySchema = z.object({
        nome_categoria: z.string()
        .min(5, "Categoria deve ter ao menos 5 caracteres")
        .nonempty("O nome da categoria é obrigatório")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(createCategorySchema)
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createCategory = (data) => {
        api.post("http://localhost:8080/cadastros/categorias/novo", {
            categoryName: data.nome_categoria,
            updateDate: formattedDate,
            updateUser: "ADM",
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

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Nova Categoria"} />
            <form onSubmit={handleSubmit(createCategory)} onKeyDown={handleKeyDown} autoComplete="off">
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
                <FooterForm />
            </form>
        </section>

    );
};

export default CategoryForm;