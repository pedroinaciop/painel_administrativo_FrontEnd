import styled from './TextAreaField.module.css';

function InputField({idInput, idDiv, label, register, validation= {}, error = {}, max = {}, min}) {
    return (
        <div className={styled.formGroup} id={idDiv}>
            <label htmlFor={idInput}>{label}</label>
            <textarea className={error ? styled.inputError : ''} id={idInput} max={max} min={min}
             {...register(idInput, validation)}/>
            {error && <p className={styled.errorMessage}>{error.message}</p>}
      </div>
    );
}

export default InputField;