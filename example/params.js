module.exports = {
  // Standard values to be sent to PayPal
  'vars': {
    'METHOD': 'MassPay',
    'VERSION': '51.0',
    'PWD': process.env.PAYPAL_PWD,
    'USER': process.env.PAYPAL_USER,
    'SIGNATURE': process.env.PAYPAL_SIGNATURE,
    'EMAILSUBJECT': process.env.PAYPAL_EMAILSUBJECT,
    'RECEIVERTYPE': 'EmailAddress',
    'CURRENCYCODE': 'USD'
  },
  // Possible environments: 'sandbox', 'beta-sandbox' or 'live'
  'environment': (process.env.NODE_ENV === 'production') ? 'live' : 'sandbox'
};