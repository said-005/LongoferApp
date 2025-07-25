

import { customAxios } from '../Axios/axiosApi';
export const PeintureExtApi={
   getAll: ()=>{
        return  customAxios.get('api/Peinture_ext')
    },
    createPeinture_ext:(data)=>{
      return customAxios.post('api/Peinture_ext',data)
    },
    getPeinture_extById:(id)=>{
      return customAxios.get(`api/Peinture_ext/${id}`)
    },
    updatePeinture_ext:(id,data)=>{
      return customAxios.put(`api/Peinture_ext/${id}`,data)
    },
    deletePeinture_ext:(id)=>{
      return customAxios.delete(`api/Peinture_ext/${id}`)
    }
}