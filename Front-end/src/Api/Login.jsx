import { customAxios } from "../Axios/axiosApi"


export const LoginApi={
    getSCRFtoken: ()=>{
        return  customAxios.get('/sanctum/csrf-cookie')
    },
    login:(data)=>{
      return customAxios.post('/login',data)
    },
}