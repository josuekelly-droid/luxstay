// src/lib/paiement/binance.ts
import crypto from 'crypto';

const BINANCE_API_KEY = process.env.BINANCE_API_KEY!;
const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY!;
const BINANCE_MERCHANT_ID = process.env.BINANCE_MERCHANT_ID!;

const BINANCE_API = 'https://bpay.binanceapi.com/binancepay/openapi/v2';

function genererSignature(payload: string): string {
  return crypto
    .createHmac('sha512', BINANCE_SECRET_KEY)
    .update(payload)
    .digest('hex')
    .toUpperCase();
}

export async function creerPaiementBinance(
  montantUSDT: number,
  monnaie: string = 'USDT',
  description: string
) {
  try {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex').substring(0, 32);
    const orderId = `LUXSTAY${timestamp}${nonce.substring(0, 8)}`;

    const body = {
      env: {
        terminalType: 'WEB',
      },
      merchantTradeNo: orderId,
      orderAmount: montantUSDT,
      currency: monnaie,
      goods: {
        goodsType: '02',
        goodsCategory: '6000',
        referenceGoodsId: 'luxstay_subscription',
        goodsName: description.substring(0, 50),
      },
    };

    const bodyString = JSON.stringify(body);
    const payload = timestamp + '\n' + nonce + '\n' + bodyString + '\n';
    const signature = genererSignature(payload);

    console.log('Binance Pay - Request:', {
      timestamp,
      nonce,
      body: bodyString,
      signature: signature.substring(0, 20) + '...',
    });

    const response = await fetch(`${BINANCE_API}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': BINANCE_API_KEY,
        'BinancePay-Signature': signature,
      },
      body: bodyString,
    });

    const data = await response.json();
    console.log('Binance Pay - Response:', JSON.stringify(data, null, 2));

    if (data.status === 'SUCCESS' && data.data) {
      return {
        orderId: orderId,
        transactionId: data.data.prepayId || orderId,
        checkoutUrl: data.data.checkoutUrl || data.data.qrcodeLink || null,
        qrCode: data.data.qrcodeLink || null,
      };
    } else {
      throw new Error(data.errorMessage || data.message || 'Erreur Binance Pay');
    }
  } catch (error: any) {
    console.error('Erreur Binance Pay:', error.message);
    throw new Error(error.message || 'Erreur Binance Pay');
  }
}