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