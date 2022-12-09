import clsx from "clsx";

const Input = ({handleForm, type, value, defaultValue, placeholder, name, disabled=false, variant='standard', id, labelValue, getErrorMsg}) => {
    const variants = {
        standard: 'disabled:opacity-75 bg-grey-3 h-11 rounded mb-4 p-6 font-semibold placeholder:text-grey-1 text-white w-full',
        editForm: 'disabled:opacity-75 bg-grey-9 h-11 mb-4 p-6 py-12 font-semibold placeholder:text-grey-1 text-2xl text-white w-full'
    }

    return (
        <>
        {labelValue && id && <label className={'text-grey-5 text-2xl'} htmlFor={id}>{labelValue}</label>}
        <input
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(variants[variant])}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={handleForm}
        />
            {getErrorMsg && <span className={'text-red underline text-lg'}>{getErrorMsg(name)}</span>}
        </>
    )
}

export default Input