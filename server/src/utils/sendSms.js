/**
 * Universal SMS and OTP Dispatcher for NMC Admin
 * Supports:
 * 1. Fast2SMS (Indian SMS Gateway)
 * 2. Twilio (Global SMS API)
 * 3. Custom SMS Webhook / Provider URL
 * 4. Fallback server logging & multi-channel notification
 */

export const sendSmsOtp = async ({ phone, otp, purpose = 'Admin Password Reset' }) => {
  const cleanPhone = (phone || '+91 7069826082').replace(/\s+/g, '');
  const message = `Your NMC Admin verification OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
  const tenDigit = cleanPhone.replace(/^(\+91|91)/, '');

  console.log('\n============================================================');
  console.log(`🔐 [NMC SMS OTP DISPATCHER]`);
  console.log(`📱 Destination Phone : ${cleanPhone}`);
  console.log(`🔢 6-Digit OTP Code : ${otp}`);
  console.log(`⏳ Expiration       : 10 minutes`);
  console.log(`📝 Purpose          : ${purpose}`);
  console.log(`⏰ Timestamp        : ${new Date().toISOString()}`);
  console.log('============================================================\n');

  // 1. Fast2SMS (India Bulk/OTP SMS)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: tenDigit,
        }),
      });
      const data = await response.json();
      console.log('Fast2SMS response:', data);
      return { success: true, provider: 'fast2sms', data };
    } catch (err) {
      console.error('Fast2SMS error:', err.message);
    }
  }

  // 2. Twilio SMS
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const creds = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const params = new URLSearchParams();
      params.append('To', cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`);
      params.append('From', process.env.TWILIO_PHONE_NUMBER);
      params.append('Body', message);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await response.json();
      console.log('Twilio SMS response:', data);
      return { success: true, provider: 'twilio', data };
    } catch (err) {
      console.error('Twilio SMS error:', err.message);
    }
  }

  // 3. Custom SMS Webhook
  if (process.env.SMS_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp, message }),
      });
      const data = await response.json().catch(() => ({}));
      return { success: true, provider: 'custom_webhook', data };
    } catch (err) {
      console.error('SMS webhook error:', err.message);
    }
  }

  // 4. Default Development / Fallback
  return {
    success: true,
    provider: 'console_fallback',
    phone: cleanPhone,
    message: 'OTP generated and logged to secure server terminal',
  };
};
