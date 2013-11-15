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

/*************************************************************************************************************
*		Test if elements empty using underscore and jquery
*			Params - controls is designed to be a jquery selector that will be used to find the controls
*					 to be tested.
*			Logic  - this function uses the unscore chain method to join together filter() and isEmpty(). It
*					 does this by iterating over our group of elements found by controls which is passed into
*					 the filter function.  Filter returns an array of objects where its condition is met i.e.
*					 where the element value is an empty string.  This returned list is then passed to isEmpty
*					 which will return true for [] or false for [...].  The chain is stopped using value() 
*					 that will return the boolean result to the calling method.
*
*			Variations - areControlsEmpty() is generic and should work for textbox/dropdown/etc.
*					   - areRadioControlsEmpty() is specific to radio buttons and will check is unset
*************************************************************************************************************/

function areControlsEmpty(controls) {
	return _.chain(controls)
	.filter(function(element) { return element.value !== "" })
	.isEmpty()
	.value();
}

function areRadioControlsEmpty(controls) {
	return _.chain(controls)
	.filter(function(element) { return typeof element != "undefined" })
	.isEmpty()
	.value();
}

/************************************************************************************************************/

/*
*		NB on our blur function we need to set it so that it checks that the indemnitors previous to it are 
*		completed. We can do this by using validateRequiredFields() to ensure that the previous indemnitors
*		are completed.  Might be able to achieve this with underscore again to remove the need for a for loop.
*		
*/

/*************************************************************************************************************
*	Closure for properties
*			Properties are added to the constants function as "private variables".  Our Closure then sets out
*			what is returned and where.  This extracts the constant variables from the global namespace and
*			allows us to removed explicitly placed strings and values from our code providing greater readability
*			of the code.
*
*		To Add - within the constants function add a variable for the value you wish to be abstracted.
*			   - within theClosure function add the identifier for the value and the variable to be returned
*				 in the format "Identifier: _privateVariable.
*			   - if not already done, declare a variable for your closure i.e. var properties = constants();
*			   - access your abstracted variable by using properties().Identifier
*************************************************************************************************************/

function test() {
	var properties = constants();
	alert (properties().HelloString);
	alert (properties().WorldString);
}

function constants(){
	var _helloString = "Hello";
	var _worldString = "World";

	return (function theClosure() {
		return {	HelloString: _helloString, 
					WorldString: _worldString
			   };
	});
}