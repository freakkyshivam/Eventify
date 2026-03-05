import api from "@/services/axiosInstance";
import type {eventI, EventApiResponse} from '@/types/Event';

export const getAllEvent = async (): Promise<eventI[]> => {
  try {
    const { data } = await api.get<EventApiResponse>(`/events`,{withCredentials:true});
  
    
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export interface Response {
  success : boolean,
  results : eventI
}

export const getEventBySlugApi = async (slug : string)=>{
  try {
    const { data } = await api.get<Response>(`/events/${slug}`,{withCredentials:true});
  
    return data;
  } catch (error) {
     console.error(error);
    throw error;
  }
}

