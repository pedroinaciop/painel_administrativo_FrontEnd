import ButtonForm from '../../Components/ButtonForm';
import InputField from '../../Components/InputField';
import styled from './FooterForm.module.css'

const FooterForm = ({title, updateUserField, updateDateField}) => {
    return (
        <footer className={styled.footer}>
            <div className={styled.buttons}>
                <ButtonForm type="submit" text={title} />
                <ButtonForm type="reset" text="Limpar" />
            </div>
            <div className={styled.updates}>
                <InputField
                    idDiv="updateDate"
                    idInput="updateDate"
                    label="Data de Alteração"
                    type="text"
                    value={updateDateField}
                    readOnly
                />

                <InputField
                    idDiv="updateDate"
                    idInput="updateUser"
                    label="Usuário de Alteração"
                    type="text" 
                    value={updateUserField}
                    readOnly
                />
            </div>
        </footer>
    );
};

export default FooterForm;