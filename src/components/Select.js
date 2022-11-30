const Select = ({name, displayName, values, handleForm}) => {
    return (
        <div className={'mb-4 flex flex-col'}>
            <label className={'text-white'} htmlFor={name}>{displayName}</label>
            <select className={'disabled:opacity-75 bg-grey-3 rounded p-6 font-semibold text-white'} onChange={handleForm} name={name}>
                {
                    values.map(({value, name}) => (
                        <option key={value} value={value}>{name}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default Select