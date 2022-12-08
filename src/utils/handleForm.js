 const handleForm = (e, setState, prev) => {
    let name = e.target.name;
    let value = e.target.value;

    setState(prev => ({
        ...prev,
        [name]: value
    }));
};

export default handleForm