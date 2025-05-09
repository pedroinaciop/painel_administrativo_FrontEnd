import loginImg from "../../assets/images/login_img.svg";
import InputPassword from "../../Components/InputPassword"
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from "../../Components/InputField";
import styled from "./RegisterLogin.module.css";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import api from '../../services/api'
import { useState } from "react";
import { z } from "zod";

const RegisterLoginUser = () => {
    const [errorAPI, setError] = useState(null);
    const navigate = useNavigate();

    const logOnSchema = z.object({
        usuario: z.string().email("Digite um e-mail válido"),
        senha: z.string().nonempty("A senha não pode estar vazia"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(logOnSchema)
    });

    const logar = (data) => {
            api.post('auth/login', {
                login: data.usuario,
                password: data.senha
            })
            .then(response => {
                navigate("/");
                sessionStorage.setItem("user", response.data.user)
                sessionStorage.setItem("token", response.data.token)
            })
            .catch(error => {
                setError(error.response?.data);
            });
    };

    return (
        <section className={styled.main}>
            <div className={styled.formContent}>
                <form onSubmit={handleSubmit(logar)} className={styled.form}>
                    <h2 className={styled.title}>Login</h2>
                    {errorAPI && <p>{errorAPI}</p>}
                    
                    <InputField
                        idInput="usuario"
                        idDiv={styled.userField}
                        label={"Usuário"}
                        type="email"
                        maxLength={60}
                        placeholder={"Insira seu e-mail"}
                        register={register}
                        error={errors?.usuario}
                    />

                    <InputPassword
                        idInput="senha"
                        idDiv={styled.passwordField}
                        label={"Senha"}
                        maxLength={30}
                        type="password"
                        placeholder={"Insira a senha"}
                        register={register}
                        error={errors?.senha}
                    />
                    <button type="submit" className={styled.submitButton}>ENTRAR</button>
                </form>
            </div>
            <div className={styled.imgContent}>
                <img src={loginImg} className={styled.loginImg} alt="Imagem ilustrativa de login" />
            </div>
        </section>
    );
};

export default RegisterLoginUser;