

import { customAxios } from '../Axios/axiosApi';
export const PeintureIntApi={
   getAll: ()=>{
        return  customAxios.get('api/Peinture_int')
    },
    createPeinture_intt:(data)=>{
      return customAxios.post('api/Peinture_int',data)
    },
    getPeinture_inttById:(id)=>{
      return customAxios.get(`api/Peinture_int/${id}`)
    },
    updatePeinture_int:(id,data)=>{
      return customAxios.put(`api/Peinture_int/${id}`,data)
    },
    deletePeinture_intt:(id)=>{
      return customAxios.delete(`api/Peinture_int/${id}`)
    }
}