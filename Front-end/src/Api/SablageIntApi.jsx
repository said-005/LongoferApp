

import { customAxios } from '../Axios/axiosApi';
export const SablageIntApi={
   getAll: ()=>{
        return  customAxios.get('api/Sablage_int')
    },
    createSablage_int:(data)=>{
      return customAxios.post('api/Sablage_int',data)
    },
    getSablage_intById:(id)=>{
      return customAxios.get(`api/Sablage_int/${id}`)
    },
    updateSablage_int:(id,data)=>{
      return customAxios.put(`api/Sablage_int/${id}`,data)
    },
    deleteSablage_int:(id)=>{
      return customAxios.delete(`api/Sablage_int/${id}`)
    }
}