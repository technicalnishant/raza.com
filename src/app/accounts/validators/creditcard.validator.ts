import { AbstractControl } from '@angular/forms';

export function ValidateCreditCard(control: AbstractControl) {
    if (validateCCNum(control.value)) {
        return null;
    }
    return { validCard: true };

}

function validateCCNum(ccnum) {
    var ccCheckRegExp = /[^\d\s-]/;
    var isValid = !ccCheckRegExp.test(ccnum);
    var i;

    if (isValid) {
        var cardNumbersOnly = ccnum.replace(/[\s-]/g, "");
        var cardNumberLength = cardNumbersOnly.length;

        var arrCheckTypes = ['visa', 'mastercard', 'amex', 'discover', 'dinners', 'jcb'];
        for (i = 0; i < arrCheckTypes.length; i++) {
            var lengthIsValid = false;
            var prefixIsValid = false;
            var prefixRegExp;

            switch (arrCheckTypes[i]) {
                case "mastercard":
                    lengthIsValid = (cardNumberLength === 16);
                    prefixRegExp = /^5[1-5]/;
                    break;

                case "visa":
                    lengthIsValid = (cardNumberLength === 16 || cardNumberLength === 13);
                    prefixRegExp = /^4/;
                    break;

                case "amex":
                    lengthIsValid = (cardNumberLength === 15);
                    prefixRegExp = /^3([47])/;
                    break;

                case "discover":
                    lengthIsValid = (cardNumberLength === 15 || cardNumberLength === 16);
                    prefixRegExp = /^(6011|5)/;
                    break;

                case "dinners":
                    lengthIsValid = (cardNumberLength === 14);
                    prefixRegExp = /^(300|301|302|303|304|305|36|38)/;
                    break;

                case "jcb":
                    lengthIsValid = (cardNumberLength === 15 || cardNumberLength === 16);
                    prefixRegExp = /^(2131|1800|35)/;
                    break;

                default:
                    prefixRegExp = /^$/;
            }

            prefixIsValid = prefixRegExp.test(cardNumbersOnly);
            isValid = prefixIsValid && lengthIsValid;

            // Check if we found a correct one
            if (isValid) {
                break;
            }
        }
    }

    if (!isValid) {
        return false;
    }

    // Remove all dashes for the checksum checks to eliminate negative numbers
    ccnum = ccnum.replace(/[\s-]/g, "");
    // Checksum ("Mod 10")
    // Add even digits in even length strings or odd digits in odd length strings.
    var checksum = 0;
    for (i = (2 - (ccnum.length % 2)); i <= ccnum.length; i += 2) {
        checksum += parseInt(ccnum.charAt(i - 1));
    }

    // Analyze odd digits in even length strings or even digits in odd length strings.
    for (i = (ccnum.length % 2) + 1; i < ccnum.length; i += 2) {
        var digit = parseInt(ccnum.charAt(i - 1)) * 2;
        if (digit < 10) {
            checksum += digit;
        } else {
            checksum += (digit - 9);
        }
    }

    return (checksum % 10) === 0;
}