function setRules() {
    let ruleElems = document.getElementsByClassName("span-rule");
    let ruleButton = document.getElementsByClassName("edit-rules")[0];

    // Set editable textareas instead of fixed text for every game rule
    Array.from(ruleElems).forEach(
        function(element, index, array) {
            // Add a remove element button
            addRemoveElementButton(element, "rule");

            let textArea = document.createElement("textarea");
            textArea.setAttribute("name", "rule");
            textArea.setAttribute("class", "rule");
            textArea.innerHTML = element.innerHTML;
            element.parentNode.insertBefore(textArea, element);
            element.parentNode.removeChild(element)
        }
    );

    // Add a button for adding game rules
    let addRule = document.createElement("div");
    addRule.setAttribute("class", "add-rule");
    addRule.setAttribute("onclick", "addPrepOrRule('rules-list', 'rule')");
    addRule.innerHTML = "+ Lägg till regel";
    ruleButton.parentNode.insertBefore(addRule, ruleButton);
    ruleButton.parentNode.removeChild(ruleButton);

}

function setPreps() {
    let prepElems = document.getElementsByClassName("span-prep");
    let prepButton = document.getElementsByClassName("edit-preps")[0];

    // Set editable textareas instead of fixed text for every game preparation
    Array.from(prepElems).forEach(
        function(element, index, array) {
            // Add a remove element button
            addRemoveElementButton(element, "prep");

            let textArea = document.createElement("textarea");
            textArea.setAttribute("name", "prep");
            textArea.setAttribute("class", "prep");
            textArea.innerHTML = element.innerHTML;
            element.parentNode.insertBefore(textArea, element);
            element.parentNode.removeChild(element);
        }
    );

    // Add a button for adding game preparations
    let addPrep = document.createElement("div");
    addPrep.setAttribute("class", "add-prep");
    addPrep.setAttribute("onclick", "addPrepOrRule('preps-list', 'prep')");
    addPrep.innerHTML = "+ Lägg till förberedelse";
    prepButton.parentNode.insertBefore(addPrep, prepButton);
    prepButton.parentNode.removeChild(prepButton);
}

function addPrepOrRule(listID, prepOrRule) {
    // Find the list
    let list = document.getElementById(listID);

    // Append a new prep field
    let li = document.createElement("li");
    let textarea = document.createElement("textarea");
    textarea.setAttribute("class", prepOrRule);
    textarea.setAttribute("name", prepOrRule);
    if (prepOrRule == "prep") {
        textarea.setAttribute("placeholder", "Ny förberedelse..")
    } else if (prepOrRule == "rule") {
        textarea.setAttribute("placeholder", "Ny regel..")
    }
    li.appendChild(textarea);
    list.appendChild(li);

    // Add a remove element button
    addRemoveElementButton(textarea, prepOrRule);
}

function removeElement(clickedElem) {
    clickedElem.parentNode.parentNode.removeChild(clickedElem.parentNode);
}

function addRemoveElementButton(element, prepOrRule){
    // Add a remove element button
    let removeBtn = document.createElement("span");
    removeBtn.setAttribute("class", "remove-elem");
    removeBtn.setAttribute("onclick", "removeElement(this)");
    if(prepOrRule == "rule"){
        removeBtn.innerHTML = "- Ta bort regel";
    } else if(prepOrRule == "prep"){
        removeBtn.innerHTML = "- Ta bort förberedelse";
    }

    element.parentNode.appendChild(removeBtn);
}


function setAllTextareas(){
    let ruleElems = document.getElementsByClassName("span-rule");
    let prepElems = document.getElementsByClassName("prep-rule");

    // Set editable textareas instead of fixed text for every game rule
    Array.from(ruleElems).forEach(
        function(element, index, array) {
            let textArea = document.createElement("textarea");
            textArea.setAttribute("name", "rule");
            textArea.setAttribute("class", "rule");
            textArea.innerHTML = element.innerHTML;
            element.parentNode.insertBefore(textArea, element);
            element.parentNode.removeChild(element)
        }
    );

    // Set editable textareas instead of fixed text for every game prep
    Array.from(prepElems).forEach(
        function(element, index, array) {
            let textArea = document.createElement("textarea");
            textArea.setAttribute("name", "prep");
            textArea.setAttribute("class", "prep");
            textArea.innerHTML = element.innerHTML;
            element.parentNode.insertBefore(textArea, element);
            element.parentNode.removeChild(element)
        }
    );
}