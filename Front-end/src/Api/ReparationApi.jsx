

import { customAxios } from '../Axios/axiosApi';
export const ReparationApi={
   getAll: ()=>{
        return  customAxios.get('api/Reparation')
    },
    createReparation:(data)=>{
      return customAxios.post('api/Reparation',data)
    },
    getReparationById:(id)=>{
      return customAxios.get(`api/Reparation/${id}`)
    },
    updateReparation:(id,data)=>{
      return customAxios.put(`api/Reparation/${id}`,data)
    },
    deleteReparation:(id)=>{
      return customAxios.delete(`api/Reparation/${id}`)
    }
}