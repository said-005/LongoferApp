

import axios from "axios";


export const customAxios = axios.create({
baseURL: 'http://192.168.0.102:8000/',
withCredentials:true,
withXSRFToken:true,
});
