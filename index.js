var request = require('request'),
    qs = require('qs'),
    MassPay;

MassPay = function (params, successCallback, failCallback) {
  request.post({
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'https://api-3t.' + params.environment + '.paypal.com/nvp',
    body: qs.stringify(params.vars)
  }, function(err, res, body) {
    var PayPalResponse;

    if (err) {
      failCallback(err);
    } else {
      PayPalResponse = qs.parse(body);
      if (PayPalResponse.ACK === 'Success') {
        successCallback(PayPalResponse);
      } else {
        failCallback(err, PayPalResponse);
      }
    }
  });
}

module.exports = MassPay;
