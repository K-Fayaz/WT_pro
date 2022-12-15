const sendgrid = require('@sendgrid/mail');

// set sendgrid api
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email)=>{
  const msg = {
     to: email,
     from: 'kfayaz1407@gmail.com',
     subject: 'You request to reset password!',
     html: `
        <h3>Hey here is your reset password link!</h3>
        <a style="border-radius: 2px; text-decoration: none; color: white; background: red; padding: 10px 20px;" href="http://localhost:3000/signup/">Cinfirm Email</a>
     `,
  }

  try{
    let res = await sendgrid.send(msg);
    return res;
  }
  catch(err){
    return Error(err);
  }
}

module.exports = sendEmail;
