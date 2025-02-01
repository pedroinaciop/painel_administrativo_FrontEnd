import FooterForm from '../../Components/FooterForm'
import HeaderForm from '../../Components/HeaderForm'
import InputField from '../../Components/InputField';
import styled from './CategoryForm.module.css';
import { useForm } from 'react-hook-form';

const CategoryForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createCategory = (data) => {
        console.log(data);
        reset();
    };

    console.log(errors);

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Fornecedor"} />
            <form onSubmit={handleSubmit(createCategory)} onKeyDown={handleKeyDown}>
                <div className={styled.row}>
                    <InputField
                        autoFocus
                        idInput="codigo_categoria"
                        idDiv={styled.categoryCodeField}
                        label="Código da categoria*"
                        type="text"
                        register={register}
                        validation={{ required: 'Esse campo é obrigatório' }}
                        error={errors?.codigo_categoria}
                    />
                    <InputField
                        idInput="nome_categoria"
                        idDiv={styled.categoryNameField}
                        label="Nome da Categoria*"
                        type="text"
                        register={register}
                        validation={{ required: 'Esse campo é obrigatório' }}
                        error={errors?.nome_categoria}
                    />
                </div>
                <FooterForm />
            </form>
        </section>

    );
};

export default CategoryForm;
