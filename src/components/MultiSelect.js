import Multiselect from 'multiselect-react-dropdown';

const MultiSelect = ({name, options, selectedValues, getErrorMsg, errors, selections, setSelections}) => {


    const onSelect = (selectedList, selectedItem) => {
        console.log('adding to selections', selectedItem)
        setSelections({
            ...selectedList,
            selectedItem
        })
    }

    const onRemove = (selectedList, removedItem) => {
        setSelections(selectedList.filter((selection) => {
            return selection !== removedItem
        }))
    }

    return (
        <div>
            {name && <label className={'text-grey-5 text-2xl'} htmlFor={name}>{name.replace('_',' ').toUpperCase()}</label>}
            <Multiselect
                id={name}
                isObject={false}
                onRemove={onRemove}
                onSelect={onSelect}
                placeholder={'Select values'}
                options={options}
                selectedValues={selectedValues}
            />
            {getErrorMsg && <span className={'text-red underline text-lg'}>{getErrorMsg(name, errors)}</span>}
        </div>
    )
}

export default MultiSelect