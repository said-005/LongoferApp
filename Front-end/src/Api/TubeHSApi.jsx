import { customAxios } from "../Axios/axiosApi"


export const TubeHSApi={
    getAll: ()=>{
        return  customAxios.get('api/Tube_HS')
    },
    createTube_HS:(data)=>{
      return customAxios.post('api/Tube_HS',data)
    },
    getTube_HSById:(id)=>{
      return customAxios.get(`api/Tube_HS/${id}`)
    },
    updateTube_HS:(id,data)=>{
      return customAxios.put(`api/Tube_HS/${id}`,data)
    },
    deleteTube_HS:(id)=>{
      return customAxios.delete(`api/Tube_HS/${id}`)
    }
}