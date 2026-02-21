import slugify from "slugify";
import crypto from "crypto";

export function generateSlug(title: string) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,  
    trim: true,
  });

  const uniqueId = crypto.randomBytes(3).toString("hex"); 
  

  return `${baseSlug}-${uniqueId}`;
}
