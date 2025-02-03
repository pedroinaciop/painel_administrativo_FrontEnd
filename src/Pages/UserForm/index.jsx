import InputPassword from '../../Components/InputPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './UserForm.module.css';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import React from 'react';
import { z } from 'zod';

const UserForm = () => {
    const createUserFormSchema = z.object({
        nome_completo: z.string()
            .nonempty("O nome é obrigatório")
            .min(3, "O nome precisa de no mínimo 3 caracteres")
            .transform(name => {
                return name.trim().split(' ').map(word => {
                    return word[0].toLocaleUpperCase().concat(word.substring(1));
                }).join(' ');
            }),

        email: z.string()
            .toLowerCase()
            .nonempty("O e-mail é obrigatório")
            .email('Formato de e-mail inválido'),

        senha: z.string()
            .nonempty("A senha é obrigatória")
            .min(6, "A senha precisa de no mínimo 6 caracteres")
            .max(20, "A senha não pode ultrapassar 64 caracteres"),

        confirma_senha: z.string()
            .nonempty("A confirmação da senha é obrigatória")
            .min(6, "A senha precisa de no mínimo 6 caracteres")
            .max(20, "A senha não pode ultrapassar 64 caracteres"),
    }).refine(data => data.senha === data.confirma_senha, {
        message: "As senhas não conferem",
        path: ["confirma_senha"]
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(createUserFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createUser = (data) => {
        console.log(data);

        Swal.fire({
            title: "Cadastro Finalizado",
            text: "Usuário cadastrado com sucesso!",
            icon: "success",
            willOpen: () => {
                Swal.getPopup().style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            }
        });

        reset();
    };

    return (

        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Usuário"} />
            <form onSubmit={handleSubmit(createUser)} onKeyDown={handleKeyDown} autoComplete="off">
                <div className={styled.row}>
                    <InputField
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