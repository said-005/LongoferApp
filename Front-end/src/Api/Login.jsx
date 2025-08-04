import { customAxios } from "../Axios/axiosApi"


export const LoginApi={
    getSCRFtoken: ()=>{
        return  customAxios.get('sanctum/csrf-cookie')
    },
    login: async (data)=>{
      return await customAxios.post('login',data)
    },
}