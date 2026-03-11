import api from "@/services/axiosInstance";

export const magicLinkAPI = async(email : string)=>{
  const {data} = await api.post(`/auth/magiclink`,{
    email
  },{withCredentials : true});
  return data;
}