import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
});

// Price IDs from your Stripe Dashboard
const PRICE_IDS = {
  basic: 'price_basic_monthly',
  pro: 'price_pro_monthly',
  enterprise: 'price_enterprise_monthly',
} as const;

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { planId, userId, email } = req.body;

  try {
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[planId as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Update user's subscription status in your database
        await updateUserSubscription(session);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle successful payment
        await handleSuccessfulPayment(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment
        await handleFailedPayment(invoice);
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    const error = err as Error;
    console.error('Error handling webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

async function updateUserSubscription(session: Stripe.Checkout.Session) {
  const { userId, planId } = session.metadata || {};
  if (!userId || !planId) return;

  // Update user's subscription in your database
  // This is where you would update the user's plan in your database
  console.log(`Updating subscription for user ${userId} to plan ${planId}`);
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  // Handle successful payment
  // e.g., Update payment history, send confirmation email
  console.log(`Payment successful for invoice ${invoice.id}`);
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  // Handle failed payment
  // e.g., Notify user, update status
  console.log(`Payment failed for invoice ${invoice.id}`);
}
