var request = require('request'),
        qs = require('qs'),
        MassPaymentResponse = require('./massPaymentResponse'),
        MassPaymentError = require('./massPaymentError'),
        objectExtend = require('object-extend');

function MassPay(options) {
    if (!options) {
        throw new Error('Invalid Options Object');
    }

    if (!options.user) {
        throw new Error('Invalid User (options.user)');
    }

    if (!options.pwd) {
        throw new Error('Invalid Password (options.pwd)');
    }

    if (!options.signature) {
        throw new Error('Invalid Signature (options.signature)');
    }

    this.vars = {
        method: 'MassPay',
        version: '51.0',
        pwd: options.pwd,
        user: options.user,
        signature: options.signature,
        emailSubject: options.emailsubject,
        receiverType: 'emailaddress',
        currencyCode: options.currencyCode || 'USD'
    };
}

MassPay.prototype.pay = function pay(paymentBatch, callback) {
    var vars = objectExtend(objectExtend({}, this.vars), paymentBatch.params),
        baseUrl = process.env.PAYPAL_ENV === 'production' ? 'https://api-3t.paypal.com/nvp' : 'https://api-3t.sandbox.paypal.com/nvp';

    request.post({
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        url: baseUrl,
        body: qs.stringify(vars)
    }, function(error, res, body) {
        var response;
        if (error) {
            callback(error);
        } else {
            response = new MassPaymentResponse(body);
            if (response.ACK === 'Success') {
                callback(null, response);
            } else {
                callback(new MassPaymentError(body));
            }
        }
    });
};

MassPay.PaymentBatch = require('./paymentBatch');
MassPay.PaymentRequest = require('./paymentRequest');

module.exports = MassPay;