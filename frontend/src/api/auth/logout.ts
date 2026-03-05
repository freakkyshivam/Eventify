import api from "@/services/axiosInstance";

export const handleLogout = async ()=>{
    try {
        await localStorage.clear()
        await api.get('/auth/logout');
        console.log("Logout successfull");
        window.location.reload();
    } catch (error) {
        console.error(error)
    }
}