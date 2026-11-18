document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       GET CURRENT USER
    ========================= */

    let currentUser = JSON.parse(
        localStorage.getItem("staynestCurrentUser") || "null"
    );


    /* =========================
       CHECK LOGIN
    ========================= */

    


    /* =========================
       ELEMENTS
    ========================= */

    const profileInitial =
        document.getElementById("profileInitial");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const accountId =
        document.getElementById("accountId");

    const fullNameInput =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("email");

    const profileForm =
        document.getElementById("profileForm");

    const formMessage =
        document.getElementById("formMessage");

    const logoutButton =
        document.getElementById("logoutButton");

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.querySelector(".nav-links");


    /* =========================
       MOBILE MENU
    ========================= */

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });

    }


    /* =========================
       DISPLAY USER
    ========================= */

    function displayUser() {

        const name =
            currentUser.name || "Traveler";

        const email =
            currentUser.email || "";

        profileName.textContent = name;

        profileEmail.textContent = email;

        profileInitial.textContent =
            name.charAt(0).toUpperCase();

        fullNameInput.value = name;

        emailInput.value = email;

        accountId.textContent =
            currentUser.id || "—";
    }


    displayUser();


    /* =========================
       UPDATE PROFILE
    ========================= */

    profileForm.addEventListener("submit", event => {

        event.preventDefault();


        const newName =
            fullNameInput.value.trim();

        const newEmail =
            emailInput.value.trim().toLowerCase();


        /* RESET MESSAGE */

        formMessage.textContent = "";

        formMessage.className =
            "form-message";


        /* =========================
           VALIDATION
        ========================= */

        if (newName.length < 2) {

            showError(
                "Please enter your full name."
            );

            return;
        }


        if (!newEmail) {

            showError(
                "Please enter your email address."
            );

            return;
        }


        /* =========================
           GET ALL ACCOUNTS
        ========================= */

        let accounts = JSON.parse(
            localStorage.getItem("staynestAccounts") || "[]"
        );


        if (!Array.isArray(accounts)) {
            accounts = [];
        }


        /* =========================
           CHECK EMAIL
        ========================= */

        const emailAlreadyUsed =
            accounts.some(account => {

                return (
                    account.id !== currentUser.id &&
                    (account.email || "")
                        .trim()
                        .toLowerCase() === newEmail
                );

            });


        if (emailAlreadyUsed) {

            showError(
                "That email is already connected to another account."
            );

            return;
        }


        /* =========================
           UPDATE ACCOUNT
        ========================= */

        const accountIndex =
            accounts.findIndex(
                account =>
                    account.id === currentUser.id
            );


        if (accountIndex !== -1) {

            accounts[accountIndex].name =
                newName;

            accounts[accountIndex].email =
                newEmail;

            localStorage.setItem(
                "staynestAccounts",
                JSON.stringify(accounts)
            );

        }


        /* =========================
           UPDATE CURRENT USER
        ========================= */

        currentUser.name =
            newName;

        currentUser.email =
            newEmail;


        localStorage.setItem(
            "staynestCurrentUser",
            JSON.stringify(currentUser)
        );


        /* =========================
           UPDATE SCREEN
        ========================= */

        displayUser();


        showSuccess(
            "Your profile has been updated successfully."
        );

    });


    /* =========================
       LOGOUT
    ========================= */

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem(
            "staynestCurrentUser"
        );

        window.location.href =
            "login.html";

    });


    /* =========================
       MESSAGE HELPERS
    ========================= */

    function showError(message) {

        formMessage.textContent = message;

        formMessage.className =
            "form-message error";
    }


    function showSuccess(message) {

        formMessage.textContent = message;

        formMessage.className =
            "form-message success";
    }

});