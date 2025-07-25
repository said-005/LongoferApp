import { customAxios } from "../Axios/axiosApi"


export const DefautApi={
    getAll: ()=>{
        return  customAxios.get('api/Defaut')
    },
    createDefaut:(data)=>{
      return customAxios.post('api/Defaut',data)
    },
    getDefautById:(id)=>{
      return customAxios.get(`api/Defaut/${id}`)
    },
    updateDefaut:(id,data)=>{
      return customAxios.put(`api/Defaut/${id}`,data)
    },
    deleteDefaut:(id)=>{
      return customAxios.delete(`api/Defaut/${id}`)
    }
}