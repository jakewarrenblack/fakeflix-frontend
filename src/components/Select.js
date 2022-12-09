const Select = ({name, displayName, values, handleForm, value, defaultValue, getErrorMsg, errors}) => {
    return (
        <div className={'mb-4 flex flex-col'}>
            <label className={'text-white'} htmlFor={name}>{displayName}</label>
            <select
                className={'disabled:opacity-75 bg-grey-3 rounded p-6 font-semibold text-white'}
                onChange={handleForm}
                value={value}
                defaultValue={defaultValue}
                name={name}>
                {
                    values.map(({value, name}) => (
                        <option key={value} value={value}>{name}</option>
                    ))
                }
            </select>
            {getErrorMsg && <span className={'text-red underline text-lg'}>{getErrorMsg(name, errors)}</span>}
        </div>
    )
}

export default Select