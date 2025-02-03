import FooterForm from '../../Components/FooterForm'
import HeaderForm from '../../Components/HeaderForm'
import InputField from '../../Components/InputField';
import styled from './CategoryForm.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { z } from 'zod';

const CategoryForm = () => {
    const createCategorySchema = z.object({
        nome_categoria: z.string()
        .min(5, "Categoria deve ter ao menos 5 caracteres")
        .nonempty("O nome da categoria é obrigatório")
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(createCategorySchema)
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createCategory = (data) => {
        console.log(data);

        Swal.fire({
            title: "Cadastro Finalizado",
            text: "Categoria cadastrada com sucesso!",
            icon: "success",
            willOpen: () => {
                Swal.getPopup().style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            }
        });

        reset();
    };

    console.log(errors);

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Fornecedor"} />
            <form onSubmit={handleSubmit(createCategory)} onKeyDown={handleKeyDown} autocomplete="off">
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
