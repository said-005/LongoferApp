

import { customAxios } from '../Axios/axiosApi';
export const SablageEXTApi={
   getAll: ()=>{
        return  customAxios.get('api/Sablage_ext')
    },
    createSablage_extt:(data)=>{
      return customAxios.post('api/Sablage_ext',data)
    },
    getSablage_extById:(id)=>{
      return customAxios.get(`api/Sablage_ext/${id}`)
    },
    updateSablage_ext:(id,data)=>{
      return customAxios.put(`api/Sablage_ext/${id}`,data)
    },
    deleteSablage_ext:(id)=>{
      return customAxios.delete(`api/Sablage_ext/${id}`)
    }
}