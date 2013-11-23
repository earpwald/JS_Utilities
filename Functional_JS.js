/*************************************************************************************************************
*
*   Helper Functions
*       These functions are generic and are reusable.  They provide some more basic functionality for the form
*
*   Functions:
*       validateRequiredDdl(ddlControl)
*           - This function gets the value for the dropdown element who's identifier/class is passed in.  If
*             the value is empty then an error is thrown for the element.
*       validateRequiredTxt(controls)
*           - This function uses the underscore filter function to get all elements which are empty and raise 
*             an error with any elements that are returned.
*       areControlsEmpty - two variations which are explained below
*************************************************************************************************************/

    //loop over dropdown list controls using Underscore.Js, checking that a value has been selected
    //function validateRequiredDdl(ddlControl) {
     //   var ddlState = $(ddlControl + " option:selected").text();
     //   if (ddlState === '') {
     //      ErrorHandlerRequired($('select' + ddlControl));
     //   }
    //}

    //loop over textbox controls using Underscore.Js returning false if anything doesn't contain a value
    function validateRequiredTxt_old(controls) {
        var controlsValues = _.filter($(controls + "[type='text']"),function(element) { return element.value === ""; });
        
        if (controlsValues.length > 0) {
            //pass to errorhandling funct
            ErrorHandlerRequired(controlsValues);
        }
    }

   /*********************************************************************************************************
    *   Test if elements empty using underscore and jquery
    *       Params - controls is designed to be a jquery selector that will be used to find the controls to be 
    *                tested.
    *       Logic  - this function uses the unscore chain function to join together filter() and isEmpty(). It
    *                does this by iterating over our group of elements found by controls which is passed into
    *                the filter function.  Filter returns an array of objects where its condition is met i.e.
    *                where the element value is an empty string.  This returned list is then passed to isEmpty
    *                which will return true for [] or false for [...].  The chain is stopped using value() 
    *                that will return the boolean result to the calling function.
    *
    *       Variations - areControlsEmpty() is generic and should work for textbox/dropdown/etc.
    *                  - areRadioControlsEmpty() is specific to radio buttons and will check is unset
    *********************************************************************************************************/

    function areControlsEmpty(controls, expectedValue) {
        return _.chain(controls)
                    .filter(function(element) { return element.value !== expectedValue })
                    .isEmpty()
                    .value();
    }

    function areRadioControlsEmpty(controls) {
        return _.chain(controls)
                    .filter(function(element) { return element != "undefined" })
                    .isEmpty()
                    .value();
    }

    function doControlsHaveValue(controls, value) {
        return _.chain(controls)
                    .filter( function(element) { return element.value !== value})
                    .isEmpty()
                    .value();
    }

/**************************************************************************************************************************/

    function formatField(element, formatFunc) {
        element[0].value = formatFunc(element[0].value.replace(/[^0-9]/gi, ''));
    }

    function formatZip(value)
    {
        if (value.length == 9)
            return value.substr(0,5) + "-" + value.substr(5,4);
        return value;
    }

    function formatSsn(value)
    {
        if (value.length == 9) 
            return value.substr(0,3) + "-" + value.substr(3,2) + "-" + value.substr(5,4);
        return value;
    }

/******************************************************************************************************************************/

    function validate() {
        errorMessage = "";

        validateControls($('.idmSSN'), checkFormatSsn, ErrorHandlerRegex);
        validateControls($('.idmZIP'), checkFormatZip, ErrorHandlerRegex);

        validateControls($('.idmSSN'), checkLengthSsn, ErrorHandlerLength);
        validateControls($('.idmZIP'), checkLengthZip, ErrorHandlerLength);

        validateControls($('.percentageOwnership'), checkPercentageRange, ErrorHandlerRange);

        _.each(["3","4","5","6","7","8"], validateReqiredFields(index));

        validateTotalPercentageOwnership();
    }

    function validateControls(controls, validateFunc, errorHandlerFunc) {
        var errorControls = _.filter(controls, validateFunc);

        if (! _.isEmpty(errorControls))
            errorHandlerFunc(errorControls);
    }

    function checkLengthSsn(element) {
        if ((element.value.length != 11) && (element.value != '')) 
                return true;
        return false;
    }

    function checkLengthZip(element) {
        if ((element.value.length != 10 || element.value.length != 5) && (element.value != ''))
            return true;
        return false;
    }

    function checkPercentageRange(element) {
        if (pasreInt(element.value) > 100 || pasreInt(element.value) < 0)
            return true;
        return false;
    }

    function validateRequiredTxt(element) {
        if (element.value !== "")
            return true;
        return false;
    }
    
    function checkFormatSsn(element) {
        return checkElementRegex(element, /^\d{3}-\d{2}-\d{4}$/);
    }

    function checkFormatZip(element) {
        return checkElementRegex(element, /^\d{5}$|^\d{5}-\d{4}$/);
    }

    function checkElementRegex(element, regex) {
        if (!regex.test(element.value) && (element.value != ''))
            return true;
        return false;
    }

    function validateRequiredDdl(ddlControl) {
        var ddlState = $(ddlControl + " option:selected").text();
        if (ddlState === '') {
            ErrorHandlerRequired($('select' + ddlControl));
        }
    }

    /* NEW */
    function validateMarriedTo(ddlControl) {
        if (!checkIndemnitor(ddlControl.text()))
            ErrorHandlerMarriedTo(ddlControl);
    }

    /* NEW */
    function ErrorHandlerMarriedTo(ddlControl) {
        AddErrorMessage("Indemnitor " + getIndemnitor(ddlControl.name) + " cannot be married to Indmenitor " + ddlControl.text() + " as they do not yet exist.");
    }

    function validateReqiredFields(indemnitor) {
        // Validate the required text boxes which are always required
        validateControls($("input.idm" + indemnitor + "Input[type='text']"), validateRequiredTxt, ErrorHandlerRequired);
        
        if ($(".idm" + indemnitor + "Married input[type='radio']:checked").is(":visible")) {
        
            // Get the value for the Married radio button
            var rbMarried = $(".idm" + indemnitor + "Married input[type='radio']:checked").val();
            
            // If the type of the radio button value is undefined then it hasn't been set yet
            if (typeof rbMarried == 'undefined') {
                // throw an error for the radio button being unset and set the rb to '0' to simplify the next if 
                ErrorHandlerRequired($(".idm" + indemnitor + "Married input[type='radio']:checked"));
                rbMarried = '0';
            }
            
            // If the radio button is set to 'Yes'
            if (rbMarried === '1') {
                // Validate the text boxes in the married section
                validateControls($("input.idm" + indemnitor + "Married[type='text']"), validateRequiredTxt, ErrorHandlerRequired);
                
                // Get the value for the married associate radio button
                var rbMarriedAssociate = $(".idm" + indemnitor + "MarriedAssociate input[type='radio']:checked").val();
                
                // if the type of the radio button value is undefined then it has not been set
                if (typeof rbMarriedAssociate == 'undefined') {
                    // throw an error for the radio button being unset and set the rb to '0' to simplify the next if 
                    ErrorHandlerRequired($(".idm" + indemnitor + "MarriedAssociate input[type='radio']:checked"));
                    rbMarriedAssociate = '0';
                }
                 
                 // if the radio button is set to 'Yes' then validate the drop down is set
                if (rbMarriedAssociate === '1') {
                    validateRequiredDdl(".idm" + indemnitor + "MarriedAssociate");
                }  
            }
        }
        
        // Get the value for the indemnitor moved radio button
        var rbMoved = $(".idm" + indemnitor + "Moved input[type='radio']:checked").val();
        
        // if the type of the radio button value is undefined then it has not been set
        if (typeof rbMoved == 'undefined') {
            // throw an error for the radio button being unset and set the rb to '0' to simplify the next if 
            ErrorHandlerRequired($(".idm" + indemnitor + "Moved input[type='radio']:checked"));
            rbMoved = '0';
        }
        
         // if the radio button is set to 'Yes' then validate the text boxes and drop down are set
        if (rbMoved === '1') {
            validateControls($("input.idm" + indemnitor + "Moved[type='text']"), validateRequiredTxt, ErrorHandlerRequired);
            
            //Prev home address state check ...
            validateRequiredDdl(".idm" + indemnitor + "Moved");
        }
        
        //Home state ddl check ...
        validateRequiredDdl(".idm" + indemnitor + "Input");
    }

/*********************************************************************************************************************************************/

    function testArray(indemnitor) {
        var array = [
                       { "MainTextBoxes": "input.idm" + indemnitor + "Input[type='text']"},
                        {"MarriedRadioB": ".idm" + indemnitor + "Married input[type='radio']"}
                    ];

        _.findWhere(array,"MainTextBoxes")
        _.pluck(array, "MainTextBoxes");
    }