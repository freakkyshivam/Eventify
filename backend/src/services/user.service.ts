import db from '../db/db';
import Users from '../db/schema/user.model'
import {eq} from 'drizzle-orm'

export const findUserByEmail = async (email : string)=>{
    try {
    const [user] = await db.select()
    .from(Users)
    .where( eq(Users.email, email))
    return user;
    } catch (error) {
        console.error(error)
    }
}


export const findUserById = async (id : string)=>{
    try {
        const [user] = await db.select()
        .from(Users)
        .where(eq(Users.id, id))
        return user;
    } catch (error) {
        console.error(error)
    }
}
 