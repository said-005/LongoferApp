import { customAxios } from "../Axios/axiosApi"


export const MatiereApi={
    getAll: ()=>{
        return  customAxios.get('api/Matiere')
    },
    createMatiere:(data)=>{
      return customAxios.post('api/Matiere',data)
    },
    getMatiereById:(id)=>{
      return customAxios.get(`api/Matiere/${id}`)
    },
    updateMatiere:(id,data)=>{
      return customAxios.put(`api/Matiere/${id}`,data)
    },
    deleteMatiere:(id)=>{
      return customAxios.delete(`api/Matiere/${id}`)
    }
}