import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  const configured = Boolean(clientId && clientSecret)

  return NextResponse.json({ configured })
}
