two_page_trial (version 0.5) BETA
==============

A simple two page checkout geared toward trial offers.


*Installation*
______________
Copy all of the files to your web tree.  Make sure the rest_proxy.php file works.  Here's how to test it out:

   Test #1: If you call it directly from the web browser, you should receive back this response: "UltraCart rest proxy script called incorrectly.  _url query parameter is required.

   Test #2:  adjust your url to call this:   rest_proxy.php?_url=/rest/cart, you should receive back this response: "Missing Merchant Id."

   Test #3:  call this: rest_proxy.php?_url=/rest/cart&_mid=DEMO, you should receive back the json for an empty cart.
   
*Configuration*
_______________

 * Javascript Checklist

   Page 1: merchantId, nextPage, myItemId, shippingMethod, shippingCost

   Page 2: merchantId, serverName

 * Implement validate() on each page, use your own flavor.
 * Error handling: find all occurances of 'alert' and implement a means of displaying errors to the customer.
 * Terms and Conditions link:  Search for 'add_link_here' and add a link to your terms and conditions.
