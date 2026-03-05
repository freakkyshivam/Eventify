import api from "@/services/axiosInstance";

import type { UserEventApiResponse  , apiResponse} from '@/types/Event';

export const fetchUser = async()=>{
    try {
        const {data} = await api.get('/me');
        // console.log(data);
        
        return data;
    } catch (error) {
        console.error(error);
    }
}



export const organizerRequestApi = async ()=>{
    try {
       const {data} = await api.post('/user/orgainzer-request',{},{
            withCredentials : true
        })
        console.log(data);
        
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getUserAllJoinedEvent = async (): Promise<
  UserEventApiResponse["results"]
> => {
  try {
    const { data } = await api.get<UserEventApiResponse>(
      `/user/events`,
      { withCredentials: true }
    );
 

    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserAllTickets = async ():Promise<apiResponse>=>{
  try {
    const {data} = await api.get<apiResponse>('/user/events/tickets',{withCredentials : true});

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}