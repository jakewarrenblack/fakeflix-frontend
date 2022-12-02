const Input = ({handleForm, type, value, placeholder, name, disabled=false }) => {
    return (
        <input
            disabled={disabled}
            className={'disabled:opacity-75 bg-grey-3 h-11 rounded mb-4 p-6 font-semibold placeholder:text-grey-1 text-white w-full'}
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={handleForm}
        />
    )
}

export default Input