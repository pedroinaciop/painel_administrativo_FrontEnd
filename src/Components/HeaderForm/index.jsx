import styled from './HeaderForm.module.css';

const HeaderForm = ({ title }) => {
    return (
        <header className={styled.header}>
            <h1>{title}</h1>
            <p>Campos com (*) são obrigatórios</p>
        </header>
    );
};

export default HeaderForm;