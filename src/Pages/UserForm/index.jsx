import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './UserForm.module.css';
import { useForm } from 'react-hook-form';
import InputPassword from '../../Components/InputPassword';
import { z } from "zod";
import React from 'react';

const UserForm = () => {    
    const createUserFormSchema = z.object({
        nome_completo: z.string()
        .nonempty("O nome é obrigatório")
        .transform(name => {
            return name.trim().split(' ').map(word => {
                return word[0].toLocaleUpperCase().concat(word.substring(1))
            }).join(' ');
        }),

        email: z.string()
        .toLowerCase()
        .nonempty("O e-mail é obrigatório")
        .email('Formato de e-mail inválido'),

        senha: z.string()
        .nonempty("A senha é obrigatória")
        .min(6, "A senha precisa de no mínimo 6 caracteres"),

        confirma_senha: z.string()
        .nonempty("A confirmação da senha é obrigatória")
        .min(6, "A senha precisa de no mínimo 6 caracteres"),
    }).refine(data => data.senha === data.confirma_senha, {
        message: "As senhas não conferem",
        path: ["confirma_senha"]
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
            <form onSubmit={handleSubmit(createUser)} onKeyDown={handleKeyDown} autocomplete="off">
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
                    <InputPassword
                        idInput="senha"
                        idDiv={styled.passwordField}
                        label="Senha*"
                        type="password"
                        register={register}
                        error={errors?.senha}
                    />
                    <InputPassword
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