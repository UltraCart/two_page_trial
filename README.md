#### Demo
A demo is [here](http://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demos/two_page_trial/trial-page1.html).  It contains hard coded instructions to add a dog bone to a dummy account 'DEMO'.  To complete the checkout, use a Visa card 4444333322221111 with any future expiration and any CVV (try 123).

#### Introduction
The UltraCart Two Page Trial checkout contains bare bones reference implementation of a javascript based checkout built on the [UltraCart REST API](http://docs.ultracart.com/display/ucdoc/UltraCart+REST+Checkout+API).  This checkout is popular among merchants offering trial offers tied to recurring orders.  There is a [working demo](http://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demos/two_page_trial/trial-page1.html) hosted on the UltraCart servers.  Do not download that version.  It is modified slightly to run on our non-PHP servers.  See the Getting Started section for instructions on setting up your own site.

### Getting Started
1. Download the latest release.
2. Copy all of the files to your web tree.  Make sure the rest_proxy.php file works by calling it directly from your web browser.

   |URL|Expected Result|
   |---|---------------|
   |```rest_proxy.php```|"UltraCart rest proxy script called incorrectly.  _url query parameter is required.|
   |```rest_proxy.php?_url=/rest/cart```|"Missing Merchant Id."|
   |```rest_proxy.php?_url=/rest/cart&_mid=DEMO```|you should receive back the json for an empty cart|

3. Edit trial-page1.html and set these javascript variables:
   * merchantId
   * nextPage
   * myItemId
   * shippingMethod
   * shippingCost

4. Edit trial-page1.html and implement validate() to perform whatever checks you desire.
   
5. Edit trial-page2.html and set these javascript variables:
   * merchantId
   * serverName

6. Edit trial-page2.html and implement validate() to perform whatever checks you desire.
7. Error handling: find all occurances of 'alert' and implement a means of displaying errors to the customer.
8. Terms and Conditions link:  Search for 'add_link_here' and add a link to your terms and conditions.


#### Version 1.1

* PCI 3.0 Compliant.  Added support for UltraCart Hosted Fields See: http://docs.ultracart.com/display/ucdoc/UltraCart+PCI+Compliance
* Added localization.  Removed hard coded dollar signs.  Checkout is now easy to use with other currencies
* Updated jQuery and JSON to latest versions to support PCI changes.
* Added labels throughout to eliminate some html validation warnings.

#### Version 1.0

Of this release, the changes in the rest_proxy.php script are most important.
Please upgrade your rest_proxy.php scripts as soon as possible.  Doing so will prevent issues with your site.  Additionally,
we've added a proxy version header that will allow us to track which merchants might have out of date proxy scripts in the
future.  This could prove vital to rapidly addressing any compatibility issues that might arise from future server updates.

rest_proxy.php changes:
* Fixes for content-length being sent down when original response was gziped.  Would cause the client problem if the server running the proxy wasn't gziping it as well
* We have disabled gzip upstream until 4/15/2015 at which point everyone should have their proxy scripts upgraded.
* Added a flag that can be set to enable debugging to the error_log instead of having to uncomment all the statements.
* Change SSL certificate verify flag.
* Set an empty Expect header in the request to prevent curl from sending the Expect: 100-Continue header.
* Simplify the HTTP 100 Continue header trimming and allow for multiple of them
* Close out the curl handle sooner.
* Add a proxy version number to the header so we can tell from the server side if people are running out of date proxy


A simple two page checkout geared toward trial offers.
