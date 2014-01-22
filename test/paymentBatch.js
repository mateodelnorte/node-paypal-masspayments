var test = require('tape'),
    pathToObjectUnderTest = '../lib/paymentBatch';


function getCleanTestObject(){
    objectUnderTest = require(pathToObjectUnderTest);
    return objectUnderTest;
}

test('PaymentBatch Exists', function (t) {
    t.plan(2);
    var PaymentBatch = getCleanTestObject();
    t.ok(PaymentBatch, 'PaymentBatch Exists');
    t.equals(typeof PaymentBatch, 'function',  'PaymentBatch is an function');
});

test('PaymentBatch constructs correctly defined object', function (t) {
    t.plan(8);
    var paymentRequests = [
            {
                email: 'email0',
                amount: 'amount0',
                uniqueId: 'uniqueId0',
                note: 'note0'
            },
            {
                email: 'email1',
                amount: 'amount1',
                uniqueId: 'uniqueId1',
                note: 'note1'
            }
        ],
        PaymentBatch = getCleanTestObject(),
        result = new PaymentBatch(paymentRequests);

    for (var index = 0; index < paymentRequests.length; index++) {
        t.equals(result.params['L_EMAIL' + index], paymentRequests[index].email, 'L_EMAIL' + index + ' is present and correct');
        t.equals(result.params['L_Amt' + index], paymentRequests[index].amount, 'L_Amt' + index + ' is present and correct');
        t.equals(result.params['L_UNIQUEID' + index], paymentRequests[index].uniqueId, 'L_UNIQUEID' + index + ' is present and correct');
        t.equals(result.params['L_NOTE' + index], paymentRequests[index].note, 'L_NOTE' + index + ' is present and correct');
    }
});