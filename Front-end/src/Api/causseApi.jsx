

import { customAxios } from '../Axios/axiosApi';
export const CausseApi={
   getAll: ()=>{
        return  customAxios.get('api/Causse')
    },
    createCausse:(data)=>{
      return customAxios.post('api/Causse',data)
    },
    getCausseById:(id)=>{
      return customAxios.get(`api/Causse/${id}`)
    },
    updateCausse:(id,data)=>{
      return customAxios.put(`api/Causse/${id}`,data)
    },
    deleteCausse:(id)=>{
      return customAxios.delete(`api/Causse/${id}`)
    }
}