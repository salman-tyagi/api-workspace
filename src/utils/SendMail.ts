import sendgrid from '@sendgrid/mail';

const { SENDGRID_API_KEY, MAIL_FROM } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY!);

interface Options {
  name: string;
  email: string;
  link?: string;
}

class SendMail {
  static async verifyEmail({ name, email, link }: Options) {
    try {
      const mailOptions = {
        to: email,
        from: MAIL_FROM!,
        subject: 'Welcome to the Workspace',
        html: `
          <div>
            <h3>Welcome, ${name}</h3>
            <p>We're glad to have a user like you.</p>
            <p>
              Please verify your email by clicking <a href="${link}">here</a>.
            </p>
            <p>Hope, you'll enjoy our services.</p>

            <h6>Regards,<h6>
            <p>Workspace</p>
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
