import { Registration } from '../models/Registration.js';
import { generateRegistrationId } from '../utils/generateRegistrationId.js';
import { verifyWebhookSignature } from '../config/razorpay.js';

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body;

    // Verify webhook signature
    const isValid = verifyWebhookSignature(JSON.stringify(rawBody), signature);
    if (!isValid) {
      console.warn('[Webhook] Invalid Razorpay webhook signature rejected.');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Webhook] Received Razorpay event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.order?.entity?.id;

      if (orderId) {
        const registration = await Registration.findOne({ razorpayOrderId: orderId });

        // Idempotency: skip if already processed as PAID
        if (registration && registration.paymentStatus !== 'PAID') {
          // Generate unique registration ID if not present
          if (!registration.registrationId) {
            let uniqueRegId = '';
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 10) {
              uniqueRegId = generateRegistrationId();
              const existing = await Registration.findOne({ registrationId: uniqueRegId });
              if (!existing) isUnique = true;
              attempts++;
            }
            registration.registrationId = uniqueRegId;
          }

          registration.paymentStatus = 'PAID';
          registration.razorpayPaymentId = paymentEntity?.id || registration.razorpayPaymentId;
          registration.paidAt = new Date();
          await registration.save();
          console.log(`[Webhook] Registration ${registration.registrationId} marked as PAID via webhook.`);
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await Registration.findOneAndUpdate(
          { razorpayOrderId: orderId, paymentStatus: 'PENDING' },
          { paymentStatus: 'FAILED' }
        );
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(500).json({ error: error.message });
  }
};
