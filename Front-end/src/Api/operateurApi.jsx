import { customAxios } from "../Axios/axiosApi"


export const OperateurApi={
    getAll: ()=>{
        return  customAxios.get('api/Operateur')
    },
    createOperateur:(data)=>{
      return customAxios.post('api/Operateur',data)
    },
    getOperateurById:(id)=>{
      return customAxios.get(`api/Operateur/${id}`)
    },
    updateOperateur:(id,data)=>{
      return customAxios.put(`api/Operateur/${id}`,data)
    },
    deleteOperateur:(id)=>{
      return customAxios.delete(`api/Operateur/${id}`)
    }
}