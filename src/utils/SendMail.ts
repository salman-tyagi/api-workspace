import sendgrid from '@sendgrid/mail';

const { SENDGRID_API_KEY, MAIL_FROM } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY!);

interface User {
  name: string;
  email: string;
}

class SendMail {
  static async welcomeMail({ name, email }: User) {
    try {
      const mailOptions = {
        to: email,
        from: MAIL_FROM!,
        subject: 'Welcome to the Workspace',
        html: `
          <div>
            <h3>Welcome to the Workspace, ${name}</h3>
            <p>We're glad to have a user like you. Hope, you'll enjoy our services.</p>
          </div>
        `
      };

      await sendgrid.send(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}

export default SendMail;
