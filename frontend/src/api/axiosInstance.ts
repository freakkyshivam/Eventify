import axios from 'axios'
import type { loginType,signupType } from '@/types/User';

const BASE_URL = import.meta.env.VITE_BACKEND_DEV_URL;
 


export const loginApi = async ({identifiers, password}:loginType)=>{
    console.log(identifiers);
    console.log(password);
    
    
    try {
        const {data} = await axios.post(`${BASE_URL}/api/auth/login`,{identifiers,password})
        return data;
    } catch (error) {
        console.error(error)
    }
}


export const signupApi = async({name, email,password}:signupType)=>{
    try {
        const {data} = await axios.post(`${BASE_URL}/api/auth/register`,{name,email,password})
        return data;
    } catch (error) {
         console.error(error)
    }
}