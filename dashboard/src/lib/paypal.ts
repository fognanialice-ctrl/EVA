const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  return data.access_token
}

export async function createPayPalOrder(amountCents: number, description: string): Promise<{ id: string; approvalUrl: string }> {
  const token = await getAccessToken()
  const amount = (amountCents / 100).toFixed(2)

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: amount,
        },
        description,
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paypal/capture`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments`,
        brand_name: 'EVA',
        user_action: 'PAY_NOW',
      },
    }),
  })

  const order = await res.json()
  const approvalUrl = order.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')?.href

  return { id: order.id, approvalUrl: approvalUrl || '' }
}

export async function capturePayPalOrder(orderId: string): Promise<{ status: string; id: string }> {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()
  return { status: data.status, id: data.id }
}
