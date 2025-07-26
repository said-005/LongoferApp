import { customAxios } from "../Axios/axiosApi"


export const LogoutApi={
    getSCRFtoken: ()=>{
        return  customAxios.post('/logout')
    },
}