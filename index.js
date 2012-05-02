var request = require('request'),
    qs = require('qs'),
    util = require('util'),
    _ = require('underscore');

function MassPay(options) {
  if (!options) throw new Error('options must be defined for MassPay including pwd, user, signature, and email subject');

  this.vars = {
    method: 'MassPay'
    , version: '51.0'
    , pwd: options.pwd
    , user: options.user
    , signature: options.signature
    , emailSubject: options.emailsubject
    , receiverType: 'emailaddress'
    , currencyCode: 'USD'
  };
  
  this.environment = (process.env.PAYPAL_ENV === 'production') ? 'live' : 'sandbox';
};

MassPay.prototype.pay = function pay(paymentBatch, callback) {
  var vars = _.extend(this.vars, paymentBatch.params)
    , base_url = (this.environment === 'live') ? 'https://api-3t.paypal.com/nvp' : 'https://api-3t.' + this.environment + '.paypal.com/nvp';
  request.post({
    headers: { 
      'content-type': 'application/x-www-form-urlencoded' 
    },
    url: base_url,
    body: qs.stringify(vars)
  }, function(err, res, body) {
    var response;
    if (err) {
      callback(err);
    } else {
      response = new MassPaymentResponse(body);
      if (response.ACK === 'Success') {
        callback(null, response);
      } else {
        callback(new MassPaymentError(body));
      }
    }
  });
}

module.exports = MassPay;

function MassPaymentResponse(body) {
  _.extend(this, qs.parse(body));
}

function MassPaymentError(body) {
  _.extend(this, qs.parse(body));
}

util.inherits(MassPaymentError, Error);

module.exports.MassPaymentError = MassPaymentError;

function PaymentRequest(email, amount, uniqueId, note) {

  if(amount <= 0) throw new PaymentRequestInputError('');

  this.email = email;
  this.amount = amount;
  this.uniqueId = uniqueId;
  this.note = note;
}

module.exports.PaymentRequest = PaymentRequest;

function PaymentRequestInputError(message) {

}

util.inherits(PaymentRequestInputError, Error);

function PaymentBatch(paymentRequests) {
  var index = 0;
  var returnVal = {};
  var values = _.map(paymentRequests, function(request) {
    var val = {};
    val["L_EMAIL" + index] = request.email;
    val["L_Amt" + index] = request.amount;
    val["L_UNIQUEID" + index] = request.uniqueId;
    val["L_NOTE" + index] = request.note;
    index++;
    _.extend(returnVal, val);
  });
  this.params = returnVal;
}

module.exports.PaymentBatch = PaymentBatch;
