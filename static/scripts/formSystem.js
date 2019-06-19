function verifPassWord() {
    let text = document.forms[0].elements[2].value;
    switch(zxcvbn(text).score) {
        case 0 && 1:
            document.getElementById("password").className = "input is-danger";
            return "invalid";
        case 2 && 3:
            document.getElementById("password").className = "input is-warning";
            return "valid";
        case 4:
            document.getElementById("password").className = "input is-success";
            return "valid";
    }
}

function verifForm() {
    let form1 = document.forms[0].elements[0].value;
    let form2 = document.forms[0].elements[1].value;
    let form3 = document.forms[0].elements[2].value;
    if(form1 && form2 && form3) {
        document.getElementById("btn-submit").disabled = false;
        return "valid"
    } else {
        document.getElementById("btn-submit").disabled = true;
        return "invalid";
    }
}

function finalVerif() {
    let verif1 = verifForm();
    let verif2 = verifPassWord();

    if(verif1 === "invalid") return false;
    else if(verif1 === "valid") return true;

    if(verif2 === "invalid") return false;
    else if(verif2 === "valid") return true;
}