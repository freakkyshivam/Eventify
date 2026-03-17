import api from "@/services/axiosInstance";

export const fetchAllUser = async ()=>{
    try {
        const {data} = await api.get('/admin/users')
        return data;
    } catch (error) {
        console.error(error)
    }
}
export const fetchAllOrganizerRequest = async ()=>{
    try {
        const {data} = await api.get('/admin/organizer-request')
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const approveOrganizerRequest = async (id : string)=>{
    try {
        const {data} = await api.patch(`/admin/organizer-request/${id}/approve`)
        return data;
    } catch (error : any) {
        console.error(error);
        return error.response.data;
    }
}
export const rejectOrganizerRequest = async (id: string)=>{
    try {
        const {data} = await api.patch(`/admin/organizer-request/${id}/reject`)
        return data;
    } catch (error : any) {
        console.error(error);
        return error.response.data;
    }
}

export const updateUserRole = async (userId: string, role: string) => {
    try {
        const { data } = await api.patch(`/admin/update-role/${userId}`, { role });
        return data;
    } catch (error: any) {
        console.error(error);
        return error.response?.data || { success: false, msg: "Failed to update role" };
    }
}

export const fetchAllRegistrations = async () => {
    try {
        const { data } = await api.get('/admin/events/registration');
        return data;
    } catch (error: any) {
        console.error(error);
        return error.response?.data || { success: false, msg: "Failed to fetch registrations" };
    }
}