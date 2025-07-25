import { customAxios } from "../Axios/axiosApi"


export const OfApi={
    getAll: ()=>{
        return  customAxios.get('api/OF')
    },
    createOF:(data)=>{
      return customAxios.post('api/OF',data)
    },
    getOFById:(id)=>{
      return customAxios.get(`api/OF/${id}`)
    },
    updateOF:(id,data)=>{
      return customAxios.put(`api/OF/${id}`,data)
    },
    deleteOF:(id)=>{
      return customAxios.delete(`api/OF/${id}`)
    }
}