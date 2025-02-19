import { zodResolver } from '@hookform/resolvers/zod';
import InputField from "../../Components/InputField";
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

                <form onSubmit={handleSubmit}>
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
                </form>
            </div>

            <button type="submit">Entrar</button>
        </section>
    )
}

export default RegisterLoginUser;