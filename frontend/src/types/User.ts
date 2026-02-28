
export interface loginType {
    identifiers : string,
    password : string
} 

export interface signupType {
    name : string
    email : string,
    password : string
} 

 
export interface User {
  id: string;
  name: string;
  email: string;
  role : 'attendee' | 'admin' | 'organizer';
  isAccountVerified : boolean;
  profileImage : string;
}

export type AuthSession = {
  user: User;
  access_token: string;
};