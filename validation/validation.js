/**
 * javascript-validation, A javascript library for validating HTML forms.
 *
 * @version 0.000, http://isprogrammingeasy.blogspot.no/2012/08/angular-degrees-versioning-notation.html
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Sven Nilsen, http://www.cutoutpro.com
 * @link    http://www.github.com/bvssvni/javascript-validation
 */

/******* USAGE

validation_start (
    validation_default_settings (),
    buttonList,
    validationList
);

*******/

"use strict";

//////// SETTINGS
// Settings with large capitals are used when constructing validation items.

// Regular expression for typical username.
var VALIDATION_REGEXP_USERNAME = /^[a-zA-Z\-0-9_]*$/;
// Typical message for invalid username.
var VALIDATION_ERROR_INVALID_USERNAME = "Only a-z, A-Z, '-' and '_' allowed";

// Creates default settings.
// If you need custom settings, copy this function and modify it.
function validation_default_settings () {
    return {
      backgroundColorError: "#FFAAAA",
      requiredFieldMessage: "Required field",
      minLengthMessage:     "Minimum length {0} characters",
      validateIntervalInMilliseconds: 100
    };
}

//////// CREATE VALIDATION ITEMS
// inputId - The id of the input field you want to validate.
// errorId - The id of the error field displaying the error message.
// Some methods have extra options.

function validation_required_field (inputId, errorId) {
    return ["REQUIRED_FIELD", inputId, errorId];
}

function validation_min_length (inputId, errorId, minLength) {
    return ["MIN_LENGTH", inputId, errorId, minLength];
}

function validation_regexp (inputId, errorId, regexp, errorMessage) {
    return ["REGEXP", inputId, errorId, regexp, errorMessage];
}

function validation_username (inputId, errorId) {
    return ["REGEXP", inputId, errorId, VALIDATION_REGEXP_USERNAME,
        VALIDATION_ERROR_INVALID_USERNAME];
}

//////// VALIDATE
// settings - Use 'validation_default_settings ()' for default settings.
// validationList - A list of validation items.
// validation -

function validation_clear (validationList) {
    for (var i = 0; i < validationList.length; i++) {
        var validation = validationList [i];
        var inputId = validation [1];
        var errorId = validation [2];
        var input = document.getElementById (inputId);
        var error = document.getElementById (errorId);
        if (input === null) {
            console.log ("input is null '" + inputId + "'");
            continue;
        }

        input.style.backgroundColor = "";
        error.textContent = "";
    }
}

function validation_validate_required_field (settings, validation) {
    var type = validation [0];
    if (type !== "REQUIRED_FIELD") {
        // Ignore other types of validation.
        return true;
    }

    var inputId = validation [1];
    var errorId = validation [2];
    var input = document.getElementById (inputId);
    var error = document.getElementById (errorId);
    if (input === null) {
        console.log ("input is null '" + inputId + "'");
        return true;
    }
    if (error === null) {
        console.log ("error is null '" + errorId + "'");
        return true;
    }

    var empty = input.value === "";
    if (empty) {
        input.style.backgroundColor = settings.backgroundColorError;
        error.textContent = settings.requiredFieldMessage;
        return false;
    }

    input.style.backgroundColor = "";
    error.textContent = "";
    return true;
}

function validation_validate_min_length (settings, validation) {
    var type = validation [0];
    if (type !== "MIN_LENGTH") {
        // Ignore other types of validation.
        return true;
    }

    var inputId = validation [1];
    var errorId = validation [2];
    var input = document.getElementById (inputId);
    var error = document.getElementById (errorId);
    if (input === null) {
        console.log ("input is null '" + inputId + "'");
        return true;
    }
    if (error === null) {
        console.log ("error is null '" + errorId + "'");
        return true;
    }

    var minLength = validation [3];
    if (input.value.length < minLength) {
        input.style.backgroundColor = settings.backgroundColorError;
        error.textContent = settings.minLengthMessage.replace ("{0}", minLength);
        return false;
    }
    
    input.style.backgroundColor = "";
    error.textContent = "";
    return true;
}

function validation_validate_regex (settings, validation) {
    var type = validation [0];
    if (type !== "REGEXP") {
        // Ignore other types of validation.
        return true;
    }

    var inputId = validation [1];
    var errorId = validation [2];
    var regexp = validation [3];
    var errorMessage = validation [4];
    var input = document.getElementById (inputId);
    var error = document.getElementById (errorId);
    if (input === null) {
        console.log ("input is null '" + inputId + "'");
        return true;
    }
    if (error === null) {
        console.log ("error is null '" + errorId + "'");
        return true;
    }

    var valid = regexp.test (input.value)
    if (!valid) {
        input.style.backgroundColor = settings.backgroundColorError;
        error.textContent = errorMessage;
        return false;
    }

    input.style.backgroundColor = "";
    error.textContent = "";
    return true;
}

function validation_validate (settings, validationList) {
    var valid = true;
    validation_clear (validationList);
    for (var i = 0; i < validationList.length; i++) {
        var validation = validationList [i];
        valid &= validation_validate_required_field (settings, validation);
        valid &= validation_validate_min_length (settings, validation);
        valid &= validation_validate_regex (settings, validation);
        if (!valid) {
            break;
        }
    }

    return valid;
}

function validation_validate_buttons (settings, buttonList, validationList) {
    var valid = validation_validate (settings, validationList);
    for (var i = 0; i < buttonList.length; i++) {
        var buttonId = buttonList [i];
        var button = document.getElementById (buttonId);
        if (button === null) {
            console.log ("button is null'" + buttonId + "'");
            return;
        }

        button.disabled = !valid;
    }
}

function validation_start (settings, buttonList, validationList) {
    setInterval (function () {
       validation_validate_buttons (settings, buttonList, validationList);
    }, settings.validateIntervalInMilliseconds);
}
