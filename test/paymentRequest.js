var test = require('tape'),
    pathToObjectUnderTest = '../lib/paymentRequest';

function getCleanTestObject(){
    objectUnderTest = require(pathToObjectUnderTest);
    return objectUnderTest;
}

test('PaymentRequest Exists', function (t) {
    t.plan(2);
    var PaymentRequest = getCleanTestObject();
    t.ok(PaymentRequest, 'PaymentRequest Exists');
    t.equals(typeof PaymentRequest, 'function',  'PaymentRequest is an function');
});

test('email is required for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        email = null,
        result;

    try {
        result = new PaymentRequest(email);
    } catch (exception) {
        t.equals(exception.message, 'Invalid Email',  'Email is required');
    }
});

test('amount is required for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        email = 'foo@bar.com',
        amount = null,
        result;

    try {
        result = new PaymentRequest(email, amount);
    } catch (exception) {
        t.equals(exception.message, 'Invalid Amount',  'Email is required');
    }
});

test('amount must be > 0 for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        email = 'foo@bar.com',
        amount = -1,
        result;

    try {
        result = new PaymentRequest(email, amount);
    } catch (exception) {
        t.equals(exception.message, 'Invalid Amount',  'Email is required');
    }
});

test('amount must be > 0 for contruction', function (t) {
    t.plan(4);
    var PaymentRequest = getCleanTestObject(),
        email = 'foo@bar.com',
        amount = 100,
        uniqueId = 1234,
        note = 'test',
        result;

        result = new PaymentRequest(email, amount, uniqueId, note);

        t.equals(result.email, email,  'Email is correct');
        t.equals(result.amount, amount,  'amount is correct');
        t.equals(result.uniqueId, uniqueId,  'uniqueId is correct');
        t.equals(result.note, note,  'note is correct');
});