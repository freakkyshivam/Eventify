import axios from 'axios'
 
import type { EventApiResponse, eventI } from '@/types/Event';

const BASE_URL = import.meta.env.VITE_BACKEND_DEV_URL;


export const magicLinkAPI = async(email : string)=>{
  try {
    const {data} = await axios.post(`${BASE_URL}/api/auth/magiclink`,{
      email
    },{withCredentials : true});
    return data;
  } catch (error) {
    console.log("Magic link api error ", error );
  }
}
 

 export const getAllEvent = async (): Promise<eventI[]> => {
  try {
    const { data } = await axios.get<EventApiResponse>(`${BASE_URL}/api/events`,{withCredentials:true});
    return data.result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
  
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
