/*
*	Author: James Anderson
*	Date: 13/11/2013
*	
*	PreRequisites: Need to include JQuery and Underscore
*	To minify: Copy code into the textbox at "http://jscompress.com/" and click Compress.
*/

/*
* Section 1 - KeyDown character restriction
*
* The aim here is to limit the characters which can be entered into a textbox by checking the value of the key stroke
* against a set of known possibilities.  Current list include:
* 		allowLetter -> a-z 
*		allowNumericals -> 0-9
* 		allowNumericalsAndDash -> 0-9 "-"
*
* If you find errors with the code you can use "http://www.asquare.net/javascript/tests/KeyCode.html" to help identify
* what the value of a key is within the browser being tested to ensure thats its included/excluded below.
*
* Example Usage:
* $(".className").keydown(function(key) {
*		return allowNumericalsAndDash(key);
* })
*/


function allowLetters(key) {
	if (isNotCommandKey(key)) if (key.keyCode < 65 || key.keyCode > 90) return false;
	return true;
}

function allowNumericals(key) {
	if (isNotCommandKey(key)) if (key.keyCode < 48 || key.keyCode > 57) return false;
	return true;
}

function allowNumericalsAndDash(key) {
	if ((key.keyCode != 45 && key.keyCode != 189) && (!allowNumericals(key))) return false;
	return true;
}


/*
* Section 2 - Underscore Validation
*
* The following functions should provide increased development of validation using jQuery and Underscore.
*
*/

/*
* Validates that textboxes linked by the jQuery have some value set i.e. are not empty and returns the names of the elements that 
* are empty.
* Params - a JQuery string to identify the controls i.e. '$(".className")'
* Output - an array containing the name of any elements that are currently empty
*/
function validateTextBoxRequired(controls) {
	var errorsFound = _.filter(controls + "[type=text]", function(element){
		return element.value === "";
	});

	return getElementNames(errorsFound);

}

/*
* Validates that textboxes linked by the jQuery are not greater than the maxLength param and returns the * names of those elements 
* that do not adhere
* Params - a JQuery string to identify the controls i.e. '$(".className")'
*		 - an int value for the maxlength of the textboxes
* Output - an array containing the name of any elements that are currently empty
*/
function validateTextBoxMaxLength(controls, maxLength) {
	var errorsFound = _.filter(controls + "[type=text]", function(element){
		return element.value.length > maxLength;
	});

	return getElementNames(errorsFound);
}

/*
* Validates that textboxes linked by the jQuery match the regular expression provided and returns the names of the elements that 
* do not match the regex correctly.
* Params - a JQuery string to identify the controls i.e. '$(".className")'
* 		 - a regular expression which the element should adhere too
* Output - an array containing the name of any elements that are currently empty
*/
function validateTextBoxRegex(controls, regex) {
	var errorsFound = _.filter(controls + "[type=text]", function(element){
		return regex.test(element.value);
	});

	return getElementNames(errorsFound);
}

/*
* Validates that the dropdown linked by the jQuery has been set a value other than the default drop down value
* Params - a JQuery string to identify the controls i.e. '$(".className")'
* 		 - the default value of the dropdown i.e. ('') or ('Please select') etc.
* Output - an array containing the name of any elements that are currently empty
*/
function validateDropDownIsSet(controls, defaultText) {
	var errorsFound = _.filter(controls + " option:selected", function(element){
		return (element.value == defaultText);
	});

	return getElementNames(errorsFound);
}



/*
* Helper functions
*/

function isNotCommandKey(key) {
	return (!(key.keyCode < 47 || key.keyCode != 91 || key.keyCode != 92));
}

function getElementNames(elementArray) {
	return _.each(elementArray, function(element){
		if (_.isObject(element))
			return element.name;
}

/*
* End of Helper functions
*/
