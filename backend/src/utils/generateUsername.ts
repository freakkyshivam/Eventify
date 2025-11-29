import User from "../models/User.model";

 
export async function generateUniqueUsername(name: string, email: string): Promise<string> {
  
  const baseName = name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  const emailPart = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");

 
  const randomSuffix = () => Math.random().toString(36).substring(2, 6);
 
  let username = `${baseName}_${emailPart.slice(0, 3)}${randomSuffix()}`;
  let isTaken = await User.findOne({ username });

  while (isTaken) {
    username = `${baseName}_${emailPart.slice(0, 3)}${randomSuffix()}`;
    isTaken = await User.findOne({ username });
  }

  return username;
}
