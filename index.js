var request = require('request'),
    qs = require('qs'),
    util = require('util'),
    _ = require('underscore');
    
var requiredOptions = ['pwd', 'user', 'signature'],
    receiverTypes = {
      'EmailAddress': 'L_EMAIL',
      'UserID' : 'L_RECEIVERID'
    },
    validReceiverTypes = Object.keys(receiverTypes),
    receiverTypeIsValid = function(receiverType) {
      var receiverTypeIsValid = _.some(validReceiverTypes, function(validReceiverType) {
        return validReceiverType.toLowerCase() === receiverType.toLowerCase();
      });
      return receiverTypeIsValid;
    },
    verifyOptions = function(options) {
      if (!options) throw new Error('options must be defined for MassPay including pwd, user, signature, and receiverType');
      
      var optionKeys = Object.keys(options);
      var missingRequiredOptions = _.difference(requiredOptions, optionKeys);
      if (missingRequiredOptions.length > 0) {
        throw new Error('MassPay options missing required param/s: ' + missingRequiredOptions.toString());
      }
      
      if (options.receiverType && !receiverTypeIsValid(options.receiverType)) {
        throw new Error('options.receiverType must be one of the following: ' + validReceiverTypes.toString());
      }
    };

function MassPay(options) {
  verifyOptions(options);

  this.vars = {
    METHOD: 'MassPay'
    , VERSION: (options.version) ? options.version : '117'
    , PWD: options.pwd
    , USER: options.user
    , SIGNATURE: options.signature
    , RECEIVERTYPE: (options.receiverType) ? options.receiverType : 'EmailAddress'
    , CURRENCYCODE: (options.currencyCode) ? options.currencyCode : 'USD'
  };
  
  if (options.emailsubject) {
    this.vars.emailSubject = options.emailsubject;
  }
  
  this.environment = (process.env.PAYPAL_ENV === 'production') ? 'live' : 'sandbox';
};

MassPay.prototype.pay = function pay(paymentBatch, callback) {
  var vars = _.extend(_.clone(this.vars), paymentBatch.params)
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
      if (response.ACK === 'Success' || response.ACK === 'SuccessWithWarning') {
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

function PaymentRequest(receiver, amount, uniqueId, note) {

  if(amount <= 0) throw new PaymentRequestInputError('');

  this.receiver = receiver;
  this.amount = amount;
  this.uniqueId = uniqueId;
  this.note = note;
}

module.exports.PaymentRequest = PaymentRequest;

function PaymentRequestInputError(message) {

}

util.inherits(PaymentRequestInputError, Error);

function PaymentBatch(paymentRequests, receiverType) {
  if (!receiverType || !receiverTypeIsValid(receiverType)) {
    throw new Error('receiverType must be one of the following: ' + validReceiverTypes.toString());
  }
  
  var receiverParamName = receiverTypes[receiverType];
  
  var index = 0;
  var returnVal = {};
  var values = _.map(paymentRequests, function(request) {
    var val = {};
    val[receiverParamName + index] = request.receiver;
    val["L_AMT" + index] = request.amount;
    if (request.uniqueId) val["L_UNIQUEID" + index] = request.uniqueId;
    if (request.note) val["L_NOTE" + index] = request.note;
    index++;
    _.extend(returnVal, val);
  });
  this.params = returnVal;
}

module.exports.PaymentBatch = PaymentBatch;
