const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function() {
    const pswdInput = document.querySelector("#account-password");
    const inputType = pswdInput.getAttribute("type");
    if (inputType == "password") {
        pswdInput.setAttribute("type", "text");
        pswdBtn.setAttribute("src", "/images/site/eye-open.webp");
    } else {
        pswdInput.setAttribute("type", "password");
        pswdBtn.setAttribute("src", "/images/site/eye-close.webp");
    }
})