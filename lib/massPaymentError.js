var qs = require('qs'),
    util = require('util'),
    objectExtend = require('object-extend');

function MassPaymentError(body) {
    objectExtend(this, qs.parse(body));
}

util.inherits(MassPaymentError, Error);

module.exports = MassPaymentError;
