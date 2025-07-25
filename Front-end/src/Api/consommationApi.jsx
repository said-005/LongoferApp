import { customAxios } from "../Axios/axiosApi"


export const ConsommaationApi={
    getAll: ()=>{
        return  customAxios.get('api/Consommation')
    },
    createConsommation:(data)=>{
      return customAxios.post('api/Consommation',data)
    },
    getConsommationById:(id)=>{
      return customAxios.get(`api/Consommation/${id}`)
    },
    updateConsommation:(id,data)=>{
      return customAxios.put(`api/Consommation/${id}`,data)
    },
    deleteConsommation:(id)=>{
      return customAxios.delete(`api/Consommation/${id}`)
    }
}