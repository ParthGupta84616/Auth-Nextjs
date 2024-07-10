import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export const sendMail = async ({email, emailType , userId}:{email:string, emailType:string , userId:string} ) => {
    try  {
      const hashedToken = await bcrypt.hash(userId.toString(),10)

      if(emailType === 'VERIFY') {
        await User.findByIdAndUpdate(
          userId,{
          $set:{
            verificationToken : hashedToken,
            verificationTokenExpire : Date.now() + 3600000
          },
        }
        )
      }
      else if(emailType === 'RESET') {
        await User.findByIdAndUpdate(
          userId,{
            $set:{
            resetPasswordToken : hashedToken,
            resetPasswordTokenExpire : Date.now() + 3600000
          },
            
          }
        )
      }

      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "97b042e8354ab9",
          pass: "9701758e60aa34"
        }
      });
      
        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: email,
          subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
          html : emailType === "VERIFY" ? `<p>Click<a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
          to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}
          or copy and paste the link below in your browser
          <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
          </p>` : 
          `<p>Click<a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a>
          to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}
          or copy and paste the link below in your browser
          <br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
          </p>`
        };
      
        return await transport.sendMail(mailOptions);
      
      }
       catch (error: any) {
        throw new Error(error.message);
        
    }
}
