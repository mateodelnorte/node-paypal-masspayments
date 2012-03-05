# PayPal Mass Payments NVP

## Read more about PayPal Mass Payment here:

- https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/howto_api_masspay
- https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/library_code

## To test the library you will have to create a PayPal dev account here:

https://developer.paypal.com/

## How to use

Require the masspayments module in your code: 

    var MassPay = require('node-paypal-masspayments')

Instantiate a new instance of the class and provide to it an options variable that provides access to your paypal password, user, api signature, and a subject for your masspayment emails. 

    var mp = new MassPay({
        pwd: process.env.PAYPAL_PWD
        , user: process.env.PAYPAL_USER
        , signature: process.env.PAYPAL_SIGNATURE
        , emailsubject: process.env.PAYPAL_EMAILSUBJECT
    }),

You'll send your payments in batches of up to 250. Each batch is created and passed an array of payment request json objects, each defining an email, amount, uniqueId, and note for the request. 

    var paymentRequests = [
      {
        email: 'matt@email.com'
        , amount: '1.5'
        , uniqueId: '12345'
        , note: 'request for matt@gc'
      }
    , {
        email: 'tim@email.com'
        , amount: '1.75'
        , uniqueId: '123456'
        , note: 'request for tim@gc'
      }
    ];

    var batch = new MassPay.PaymentBatch(paymentRequests);

Pass your batch to to the pay() method, along with an event handler to handle the response. All properties from the PayPal API are transposed to either the error or results object upon success (or a successful call, which returns a logical error from the PayPal gateway).

    mp.pay(batch, function(err, results) {
      if(err) throw err;
      ...
      // do stuff!
      assert.equal(results.ACK, 'Success')
    });
