export interface IUser {
  name: string;
  id: string;
  role:string;
}

export interface JwtUserPayload {
  id: string;
  name: string;
  role: string;
}