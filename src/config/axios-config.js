const axios = require('axios').default;

axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjYzMTg3ODUwNjJjZGJkODRiOTM1NmY5MSIsInR5cGUiOiJ1c2VyIiwic3ViIjoiNjMxODc4NGY2MmNkYmQ2ZWE0MzU2ZjhhIn0.ezRhc8e3l6UBQdebUv6G06-BzRwG1yo2ELB4Pe9z3jI'
axios.defaults.headers.common['Content-Type'] = 'application/json'
const axiosInstance = axios.create({
    baseURL: 'https://api.gologin.com'
})

module.exports = axiosInstance;