import Razorpay from 'razorpay'
import crypto from 'crypto'
import { upgradePlan, getUserPlan } from '../queries/subscriptionQueries.js'

const PLANS = {
  premium_monthly: { label: 'Premium Monthly', durationDays: 30,  amount: 29900  }, // paise (₹299)
  premium_yearly:  { label: 'Premium Yearly',  durationDays: 365, amount: 249900 }, // paise (₹2499)
}

function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret || /^your-/i.test(keyId)) {
    throw new Error('Razorpay keys not configured in .env')
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

// POST /api/subscription/create-order
export async function createOrderHandler(req, res, next) {
  try {
    const { plan } = req.body
    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan', data: null })
    }

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount:   PLANS[plan].amount,
      currency: 'INR',
      notes:    { userId: req.user.id, plan },
    })

    return res.json({
      success: true,
      message: 'Order created',
      data: {
        orderId:   order.id,
        amount:    order.amount,
        currency:  order.currency,
        keyId:     process.env.RAZORPAY_KEY_ID,
        plan,
        planLabel: PLANS[plan].label,
      },
    })
  } catch (error) { next(error) }
}

// POST /api/subscription/verify-payment
export async function verifyPaymentHandler(req, res, next) {
  try {
    const { plan, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!plan || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields', data: null })
    }
    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan', data: null })
    }

    // Verify HMAC-SHA256 signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const expected  = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed — invalid signature',
        data: null,
      })
    }

    const days      = PLANS[plan].durationDays
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    const user      = await upgradePlan(req.user.id, 'premium', expiresAt)
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null })

    console.log(`[Legacy Vault] Plan upgraded via Razorpay: user=${req.user.id} plan=${plan} payment=${razorpay_payment_id}`)

    return res.json({
      success: true,
      message: `Upgraded to ${PLANS[plan].label}`,
      data: { ...user, paymentId: razorpay_payment_id },
    })
  } catch (error) { next(error) }
}

// POST /api/subscription/manual-upgrade  (screenshot-based payment)
export async function manualUpgradeHandler(req, res, next) {
  try {
    const { plan } = req.body
    const validPlans = ['premium_monthly', 'premium_yearly']
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan', data: null })
    }
    const days = plan === 'premium_yearly' ? 365 : 30
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    const user = await upgradePlan(req.user.id, 'premium', expiresAt)
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null })
    console.log(`[Legacy Vault] Manual upgrade: user=${req.user.id} plan=${plan}`)
    return res.json({ success: true, message: 'Upgraded to Premium', data: user })
  } catch (error) { next(error) }
}

// GET /api/subscription
export async function getPlanHandler(req, res, next) {
  try {
    const info = await getUserPlan(req.user.id)
    const plan = info?.planExpiresAt && new Date(info.planExpiresAt) < new Date()
      ? 'free'
      : (info?.plan || 'free')
    return res.json({ success: true, message: 'OK', data: { plan, planExpiresAt: info?.planExpiresAt } })
  } catch (error) { next(error) }
}
