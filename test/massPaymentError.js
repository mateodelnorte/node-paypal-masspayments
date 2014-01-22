var test = require('tape'),
    mockery = require('mockery'),
    pathToObjectUnderTest = '../lib/massPaymentError';

function simpleExtend(target, source){
    for(var key in source){
        target[key] = source[key];
    }

    return target;
}

mockery.registerAllowables([pathToObjectUnderTest, 'util']);

function resetMocks(){
    mockery.registerMock('qs', {});
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

test('MassPaymentError Exists', function (t) {
    t.plan(2);
    var MassPaymentError = getCleanTestObject();
    t.ok(MassPaymentError, 'MassPaymentError Exists');
    t.equals(typeof MassPaymentError, 'function',  'MassPaymentError is an function');
});

test('MassPaymentError is instance of error', function (t) {
    t.plan(1);
    mockery.registerMock('qs', {
        parse: function(){

        }
    });

    var MassPaymentError = getCleanTestObject(),
        newMassPaymentError = new MassPaymentError();

    t.ok(newMassPaymentError instanceof Error,  'MassPaymentError is instance of Error');
});

test('MassPaymentError is instance of error', function (t) {
    t.plan(1);
    var testMessage = 'Test Message';

    mockery.registerMock('qs', {
        parse: function(data){
            t.equals(data, testMessage, 'data passed correctly');
        }
    });

    var MassPaymentError = getCleanTestObject(),
        newMassPaymentError = new MassPaymentError(testMessage);
});
