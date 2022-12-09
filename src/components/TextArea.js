import clsx from "clsx";

const TextArea = ({handleForm, value, defaultValue, placeholder, name, disabled=false, variant='standard', id, labelValue, getErrorMsg}) => {
    const variants = {
        standard: 'mt-0 min-h-[8rem] disabled:opacity-75 bg-grey-3 h-11 rounded mb-4 p-6 font-semibold placeholder:text-grey-1 text-white w-full',
        editForm: 'mt-0 min-h-[8rem] disabled:opacity-75 bg-grey-9 h-11 mb-4 p-6 py-12 font-semibold placeholder:text-grey-1 text-2xl text-white w-full'
    }

    return (
        <>
            {labelValue && id && <label className={'text-grey-5 text-2xl'} htmlFor={id}>{labelValue}</label>}
            <textarea
                id={id}

                placeholder={placeholder}
                disabled={disabled}
                className={clsx(variants[variant])}
                name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={handleForm}
            />
            {getErrorMsg && <span className={'text-red underline text-lg'}>{getErrorMsg(name)}</span>}
        </>
    )
}

export default TextArea