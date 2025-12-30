// Fake SMS sender for OTP
export async function sendSmsOtp(mobile: string, code: string) {
  console.log(`[FAKE SMS] Sending OTP ${code} to ${mobile}`);
  // In real implementation, integrate with SMS provider
  return true;
}
