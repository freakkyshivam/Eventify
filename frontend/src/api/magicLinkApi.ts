import api from "@/services/axiosInstance";

export const magicLinkAPI = async(email : string)=>{
  try {
    const {data} = await api.post(`/api/auth/magiclink`,{
      email
    },{withCredentials : true});
    return data;
  } catch (error) {
    console.log("Magic link api error ", error );
  }
}