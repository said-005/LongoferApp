import { customAxios } from "../Axios/axiosApi"


export const StatutApi={
    getAll: ()=>{
        return  customAxios.get('api/Statut')
    },
    createStatut:(data)=>{
      return customAxios.post('api/Statut',data)
    },
    getStatuById:(id)=>{
      return customAxios.get(`api/Statut/${id}`)
    },
    updateStatut:(id,data)=>{
      return customAxios.put(`api/Statut/${id}`,data)
    },
    deleteStatut:(id)=>{
      return customAxios.delete(`api/Statut/${id}`)
    }
}