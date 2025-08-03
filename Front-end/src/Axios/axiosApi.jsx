

import axios from "axios";


export const customAxios = axios.create({
     baseURL: '/back-end/public/',
withCredentials:true,
withXSRFToken:true,
});
