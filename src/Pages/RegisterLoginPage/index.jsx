import loginImg from "../../assets/images/login_img.svg";
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from "../../Components/InputField";
import styled from "./RegisterLogin.module.css";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import axios from 'axios';

const RegisterLoginUser = () => {
    localStorage.setItem("token", "");
    const navigate = useNavigate();
    const logOnSchema = z.object({
        usuario: z.string().email("Digite um e-mail válido"),
        senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(logOnSchema)
    });

    const login = (data) => {
            axios.post('http://localhost:8080/auth/login', {
                login: data.usuario,
                password: data.senha
            })
            .then(response => {
                console.log("Login bem-sucedido:", response.data);
                localStorage.setItem("token", response.data.token);
                navigate("/")
                
            })
            .catch(error => {
                console.error("Erro Axios:", error.response?.data || error.message);
            });
    };

    return (
        <section className={styled.background}>
            <div className={styled.container}>
                <aside className={styled.leftSide}>
                    <img src={loginImg} className={styled.loginImg} alt="Imagem ilustrativa de login" />
                </aside>
                <form onSubmit={handleSubmit(login)} className={styled.rightSide}>
                    <h2 className={styled.title}>LOGIN</h2>

                    <InputField
                        idInput="usuario"
                        idDiv={styled.userField}
                        label={"Usuário"}
                        type="email"
                        register={register}
                        error={errors?.usuario}
                    />

                    <InputField
                        idInput="senha"
                        idDiv={styled.passwordField}
                        label={"Senha"}
                        type="text"
                        register={register}
                        error={errors?.password}
                    />

                <button type="submit" className={styled.submitButton}>Entrar</button>
                </form>
            </div>
        </section>
    );
};

export default RegisterLoginUser;