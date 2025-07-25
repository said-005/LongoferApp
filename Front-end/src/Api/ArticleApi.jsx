
import { customAxios } from '../Axios/axiosApi';
export const ArticleApi={
   getAll: ()=>{
        return  customAxios.get('api/Article')
    },
    createArticel:(data)=>{
      return customAxios.post('api/Article',data)
    },
    getArticleById:(id)=>{
      return customAxios.get(`api/Article/${id}`)
    },
    updateArticle:(id,data)=>{
      return customAxios.put(`api/Article/${id}`,data)
    },
    deleteArticle:(id)=>{
      return customAxios.delete(`api/Article/${id}`)
    }
}