import da from "zod/v4/locales/da.js";
import { sendMail } from "../../utils/sendmail";
import { accountVerificationTemplate, loginMagicLinkTemplate, welcomeTemplate } from "./mail.template";
import { email } from "zod";

export const sendWelcomeMail = async (
email : string,
name : string
)=>{

   const template =  welcomeTemplate({name});
    await sendMail(
         {
            userEmail : email,
            subject : template.subject,
            text : template .subject,
            html : template.html
         }
    )
}

export const sendMagicLinkMail = async(
   email : string,
   magicLink : string
)=>{
   const template = accountVerificationTemplate({magicLink});

   await sendMail({
      userEmail : email,
      subject : template.subject,
      text : template.text,
      html : template.html
   })
}

export const sendLoginMagicLink = async(
   email : string,
   magicLink : string,
   name : string
)=>{
   const template = loginMagicLinkTemplate({name, magicLink});

   await sendMail({
      userEmail : email,
      subject : template.subject,
      text : template.text,
      html : template.html
   })
}