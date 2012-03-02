var rack = require('hat').rack(),
    params = require('./params');

// The MassPay API lets you send payments to up to
// 250 MAX recipients with a single API call
for (i = 0; i < 11; i++) {
  params.vars['L_EMAIL' + i] = 'user' + i + '@paypal.com';
  params.vars['L_Amt' + i] = '1';
  params.vars['L_UNIQUEID' + i] = i + '_' + rack().substr(6);
  params.vars['L_NOTE' + i] = 'example note ' + i;
}

var MassPay = require('../index');
var mp = new MassPay({
  pwd: process.env.PAYPAL_PWD
  , user: process.env.PAYPAL_USER
  , signature: process.env.PAYPAL_SIGNATURE
  , emailsubject: process.env.PAYPAL_EMAILSUBJECT
});

mp.pay(params, function onSuccess(res) {
  console.log('PayPal Mass Payment successful. Transaction details: \n\n', res);
}, function onFailure(err, res) {
  if (err) { throw err; }

  console.log('PayPal Mass Payment failed. Transaction details: \n\n', res);
});
