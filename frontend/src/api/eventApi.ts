import api from "@/services/axiosInstance";
import type { EventApiResponse, eventI } from '@/types/Event';

export const getAllEvent = async (): Promise<eventI[]> => {
  try {
    const { data } = await api.get<EventApiResponse>(`/api/events`,{withCredentials:true});
    return data.result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getUserAllJoinedEvent = async (): Promise<eventI[]> =>{
    try {
      const { data } = await api.get<EventApiResponse>(`/api/user/events`,{withCredentials:true});
      console.log(data);
      
    return data.result
    } catch (error) {
    console.error(error);
    throw error;
  }
}