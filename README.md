two_page_trial
==============

Version 1.1
===========
* PCI 3.0 Compliant.  Added support for UltraCart Hosted Fields See: http://docs.ultracart.com/display/ucdoc/UltraCart+PCI+Compliance
* Added localization.  Removed hard coded dollar signs.  Checkout is now easy to use with other currencies
* Updated jQuery and JSON to latest versions to support PCI changes.
* Added labels throughout to eliminate some html validation warnings.

Version 1.0
===========

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


*Installation*
______________
Copy all of the files to your web tree.  Make sure the rest_proxy.php file works.  Here's how to test it out:

   Test #1: If you call it directly from the web browser, you should receive back this response: "UltraCart rest proxy script called incorrectly.  _url query parameter is required.

   Test #2:  adjust your url to call this:   rest_proxy.php?_url=/rest/cart, you should receive back this response: "Missing Merchant Id."

   Test #3:  call this: rest_proxy.php?_url=/rest/cart&_mid=DEMO, you should receive back the json for an empty cart.
   underscores not showing up before url and also before mid
   
*Configuration*
_______________

 * Javascript Checklist

   Page 1: merchantId, nextPage, myItemId, shippingMethod, shippingCost

   Page 2: merchantId, serverName

 * Implement validate() on each page, use your own flavor.
 * Error handling: find all occurances of 'alert' and implement a means of displaying errors to the customer.
 * Terms and Conditions link:  Search for 'add_link_here' and add a link to your terms and conditions.
