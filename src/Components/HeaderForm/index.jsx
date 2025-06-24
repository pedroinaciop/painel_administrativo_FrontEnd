import styled from './HeaderForm.module.css';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import voltar from '../../assets/images/voltar.png';

const HeaderForm = ({ title }) => {
    const navigate = useNavigate();
    return (
        <header className={styled.header}>
            <div className={styled.titleHeader}>
                <Button onClick={() => navigate(-1)} icon={<voltar />} >
                    <img className={styled.backButton} src={voltar} alt="" />
                </Button>
                <h1>{title}</h1>
            </div>
            <p>Campos com (*) são obrigatórios</p>
        </header>
    );
};

export default HeaderForm;