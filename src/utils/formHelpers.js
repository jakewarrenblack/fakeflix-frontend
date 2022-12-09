// Cast errors are ridiculously long, replace if castError
export const formatErrors = (obj) => Object.keys(obj).map((key) => ({[key]: obj[key].message}))

export const age_certification_values = [
    {value: "TV-MA", name: "TV-MA"},
    {value: "R", name: "R"},
    {value: "PG", name: "PG"},
    {value: "TV-14", name: "TV-14"},
    {value: "PG-13", name: "PG-13"},
    {value: "TV-PG", name: "TV-PG"},
    {value: "TV-Y", name: "TV-Y"},
    {value: "TV-G", name: "TV-G"},
    {value: "TV-Y7", name: "TV-Y7"},
    {value: "G", name: "G"},
    {value: "NC-17", name: "NC-17"}
]

export const age_cert_arr = [
    "TV-MA",
    "R",
    "PG",
    "TV-14",
    "PG-13",
    "TV-PG",
    "TV-Y",
    "TV-G",
    "TV-Y7",
    "G",
    "NC-17"
]

export const getErrorMsg = (key, errors) => {
    const idx = errors.findIndex((err) => err[key])
    if(idx !== -1){
        let msg = Object.values(errors[idx])[0]
        if(msg){
            return msg
        }
    }
};

// Arrays poorly formatted in the DB. They aren't real arrays, but strings in this format:
// "['item1', 'item2']"
export const arrayFromString = (str) => str.split(',').map((item) => item.replace(/[\W_]+/g," ").trim())


// On the backend, I'm searching through genres in their original format to recommend titles, so before updating or adding new genres, I'm converting them back to their original (weird) format.`
// remember to replace spaces with hyphens, for e.g, PG-13 in age certification
export const arrayToDbFormat = (arr) => {
    console.log('array', arr)
    return `[${Object.values(arr).map((item) => `'${item}'`).toString().replaceAll('"', "'").replaceAll(",'", ", '").replace(/([a-zA-Z0-9])\s([a-zA-Z0-9])/g, '$1-$2')}]`
}

export const genreOptions = [
    'western', 'family', 'crime', 'reality', 'horror', 'action', 'thriller', 'scifi', 'animation', 'documentation', 'drama', 'war', 'history', 'comedy', 'romance', 'fantasy', 'european', 'sport', 'music'
]

export const productionCountryOptions = [
    'GH', 'RS', 'CL', 'VA', 'RU', 'RO', 'PY', 'TZ', 'FO', 'HR', 'IR', 'IS', 'TW', 'BF', 'CM', 'PK', 'CZ', 'IL', 'FI', 'BE', 'SA', 'Lebanon', 'MY', 'CU', 'AL', 'HU', 'TH', 'CD', 'DK', 'BY', 'UA', 'LB', 'GE', 'KG', 'GB', 'PR', 'SE', 'MT', 'GT', 'LT', 'US', 'KN', 'BS', 'JO', 'GL', 'AF', 'SN', 'CY', 'NP', 'PT', 'KW', 'LK', 'IN', 'VN', 'MC', 'BG', 'DZ', 'UY', 'NO', 'BD', 'EG', 'CO', 'PS', 'MU', 'NA', 'PE', 'AE', 'CH', 'XX', 'KH', 'MA', 'IE', 'AT', 'IO', 'TN', 'VE', 'LU', 'NG', 'NZ', 'AO', 'KR', 'PL', 'BR', 'DE', 'SU', 'ES', 'BT', 'SY', 'QA', 'CA', 'PH', 'MX', 'JP', 'FR', 'AR', 'IT', 'ZW', 'KE', 'ZA', 'GR', 'SG', 'ID', 'TR', 'IQ', 'AU', 'MW', 'HK', 'NL', 'CN'
]

