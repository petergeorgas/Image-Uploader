import React, { useState } from 'react'
import "./FormInput.css"

const FormInput = (props) => {
    const [focused, setFocused] = useState(false); 

    const {label, errorMsg, onChange, onBlur, id, ...inputProps} = props; 

    const handleFocus = (event) => {
        setFocused(true);
    }

    return (
        <div className="form-input">
            <label>{label}</label>
            <input {...inputProps} onChange={onChange} onFocus={() => inputProps.name === "confPass" && setFocused(true)} onBlur={handleFocus} focused={focused.toString()}/>
            <span>{errorMsg}</span>
        </div>
    )
}

export default FormInput
