var qs = require('qs'),
    objectExtend = require('object-extend');

function MassPaymentResponse(body) {
    objectExtend(this, qs.parse(body));
}

module.exports = MassPaymentResponse;
