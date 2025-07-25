

import { customAxios } from '../Axios/axiosApi';
export const ProductionApi={
   getAll: ()=>{
        return  customAxios.get('api/Production')
    },
    createProduction:(data)=>{
      return customAxios.post('api/Production',data)
    },
    getProductionById:(id)=>{
      return customAxios.get(`api/Production/${id}`)
    },
    updateProduction:(id,data)=>{
      return customAxios.put(`api/Production/${id}`,data)
    },
    deleteProduction:(id)=>{
      return customAxios.delete(`api/Production/${id}`)
    }
}