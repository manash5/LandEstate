import nodemailer from 'nodemailer';

// Configure Nodemailer with YOUR app's email credentials
export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:   process.env.EMAILUSER, 
    pass:  process.env.EMAILPASS
  }
});

// When user logs in
export function sendLoginNotification(userEmail) {
  return transporter.sendMail({
    from: 'notifications@yourdomain.com',
    to: userEmail,
    subject: 'Successful Login',
    text: 'You just logged in to our service'
  });
}

// Send a beautiful welcome email to new users
export function sendWelcomeEmail(userEmail, userName) {
  return transporter.sendMail({
    from: 'welcome@landestate.com',
    to: userEmail,
    subject: 'Welcome to LandEstate',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif; background: #ffffff; padding: 60px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #f0f4f7; box-shadow: 0 8px 32px rgba(15, 109, 148, 0.08); overflow: hidden;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fffe 100%); padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #f0f4f7;">
            <h1 style="margin: 0 0 8px 0; font-size: 42px; font-weight: 700; letter-spacing: -1px; line-height: 1;">
              <span style="color: #0F6D94;">Land</span><span style="color: #00B4D8;">Estate</span>
            </h1>
            <p style="margin: 0; color: #0F6D94; font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; opacity: 0.8;">Real Estate Management</p>
          </div>

          <!-- Welcome Section -->
          <div style="padding: 48px 40px 40px 40px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="margin: 0 0 12px 0; color: #0F6D94; font-size: 28px; font-weight: 600; line-height: 1.3;">
                Welcome to Your Journey 🎉
              </h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
                Your real estate management experience starts here
              </p>
            </div>

            <!-- Personal Greeting -->
            <div style="margin-bottom: 32px;">
              <p style="margin: 0 0 16px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Hello ${userName ? userName : 'there'}! 👋
              </p>
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.7;">
                We're thrilled to welcome you to <strong style="color: #0F6D94;">LandEstate</strong> – your comprehensive platform designed to simplify property management and empower your real estate journey.
              </p>
            </div>

            <!-- Features Section -->
            <div style="background: linear-gradient(135deg, #f0fdff 0%, #e6f9ff 100%); border-radius: 16px; border: 1px solid #b3f0ff; padding: 28px; margin-bottom: 32px;">
              <h3 style="margin: 0 0 20px 0; color: #0F6D94; font-size: 18px; font-weight: 600;">
                ✨ What makes us special:
              </h3>
              <div style="space-y: 12px;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="color: #00B4D8; margin-right: 8px; font-weight: 600;">•</span>
                  <span style="color: #374151; font-size: 15px; line-height: 1.6;">Effortlessly list, manage, and discover properties</span>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="color: #00B4D8; margin-right: 8px; font-weight: 600;">•</span>
                  <span style="color: #374151; font-size: 15px; line-height: 1.6;">Secure and seamless transactions</span>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="color: #00B4D8; margin-right: 8px; font-weight: 600;">•</span>
                  <span style="color: #374151; font-size: 15px; line-height: 1.6;">Real-time analytics and insights</span>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                  <span style="color: #00B4D8; margin-right: 8px; font-weight: 600;">•</span>
                  <span style="color: #374151; font-size: 15px; line-height: 1.6;">Modern, intuitive interface</span>
                </div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="color: #00B4D8; margin-right: 8px; font-weight: 600;">•</span>
                  <span style="color: #374151; font-size: 15px; line-height: 1.6;">Dedicated support team</span>
                </div>
              </div>
            </div>

            <!-- Support Message -->
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Have questions? Just reply to this email – we're here to help! 💬
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #f0f4f7;">
            <p style="margin: 0; color: #9ca3af; font-size: 13px;">
              © ${new Date().getFullYear()} LandEstate. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `
  });
}