import { setGlobalOptions } from 'firebase-functions'
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import Stripe from 'stripe'

admin.initializeApp()

setGlobalOptions({ maxInstances: 10 })

dotenv.config()

type BookingMetadata = {
  tourId: string
  departureDate: string
  people: number
}

export const createPaymentIntent = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in to checkout.')
  }

  const { amount, userId, cartItems } = request.data as {
    amount: number
    userId: string
    cartItems: BookingMetadata[]
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new HttpsError('invalid-argument', 'A valid amount is required.')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      userId,
      cartItems: JSON.stringify(cartItems),
    },
  })

  return { clientSecret: paymentIntent.client_secret }
})

export const stripeWebhook = onRequest(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err}`)
    return
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const { userId, cartItems: cartItemsJson } = paymentIntent.metadata
    const cartItems: BookingMetadata[] = JSON.parse(cartItemsJson)

    const db = admin.firestore()
    await Promise.all(cartItems.map(item =>
      db.collection('bookings').add({
        createdAt: new Date(),
        tourId: item.tourId,
        bookingUserId: userId,
        departureDate: item.departureDate,
        people: item.people,
      })
    ))
  }

	if (event.type === 'payment_intent.payment_failed') {
		const paymentIntent = event.data.object as Stripe.PaymentIntent
		console.error(`Payment failed for intent ${paymentIntent.id}: ${paymentIntent.last_payment_error?.message}`)
	}

  res.json({ received: true })
})

export const migrateNameToDisplayName = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in.')
  }

  const db = admin.firestore()
  const snapshot = await db.collection('users').get()
  
  const migrations = snapshot.docs
    .filter(doc => 'name' in doc.data())
    .map(doc => doc.ref.update({
      displayName: doc.data().name,
      name: FieldValue.delete(),
    }))

  await Promise.all(migrations)
  return { migrated: migrations.length }
})