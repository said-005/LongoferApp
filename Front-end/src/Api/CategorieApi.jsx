

import { customAxios } from '../Axios/axiosApi';
export const CategorieApi={
   getAll: ()=>{
        return  customAxios.get('api/Categorie')
    },
    createCategorie:(data)=>{
      return customAxios.post('api/Categorie',data)
    },
    getCategorieById:(id)=>{
      return customAxios.get(`api/Categorie/${id}`)
    },
    updateCategorie:(id,data)=>{
      return customAxios.put(`api/Categorie/${id}`,data)
    },
    deleteCategorie:(id)=>{
      return customAxios.delete(`api/Categorie/${id}`)
    }
}