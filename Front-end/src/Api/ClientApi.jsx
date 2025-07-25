import { customAxios } from "../Axios/axiosApi"


export const ClientApi={
    getAll: ()=>{
        return  customAxios.get('api/Client')
    },
    createClient:(data)=>{
      return customAxios.post('api/Client',data)
    },
    getClientById:(id)=>{
      return customAxios.get(`api/Client/${id}`)
    },
    updateClient:(id,data)=>{
      return customAxios.put(`api/Client/${id}`,data)
    },
    deleteClient:(id)=>{
      return customAxios.delete(`api/Client/${id}`)
    }
}