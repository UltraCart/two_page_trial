/* globals window,HTMLCollection,document */
// main.js
// main source file for vanilla cart implementation

'use strict';

if (!window.uc) {
    window.uc = {};
}

uc.sdk = require('ultra_cart_rest_api_v2');

if (!uc.cookieName) {
    uc.cookieName = 'UltraCartShoppingCartID';
}

// ===================================================================================
// UltraCart SDK Initialization
// ===================================================================================
var defaultClient = uc.sdk.ApiClient.instance;
defaultClient.authentications['ultraCartBrowserApiKey'].apiKey = window.uc.browserKey;
defaultClient.defaultHeaders["X-UltraCart-Api-Version"] = "2017-03-01";

// ===================================================================================
// UltraCart Checkout API bootstrap
// ===================================================================================
window.uc.checkoutApi = new uc.sdk.CheckoutApi();
// the difference between the expansions is settings and/or shipping estimates.  estimating shipping involves communicating with
// shipping providers such as FedEx and UPS.  It's very slow.  So we only want to include that expansion if we have
// at least a city, state, country, and postal code.
// Additional, the settings object is static and contiains shipping/billing countries.  Those generate large json blocks.
// So we only wish to get the settings once and store them off.
// window.uc.initialExpansion = "affiliate,billing,checkout,coupons,customer_profile,gift,gift_certificate,items,items.attributes,items.multimedia,items.multimedia.thumbnails,items.physical,marketing,payment,settings.billing.provinces,settings.gift,settings.shipping.deliver_on_date,settings.shipping.provinces,settings.shipping.ship_on_date,settings.terms,settings.taxes,shipping,summary,taxes,upsell_after";
window.uc.expansion = "affiliate,billing,checkout,coupons,customer_profile,gift,gift_certificate,items,items.attributes,items.multimedia,items.multimedia.thumbnails,items.physical,marketing,payment,shipping,summary,taxes,upsell_after";
// We only need the shipping estimates for the last, but we need to submit the entire cart so that everything can be factored into shipping costs (coupons, etc).
// window.uc.expansionForShippingEstimates = "settings.shipping.estimates,affiliate,billing,checkout,coupons,customer_profile,gift,gift_certificate,items,items.attributes,items.multimedia,items.multimedia.thumbnails,items.physical,marketing,payment,shipping,summary,taxes,upsell_after";
window.uc.cart = null;


// this function expects a server side error.  they are supplied as Response.text.  here's an example:
// "{"error":{"developer_message":"Permission Denied.","user_message":"Permission Denied."},"metadata":{}}"
window.uc.displayServerErrors = function (jsonString) {
    var error_object = JSON.parse(jsonString);
    if (error_object && error_object.error && error_object.error.user_message) {
        uc.displayCheckoutErrors(error_object.error.user_message);
    }
};

window.uc.displayCheckoutErrors = function (errors) {
    var html = '<ul>';

    if (typeof errors === 'string') {
        html += '<li>' + errors + '</li>';
    } else {
        for (var j = 0; j < errors.length; j++) {
            html += '<li>' + errors[j] + '</li>';
        }
    }

    html += '</ul>';

    jQuery('#checkoutError').show();
    jQuery('.errorContent').html(html).show();
};


window.uc.clearCheckoutErrors = function () {
    jQuery('#checkoutError').hide();
    jQuery('.errorContent').html('').hide();
};

window.uc.loadCart = function (successCallback) {

    var callback = function (error, data, response) {

        if (error) {
            if (response && response.text) {
                // TODO handle this gracefully.
                alert(response.text);
            } else {
                console.error(error);
            }
        } else {
            uc.cart = data.cart;
            if (uc.cart.cart_id) {
                console.log("creating cookie for cart id", uc.cart.cart_id);

                cartToFields(uc.cart);
                // even if the cookie is already set, set it again.  updates the expiration of it.
                jQuery.cookie(uc.cookieEnabled, uc.cart.cart_id, {expires: 7, path: '/'});

            }

            if (successCallback) {
                successCallback(uc.cart);
            }
        }

        cartToFields(uc.cart);
    };

    // check for cookie cart id.  load cart, populate fields.
    var cartId = jQuery.cookie(uc.cookieName) || '';
    if (cartId) {
        console.log("found existing cart id, using", cartId);
        uc.checkoutApi.getCartByCartId(cartId, {expand: window.uc.expansion}, callback);
    } else {
        uc.checkoutApi.getCart({expand: window.uc.expansion}, callback);
    }

};


/**
 * helper method designed to allow for money calculations on the client side.
 * Only those currencies supported by UltraCart are implemented here.
 * @param amount amount to be formatted
 * @param currencyCode the desired currency code
 * @return {*} A string formatted in the desired currency.
 */
window.uc.formatMoney = function (amount, currencyCode) {
    if (isNaN(amount)) {
        return "";
    }

    // if we don't have a currency code, there's nothing to do here.
    if (!currencyCode) {
        return amount.toFixed(2);
    }

    /**
     * takes a number and adds thousandths separators
     * @param n
     * @param thouSep thousandth separator, usually a comma
     * @param decSep decimal separator, usually a period
     * @return {string}
     */
    function numberWithSeparators(n, thouSep, decSep) {
        var parts = n.toString().split(decSep);
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thouSep) + (parts[1] ? decSep + parts[1] : "");
    }

    var formats = {
        "AUD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' AUD', 'fractionDigits': 2},
        "BRL": {'prefix': 'R$', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
        "CAD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' CAD', 'fractionDigits': 2},
        "CHF": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' Sfr', 'fractionDigits': 2},
        "EUR": {
            'prefix': '',
            'thousandth': '.',
            'decimalSeparator': ',',
            suffix: ' ' + '\u20AC',
            'fractionDigits': 2
        },
        "GBP": {
            'prefix': '\u00A3',
            'thousandth': ',',
            'decimalSeparator': '.',
            suffix: '',
            'fractionDigits': 2
        },
        "JPY": {
            'prefix': '\u00A5',
            'thousandth': ',',
            'decimalSeparator': '.',
            suffix: '',
            'fractionDigits': 0
        },
        "MXN": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' MXN', 'fractionDigits': 2},
        "NOK": {'prefix': 'kr', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
        "NZD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' NZD', 'fractionDigits': 2},
        "RUB": {
            'prefix': '',
            'thousandth': ',',
            'decimalSeparator': '.',
            suffix: ' \u0440\u0443\u0431',
            'fractionDigits': 2
        },
        "SEK": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' Kr', 'fractionDigits': 2},
        "SGD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' SGD', 'fractionDigits': 2},
        "TRY": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' YTL', 'fractionDigits': 2},
        "USD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2}
    };

    var format = null;
    if (formats.hasOwnProperty(currencyCode)) {
        format = formats[currencyCode];
    }


    if (format) {
        var fixedAmount = amount.toFixed(format.fractionDigits);
        var fixedAmountStr = fixedAmount.toString();
        var hasNegativeSign = false;

        if (fixedAmountStr.indexOf('-') === 0) {
            hasNegativeSign = true;
            fixedAmountStr = fixedAmountStr.substr(1);
        }

        return (hasNegativeSign ? "-" : "") + format.prefix + numberWithSeparators(fixedAmountStr, format.thousandth, format.decimalSeparator) + format.suffix;
    }

    return amount.toFixed(2); // nothing to do but fail gracefully.

};
