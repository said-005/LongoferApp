import { customAxios } from "../Axios/axiosApi"


export const MachineApi={
    getAll: ()=>{
        return  customAxios.get('api/Machine')
    },
    createMachine:(data)=>{
      return customAxios.post('api/Machine',data)
    },
    getMachineById:(id)=>{
      return customAxios.get(`api/Machine/${id}`)
    },
    updateMachine:(id,data)=>{
      return customAxios.put(`api/Machine/${id}`,data)
    },
    deleteMachine:(id)=>{
      return customAxios.delete(`api/Machine/${id}`)
    }
}