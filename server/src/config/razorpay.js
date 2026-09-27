import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_CheckmateArenaDemoKey';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_key_demo123';
const webhook_secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'checkmate_webhook_secret_secure_999';

export const isDemoMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('DemoKey');

export const razorpayInstance = !isDemoMode
  ? new Razorpay({
      key_id,
      key_secret,
    })
  : null;

/**
 * Verify Razorpay Checkout Signature
 */
export function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (isDemoMode) {
    // In sandbox demo mode with mock keys, verify test signature prefix or mock structure
    return (
      signature &&
      (signature.startsWith('mock_sig_') || signature.length >= 16)
    );
  }

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

/**
 * Verify Razorpay Webhook Signature
 */
export function verifyWebhookSignature(rawBody, signature) {
  if (isDemoMode) {
    return true;
  }
  const expectedSignature = crypto
    .createHmac('sha256', webhook_secret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}

export { key_id, key_secret, webhook_secret };
