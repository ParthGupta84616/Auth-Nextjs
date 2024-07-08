import { Html } from 'next/document';
import nodemailer from 'nodemailer';

export const sendMail = async ({email, emailType , userId}:{email:string, emailType:string , userId:string} ) => {
    try {

      if(emailType === 'VERIFY') {}

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      
        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: email,
          subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
          // text : emailType === 'VERIFY' ? `Click on the link to verify your email: http://localhost:3000/verify/${userId}` : `Click on the link to reset your password: http://localhost:3000/reset-password/${userId}`,
          // text : emailType === 'VERIFY' ? `Click on the link to verify your email: ${process.env.CLIENT_URL}/verify/${userId}` : `Click on the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${userId}`,
          html : "<h1>Test</h1>"
        };
      
        return await transporter.sendMail(mailOptions);
      
      }
       catch (error: any) {
        throw new Error(error.message);
        
    }
}
