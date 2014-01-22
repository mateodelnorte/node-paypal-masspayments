var test = require('tape'),
    mockery = require('mockery'),
    pathToObjectUnderTest = '../lib/massPay',
    fakePaymentBatch = function(){},
    fakePaymentRequest = function(){};

function simpleExtend(target, source){
    for(var key in source){
        target[key] = source[key];
    }

    return target;
}

mockery.registerAllowables([pathToObjectUnderTest]);

function resetMocks(){
    mockery.registerMock('request', {});
    mockery.registerMock('qs', {});
    mockery.registerMock('./massPaymentResponse', {});
    mockery.registerMock('./massPaymentError', {});
    mockery.registerMock('./paymentBatch', fakePaymentBatch);
    mockery.registerMock('./paymentRequest', fakePaymentRequest);
    mockery.registerMock('object-extend', simpleExtend);
}

function getCleanTestObject(){
    mockery.enable({ useCleanCache: true, warnOnReplace: false });
    objectUnderTest = require(pathToObjectUnderTest);
    mockery.disable();
    resetMocks();
    return objectUnderTest;
}

resetMocks();

test('MassPay Exists', function (t) {
    t.plan(2);
    var MassPay = getCleanTestObject();
    t.ok(MassPay, 'MassPay Exists');
    t.equals(typeof MassPay, 'function',  'MassPay is an function');
});

test('additional constructors are set', function (t) {
    t.plan(2);
    var PaymentRequest = getCleanTestObject(),
        options = {
            user: 'testUser',
            pwd: 'testPassword',
            signature: 'testSignature'
        },
        result;

    t.equals(PaymentRequest.PaymentBatch, fakePaymentBatch, 'PaymentRequest.PaymentBatch is correct');
    t.equals(PaymentRequest.PaymentRequest, fakePaymentRequest, 'PaymentRequest.PaymentRequest is correct');
});

test('options is required for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        options = null,
        result;

    try {
        result = new PaymentRequest(options);
    } catch (exception) {
        t.equals(exception.message, 'Invalid Options Object',  'options is required');
    }
});

test('options.user is required for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        options = {
            user: null
        },
        result;

    try {
        result = new PaymentRequest(options);
    } catch (exception) {
        t.equals(exception.message, 'Invalid User (options.user)',  'options.user is required');
    }
});

test('options.pwd is required for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        options = {
            user: 'test',
            pwd: null
        },
        result;

    try {
        result = new PaymentRequest(options);
    } catch (exception) {
        t.equals(exception.message, 'Invalid Password (options.pwd)',  'options.pwd is required');
    }
});

test('options.signature is required for contruction', function (t) {
    t.plan(1);
    var PaymentRequest = getCleanTestObject(),
        options = {
            user: 'test',
            pwd: 'test',
            signature: null
        },
        result;

    try {
        result = new PaymentRequest(options);
    } catch (exception) {
        t.equals(exception.message, 'Invalid Signature (options.signature)',  'options.signature is required');
    }
});


test('contruction sets vars correctly', function (t) {
    t.plan(8);
    var PaymentRequest = getCleanTestObject(),
        options = {
            user: 'testUser',
            pwd: 'testPassword',
            signature: 'testSignature',
            emailsubject: 'testSubject',
            currencyCode: 'testCurrencyCode'
        },
        expectedValues = {
            method: 'MassPay',
            version: '51.0',
            pwd: options.pwd,
            user: options.user,
            signature: options.signature,
            emailSubject: options.emailsubject,
            receiverType: 'emailaddress',
            currencyCode: options.currencyCode
        },
        result;

    result = new PaymentRequest(options);

    t.equals(result.vars.method, expectedValues.method, 'method is correct');
    t.equals(result.vars.version, expectedValues.version, 'version is correct');
    t.equals(result.vars.pwd, expectedValues.pwd, 'pwd is correct');
    t.equals(result.vars.user, expectedValues.user, 'user is correct');
    t.equals(result.vars.signature, expectedValues.signature, 'signature is correct');
    t.equals(result.vars.emailSubject, expectedValues.emailSubject, 'emailSubject is correct');
    t.equals(result.vars.receiverType, expectedValues.receiverType, 'receiverType is correct');
    t.equals(result.vars.currencyCode, expectedValues.currencyCode, 'currencyCode is correct');
});

test('sends correct data to PayPal', function (t) {
    t.plan(15);

    var options = {
            user: 'testUser',
            pwd: 'testPassword',
            signature: 'testSignature',
            emailsubject: 'testSubject',
            currencyCode: 'testCurrencyCode'
        },
        expectedValues = {
            method: 'MassPay',
            version: '51.0',
            pwd: options.pwd,
            user: options.user,
            signature: options.signature,
            emailSubject: options.emailsubject,
            receiverType: 'emailaddress',
            currencyCode: options.currencyCode
        },
        paymentBatch = {
            params: {
                foo: 'bar'
            }
        },
        testRequestBody = 'Test body data',
        testResponseBody = 'Test body data',
        result;

    mockery.registerMock('request', {
        post: function(data, callback){
            t.equals(data.headers['content-type'], 'application/x-www-form-urlencoded', 'content-type is correct');
            t.equals(data.url, 'https://api-3t.sandbox.paypal.com/nvp', 'url is correct');
            t.equals(data.body, testRequestBody, 'body is correct');

            callback(null, null, testResponseBody);
        }
    });


    mockery.registerMock('qs', {
        stringify: function(data){
            t.equals(data.method, expectedValues.method, 'method is correct');
            t.equals(data.version, expectedValues.version, 'version is correct');
            t.equals(data.pwd, expectedValues.pwd, 'pwd is correct');
            t.equals(data.user, expectedValues.user, 'user is correct');
            t.equals(data.signature, expectedValues.signature, 'signature is correct');
            t.equals(data.emailSubject, expectedValues.emailSubject, 'emailSubject is correct');
            t.equals(data.receiverType, expectedValues.receiverType, 'receiverType is correct');
            t.equals(data.currencyCode, expectedValues.currencyCode, 'currencyCode is correct');
            t.equals(data.foo, paymentBatch.params.foo, 'paymentBatch params is correct');

            return testRequestBody;
        }
    });

    mockery.registerMock('./massPaymentResponse', function(data){
        t.ok(data, testResponseBody, 'correct response body');
        this.ACK = 'Success';
        this.testObject = true;
    });

    var PaymentRequest = getCleanTestObject();

    result = new PaymentRequest(options);

    result.pay(paymentBatch, function(error, response){

        t.notOk(error, 'no errors');
        t.ok(response.testObject, 'got correct response object');
    });
});

test('PAYPAL_ENV production gets live url', function (t) {
    t.plan(2);

    var options = {
            user: 'testUser',
            pwd: 'testPassword',
            signature: 'testSignature'
        },
        paymentBatch = {
            params: {
                foo: 'bar'
            }
        },
        testRequestBody = 'Test body data',
        testResponseBody = 'Test body data',
        result;

    mockery.registerMock('request', {
        post: function(data, callback){
            t.equals(data.url, 'https://api-3t.paypal.com/nvp', 'url is correct');
            callback(null, null, testResponseBody);
        }
    });


    mockery.registerMock('qs', {
        stringify: function(data){
            return testRequestBody;
        }
    });

    mockery.registerMock('./massPaymentResponse', function(data){
        this.ACK = 'Success';
    });

    var PaymentRequest = getCleanTestObject();

    result = new PaymentRequest(options);

    process.env.PAYPAL_ENV = 'production';

    result.pay(paymentBatch, function(error, response){
        t.notOk(error, 'no errors');
    });

    process.env.PAYPAL_ENV = undefined;

});

test('handels request error', function (t) {
    t.plan(1);

    var options = {
            user: 'testUser',
            pwd: 'testPassword',
            signature: 'testSignature'
        },
        paymentBatch = {
            params: {
                foo: 'bar'
            }
        },
        testRequestBody = 'Test body data',
        testError = new Error('test error'),
        result;

    mockery.registerMock('request', {
        post: function(data, callback){
            callback(testError);
        }
    });


    mockery.registerMock('qs', {
        stringify: function(data){
            return testRequestBody;
        }
    });

    var PaymentRequest = getCleanTestObject();

    result = new PaymentRequest(options);

    result.pay(paymentBatch, function(error, response){
        t.equal(error, testError, 'correct error');
    });
});

test('handels response error', function (t) {
    t.plan(2);

    var options = {
            user: 'testUser',
            pwd: 'testPassword',
            signature: 'testSignature'
        },
        paymentBatch = {
            params: {
                foo: 'bar'
            }
        },
        testRequestBody = 'Test body data',
        testResponseBody = 'Test body data',
        fakeMassPaymentError = function(data){
            t.equals(data, testResponseBody, 'correct data sent to MassPaymentError');
        },
        result;

    mockery.registerMock('request', {
        post: function(data, callback){
            callback(null, null, testResponseBody);
        }
    });

    mockery.registerMock('qs', {
        stringify: function(data){
            return testRequestBody;
        }
    });

    mockery.registerMock('./massPaymentResponse', function(data){
        this.ACK = 'Failure';
    });

    mockery.registerMock('./massPaymentError', fakeMassPaymentError);

    var PaymentRequest = getCleanTestObject();

    result = new PaymentRequest(options);

    result.pay(paymentBatch, function(error, response){
        t.ok(error instanceof fakeMassPaymentError, 'correct error');
    });
});

