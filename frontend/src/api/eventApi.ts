import api from "@/services/axiosInstance";
import type { UserEventApiResponse ,eventI, EventApiResponse} from '@/types/Event';

export const getAllEvent = async (): Promise<eventI[]> => {
  try {
    const { data } = await api.get<EventApiResponse>(`/api/events`,{withCredentials:true});
    console.log(data);
    
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getUserAllJoinedEvent = async (): Promise<UserEventApiResponse[]> =>{
    try {
      const { data } = await api.get<UserEventApiResponse>(`/api/user/events`,{withCredentials:true});
      console.log(data);
      
    return data.results
    } catch (error) {
    console.error(error);
    throw error;
  }
}