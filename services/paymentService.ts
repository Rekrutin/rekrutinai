
import { PlanType } from '../types';

/**
 * MOCK PAYMENT SERVICE
 * Simulates integration with a payment provider like Midtrans, Xendit, or Stripe.
 */

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

export const createCheckoutSession = async (plan: PlanType, userId: string): Promise<CheckoutSession> => {
  // In a real app, this would call your backend API endpoint (e.g. /api/billing/create-checkout-session)
  // which would then communicate with the payment provider.
  
  console.log(`Creating checkout session for user ${userId} choosing plan ${plan}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
        checkoutUrl: `/billing/checkout?plan=${plan}` // Mock redirect URL
      });
    }, 1000);
  });
};

export const verifyPayment = async (sessionId: string): Promise<boolean> => {
  // In a real app, this would verify the payment status with the provider
  console.log(`Verifying payment for session ${sessionId}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;
      resolve(isSuccess);
    }, 1500);
  });
};
