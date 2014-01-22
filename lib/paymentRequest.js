function PaymentRequest(email, amount, uniqueId, note) {

    if(!email) {
        throw new Error('Invalid Email');
    }

    if(!amount || amount <= 0) {
        throw new Error('Invalid Amount');
    }

    this.email = email;
    this.amount = amount;
    this.uniqueId = uniqueId;
    this.note = note;
}

module.exports = PaymentRequest;
