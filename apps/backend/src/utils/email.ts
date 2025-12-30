// Fake email sender for OTP
export async function sendEmailOtp(email: string, code: string) {
  console.log(`[FAKE EMAIL] Sending OTP ${code} to ${email}`);
  // In real implementation, integrate with email provider
  return true;
}
