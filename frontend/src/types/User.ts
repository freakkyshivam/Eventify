
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
  token: string;
}
