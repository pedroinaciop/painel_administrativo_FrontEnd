import ButtonForm from '../../Components/ButtonForm';
import InputField from '../../Components/InputField';
import styled from './FooterForm.module.css'
import { useForm } from 'react-hook-form';

const FooterForm = () => {
    const { register } = useForm();
    return (
        <footer className={styled.footer}>
            <div className={styled.buttons}>
                <ButtonForm type="submit" text="Adicionar" />
                <ButtonForm type="reset" text="Limpar" />
            </div>
            <div className={styled.updates}>
                <InputField
                    idDiv="updateDate"
                    idInput="updateDate"
                    label="Data de Alteração"
                    type="text"
                    value={new Date().toLocaleDateString('pt-BR') + " " + new Date().toLocaleTimeString('pt-BR')}
                    register={register}
                />

                <InputField
                    idDiv="updateDate"
                    idInput="updateUser"
                    label="Usuário de Alteração"
                    type="text"
                    register={register}
                />
            </div>
        </footer>
    );
};

export default FooterForm;