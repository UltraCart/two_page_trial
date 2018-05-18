### Introduction
A simple two page checkout geared toward trial offers.  This checkout is popular among merchants offering trial offers tied to recurring orders.

### Requirements
For development, you will need:
* Node.js installed on your computer
* Gulp.js installed
* UltraCart SDK - See https://github.com/UltraCart/rest_api_v2_sdk_javascript

### Getting Started
To Use:

1. Download or clone this project.
2. From the base directory, run 'npm install'.
3. Edit both html pages and provide your own browser key (for more on this, read [the docs](https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/419364865/Creating+a+Browser+Key+for+a+JavaScript+checkout)).  The one provided will not work.  You'll find the key around line 16 of each file.
```uc.browserKey = "d7f38666b17e60016306f071d41e3700";```
4. Right below the browser key, set your storefront server name.  This is needed to provide proper branding for receipts.
`uc.storeFront = "demo.ultracartstore.com"`
5. In trial-page1.html, find the following javascript variables and set them accordingly:
   * myItemId - this is the trial item id you are offering.
   * shippingMethod - the name of the shipping method you'll use.
   * shippingCost - the cost of the shipping method.  this is verified and corrected on the server, so do not worry about customers finding and changing this value.  However, we set it here to make the checkout complete and run fast.
6. Terms and Conditions link:  Search for 'add_link_here' and add a link to your terms and conditions.   
7. From the base directory, run 'gulp'.  The default action will build the .js and .css file.
8. Deploy or test your checkout!



#### Changelog

###### Version 3.0
Major overhaul.  Converted the checkout to use the latest UltraCart API.

See www.ultracart.com/api/

###### Version 2.0

_This version will now run without any PHP support._

* The rest_proxy.php script is gone.  This checkout now uses CORS alone to communicate with UltraCart servers.
* Upgrade jQuery
* Slight changes to the form field layout on the 2nd page to ensure the hosted fields did not mess up layout.

###### Version 1.1

* PCI 3.0 Compliant.  Added support for UltraCart Hosted Fields See: http://docs.ultracart.com/display/ucdoc/UltraCart+Hosted+Credit+Card+Fields
* Added localization.  Removed hard coded dollar signs.  Checkout is now easy to use with other currencies
* Updated jQuery and JSON to latest versions to support PCI changes.
* Added labels throughout to eliminate some html validation warnings.

###### Version 1.0

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
