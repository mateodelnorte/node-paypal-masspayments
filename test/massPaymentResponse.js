var test = require('tape'),
    mockery = require('mockery'),
    pathToObjectUnderTest = '../lib/massPaymentResponse';

function simpleExtend(target, source){
    for(var key in source){
        target[key] = source[key];
    }

    return target;
}

mockery.registerAllowables([pathToObjectUnderTest]);

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

test('MassPaymentResponse Exists', function (t) {
    t.plan(2);
    var MassPaymentResponse = getCleanTestObject();
    t.ok(MassPaymentResponse, 'MassPaymentResponse Exists');
    t.equals(typeof MassPaymentResponse, 'function',  'MassPaymentResponse is an function');
});

test('MassPaymentResponse is instance of error', function (t) {
    t.plan(1);
    var testMessage = 'Test Message';

    mockery.registerMock('qs', {
        parse: function(data){
            t.equals(data, testMessage, 'data passed correctly');
        }
    });

    var MassPaymentResponse = getCleanTestObject(),
        newMassPaymentResponse = new MassPaymentResponse(testMessage);
});
