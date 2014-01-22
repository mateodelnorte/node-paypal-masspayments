function PaymentBatch(paymentRequests) {
    var index = 0,
        returnVal = {};

    for (index = 0; index < paymentRequests.length; index++) {
        returnVal["L_EMAIL" + index] = paymentRequests[index].email;
        returnVal["L_Amt" + index] = paymentRequests[index].amount;
        returnVal["L_UNIQUEID" + index] = paymentRequests[index].uniqueId;
        returnVal["L_NOTE" + index] = paymentRequests[index].note;
    }

    this.params = returnVal;
}

module.exports = PaymentBatch;