import loginImg from "../../assets/images/login_img.svg";
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from "../../Components/InputField";
import { GoogleOutlined } from '@ant-design/icons';
import styled from "./RegisterLogin.module.css";
import { useForm } from 'react-hook-form';
import { z } from "zod";

const RegisterLoginUser = () => {
    const logOnSchema = z.object({
        usuario: z.string(),
        password: z.string(),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(logOnSchema)
    });

    return (
        <section className={styled.background}>
            <div className={styled.container}>
                <aside className={styled.leftSide}>
                    <img src={loginImg} className={styled.loginImg} alt="Imagem ilustrativa de login" />
                </aside>
                <form onSubmit={handleSubmit} className={styled.rightSide}>
                    <h2 className={styled.title}>LOGIN</h2>
                    <InputField
                        idInput="usuario"
                        idDiv={styled.userField}
                        label={"Usuário"}
                        type="text"
                        register={register}
                        error={errors?.usuario}
                    />

                    <InputField
                        idInput="password"
                        idDiv={styled.passwordField}
                        label={"Senha"}
                        type="password"
                        register={register}
                        error={errors?.password}
                    />
                    <div className={styled.loginOptions}>
                        <label className={styled.rememberMe}>
                            <input type="checkbox" name="rememberMe" id="rememberMe" />
                            <span>Lembre-se de mim</span>
                        </label>

                        <a href="#" className={styled.forgotPassword}>Esqueceu a senha?</a>
                    </div>

                    <button type="submit" className={styled.submitButton}>Entrar</button>
                    <div className={styled.socialMediaButtons}>
                        <GoogleOutlined className={styled.googleIcon} />
                        <span>Entrar com o Google</span>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default RegisterLoginUser;