import api from "@/services/axiosInstance";

export const fetchUser = async()=>{
    try {
        const {data} = await api.get('/api/me');
        // console.log(data);
        
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const handleLogout = async ()=>{
    try {
        await localStorage.clear()
        await api.get('/api/auth/logout');
        console.log("Logout successfull");
        
    } catch (error) {
        console.error(error)
    }
}

export const organizerRequestApi = async ()=>{
    try {
       const {data} = await api.post('/api/user/orgainzer-request',{},{
            withCredentials : true
        })
        console.log(data);
        
        return data;
    } catch (error) {
        console.error(error)
    }
}