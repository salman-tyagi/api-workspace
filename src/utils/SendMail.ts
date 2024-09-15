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

            <h4>Regards,<h4>
            <h4>Workspace</h4>
          </div>
        `
      };

      await sendgrid.send(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  static async resetPasswordMail({ name, email, link }: Options) {
    try {
      const mailOptions = {
        to: email,
        from: MAIL_FROM!,
        subject: 'Your password reset link. Expires in 10 minutes',
        html: `
          <div>
            <h3>Hi, ${name}</h3>
            <p>Please click <a href="${link}">here</a> to reset your password.</p>
            <p>If not, please ignore this email.</p>

            <h4>Regards,<h4>
            <h4>Workspace</h4>
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
