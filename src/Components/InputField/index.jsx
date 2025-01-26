import styled from './InputField.module.css';

function InputField({ idInput, idDiv, label, type, register, validation, error, min, placeholder, value }) {
    return (
        <div className={styled.formGroup} id={idDiv}>
            <label htmlFor={idInput}>{label}</label>
            <input 
                className={error ? styled.inputError : ''} 
                id={idInput} 
                type={type} 
                min={min} 
                {...register(idInput, validation)} 
                placeholder={placeholder}
                value={value}
            />
            {error && <p className={styled.errorMessage}>{error.message}</p>}
        </div>
    );
}

export default InputField;
