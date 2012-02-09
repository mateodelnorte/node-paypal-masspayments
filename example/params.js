module.exports = {
  // Standard values to be sent to PayPal
  'vars': {
    'METHOD': 'MassPay',
    'VERSION': '51.0',
    'PWD': 'insert password here',
    'USER': 'insert user here',
    'SIGNATURE': 'insert signature here',
    'EMAILSUBJECT': 'example_email_subject',
    'RECEIVERTYPE': 'EmailAddress',
    'CURRENCYCODE': 'USD'
  },
  // Possible environments: 'sandbox', 'beta-sandbox' or 'live'
  'environment': 'sandbox'
};
