import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './UserForm.module.css';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const UserForm = () => {
    const createUserFormSchema = z.object({
        nome_completo: z.string()
        .nonempty("O e-mail é obrigatório"),

        email: z.string()
        .nonempty("O e-mail é obrigatório")
        .email('Formato de e-mail inválido'),

        senha: z.string()
        .min(6, "A senha precisa de no mínimo 6 caracteres"),

        confirma_senha: z.string()
        .min(6, "A senha precisa de no mínimo 6 caracteres"),
    });

    const { register, handleSubmit, handleKeyDown, formState: { errors }, reset } = useForm({
        resolver: zodResolver(createUserFormSchema),
    });

    const createUser = (data) => {
        console.log(data);
        reset();
    };

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Usuário"} />
            <form onSubmit={handleSubmit(createUser)} onKeyDown={handleKeyDown}>
                <div className={styled.row}>
                    <InputField
                        autoFocus
                        idInput="nome_completo"
                        idDiv={styled.fullNameField}
                        label="Nome Completo*"
                        type="text"
                        register={register}
                        error={errors?.nome_completo}
                    />
                    <InputField
                        idInput="email"
                        idDiv={styled.emailField}
                        label="E-mail*"
                        type="email"
                        register={register}
                        error={errors?.email}
                    />
                </div>

                <div className={styled.row}>
                    <InputField
                        idInput="senha"
                        idDiv={styled.passwordField}
                        label="Senha*"
                        type="password"
                        register={register}
                        error={errors?.senha}
                    />
                    <InputField
                        idInput="confirma_senha"
                        idDiv={styled.confirmPasswordField}
                        label="Confirme a Senha*"
                        type="password"
                        register={register}
                        error={errors?.confirma_senha}
                    />
                </div>
                <FooterForm />
            </form>
        </section>
    );
}

export default UserForm;