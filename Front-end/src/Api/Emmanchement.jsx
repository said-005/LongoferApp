import { customAxios } from "../Axios/axiosApi"


export const EmmanchementApi={
    getAll: ()=>{
        return  customAxios.get('api/Emmanchement')
    },
    createEmmanchement:(data)=>{
      return customAxios.post('api/Emmanchement',data)
    },
    getEmmanchementById:(id)=>{
      return customAxios.get(`api/Emmanchement/${id}`)
    },
    updateEmmanchement:(id,data)=>{
      return customAxios.put(`api/Emmanchement/${id}`,data)
    },
    deleteEmmanchement:(id)=>{
      return customAxios.delete(`api/Emmanchement/${id}`)
    }
}