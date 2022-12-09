import Multiselect from 'multiselect-react-dropdown';
import {useState} from "react";

const MultiSelect = ({name, options, selectedValues, getErrorMsg, errors}) => {
    const [selections, setSelections] = useState(selectedValues ?? [])

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
        <>
            {name && <label className={'text-grey-5 text-2xl'} htmlFor={name}>{name.replace('_',' ').toUpperCase()}</label>}
            <Multiselect
                id={name}
                isObject={false}
                onKeyPressFn={function noRefCheck(){}}
                onRemove={onRemove}
                onSelect={onSelect}
                options={options}
                selectedValues={selectedValues}
            />
            {getErrorMsg && <span className={'text-red underline text-lg'}>{getErrorMsg(name, errors)}</span>}
        </>
    )
}

export default MultiSelect