const nodemailer = require("nodemailer");

// Create transporter configuration
const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

/**
 * Sends a verification email containing a 6-digit OTP code.
 * If SMTP credentials are not configured, prints the OTP to the console.
 * 
 * @param {string} email - The user's email address
 * @param {string} otp - The generated 6-digit OTP
 */
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"OMMA Studio" <${user}>`,
    to: email,
    subject: "Verify Your Email",
    text: `Hello,

Your verification code is: ${otp}

This code will expire in 5 minutes.

If you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 40px 20px; text-align: center;">
        <div style="max-width: 480px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 40px 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <div style="margin-bottom: 24px; display: inline-block; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(188, 0, 255, 0.1) 100%); border: 1px solid rgba(0, 240, 255, 0.2);">
            <span style="font-size: 24px;">⚡</span>
          </div>
          <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">Verify Your Email</h2>
          <p style="margin: 0 0 32px 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">Use the verification code below to log in to your OMMA account.</p>
          
          <div style="background: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 32px; letter-spacing: 0.15em;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #00F0FF; text-shadow: 0 0 10px rgba(0, 240, 255, 0.2);">${otp}</span>
          </div>
          
          <p style="margin: 0 0 24px 0; font-size: 12px; color: #71717a; line-height: 1.5;">This code will expire in <b>5 minutes</b>.</p>
          <div style="border-top: 1px solid #27272a; padding-top: 24px;">
            <p style="margin: 0; font-size: 11px; color: #52525b; line-height: 1.5;">If you did not request this code, you can safely ignore this email.</p>
          </div>
        </div>
      </div>
    `
  };

  const isGmailConfigured = 
    user && 
    user !== "your_gmail_address_here@gmail.com" &&
    user !== "yourgmail@gmail.com" &&
    pass && 
    pass !== "your_gmail_app_password_here" &&
    pass !== "your_app_password";

  if (!isGmailConfigured) {
    console.log("\n==================================================");
    console.log(`[SMTP SIMULATOR] Email verification details:`);
    console.log(`To:  ${email}`);
    console.log(`OTP: ${otp}`);
    console.log("==================================================\n");
    return {
      simulated: true,
      message: "Gmail SMTP not configured. OTP printed to console."
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email} (MessageId: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error("Nodemailer SMTP Delivery Failed. Details:", error.message);
    console.log("\n==================================================");
    console.log(`[SMTP FALLBACK] OTP code for ${email} is: ${otp}`);
    console.log("==================================================\n");
    return {
      simulated: true,
      message: `Email delivery failed: ${error.message}. OTP printed to console.`
    };
  }
};

module.exports = {
  transporter,
  sendVerificationEmail
};
