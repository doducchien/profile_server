const axios = require('axios').default;

axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjYzMWU1ZTk1ODNkNWVlNDk5OGNiNDQ4MCIsInR5cGUiOiJ1c2VyIiwic3ViIjoiNjMxZTVlOTM4M2Q1ZWU0MzQ1Y2I0NDdiIn0.ah5MlReOss2swIzZOA8i0ey3DhduXwZeqcA4h0sAEqs'
axios.defaults.headers.common['Content-Type'] = 'application/json'
const axiosInstance = axios.create({
    baseURL: 'https://api.gologin.com'
})

module.exports = axiosInstance;