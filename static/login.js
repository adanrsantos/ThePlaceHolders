const email = document.getElementById("email");
const emailHelp = document.getElementById("emailHelp");
const emailRegex = /^[^\s@]+@my\.utsa\.edu$/;
const password = document.getElementById("password");
const passwordHelp = document.getElementById("passwordHelp");
const passwordRegex = /^.{8,}$/;

function showPass(){
    if(password.type === "password"){
        password.type = "text";
    }
    else{
        password.type = "password";
    }
}
