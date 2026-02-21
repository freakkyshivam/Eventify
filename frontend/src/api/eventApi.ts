import api from "@/services/axiosInstance";
import type { EventApiResponse, EventFormData } from '@/types/Event';

export const getAllEvent = async (): Promise<EventFormData[]> => {
  try {
    const { data } = await api.get<EventApiResponse>(`/api/events`,{withCredentials:true});
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getUserAllJoinedEvent = async (): Promise<EventApiResponse[]> =>{
    try {
      const { data } = await api.get<EventApiResponse>(`/api/user/events`,{withCredentials:true});
      console.log(data);
      
    return data.results
    } catch (error) {
    console.error(error);
    throw error;
  }
}