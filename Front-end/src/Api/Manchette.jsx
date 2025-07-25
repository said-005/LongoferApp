import { customAxios } from "../Axios/axiosApi"


export const ManchetteApi={
    getAll: ()=>{
        return  customAxios.get('api/Manchette')
    },
    createManchette:(data)=>{
      return customAxios.post('api/Manchette',data)
    },
    getManchetteById:(id)=>{
      return customAxios.get(`api/Manchette/${id}`)
    },
    updateManchette:(id,data)=>{
      return customAxios.put(`api/Manchette/${id}`,data)
    },
    deleteManchette:(id)=>{
      return customAxios.delete(`api/Manchette/${id}`)
    }
}