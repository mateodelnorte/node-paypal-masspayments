# PayPal Mass Payments NVP

## Read more about PayPal Mass Payment here:

- https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/howto_api_masspay
- https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/library_code

## To test the library you will have to create a PayPal dev account here:

https://developer.paypal.com/

## How to use

The MP function takes 3 parameters: an object containing the `params` property, where you set all the variables needed to be sent to PayPal and an `environment` property, which can be 'sandbox', 'beta-sandbox' or 'live'. For more information check example/test.js.

    MP(params, function onSuccess(res) {
      console.log('PayPal Mass Payment successful. Transaction details: \n\n', res);
    }, function onFailure(err, res) {
      if (err) { throw err; }

      console.log('PayPal Mass Payment failed. Transaction details: \n\n', res);
    });
