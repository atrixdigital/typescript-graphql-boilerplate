import * as nodemailer from "nodemailer";

interface ArgsData {
  name: string;
  email: string;
  message: string;
}

// async..await is not allowed in global scope, must use a wrapper
export default async ({ name, email, message }: ArgsData): Promise<boolean> => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let account = await nodemailer.createTestAccount();

  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "osama.ahmed.profile@gmail.com", // generated ethereal user
        pass: "osama6903848" // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Osama Ahmed Profile" <osama.ahmed.profile@gmail.com>', // sender address
      to: "osama.ahmed220@gmail.com", // list of receivers
      subject: `Contact From ${name}`, // Subject line
      text: `
        Name: ${name}\n
        Email: ${email}\n
        Message: ${message}
    `, // plain text body
      html: `
        <div>
            <div><b>Name</b>: ${name}</div>
            <div><b>Email</b>: ${email}</div>
            <div><b>Message</b>: ${message}</div>
        </div>
    ` // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
