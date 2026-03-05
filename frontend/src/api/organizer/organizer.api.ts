import api from "@/services/axiosInstance";

export const getAllOrganizerEventsApi = async ()=>{
    try {
        const {data} = await api.get('/organizer/events')
        
        return data;
    } catch (error) {
        console.log(error);
        
    }
}
export const RecentRegOrgApi = async ()=>{
    try {
         const {data} = await api.get('/organizer/events/registration')
        
        return data;
    } catch (error) {
      console.log(error);   
    }
}