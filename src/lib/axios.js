import axios from "axios";

const API = axios.create({
    baseURL: 'http://45.64.100.26:88/perpus-api/public/api',
    headers:{
        'Accept': 'application/json',
    }
})

export default API;