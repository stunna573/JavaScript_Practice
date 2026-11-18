document.addEventListener("DOMContentLoaded", () => {


    /* ================= ELEMENTS ================= */

    const signupForm =
        document.getElementById("signupForm");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const formMessage =
        document.getElementById("formMessage");


    /* ================= FORM SUBMIT ================= */

    signupForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const nameValue =
                fullName.value.trim();

            const emailValue =
                email.value.trim().toLowerCase();

            const passwordValue =
                password.value;

            const confirmPasswordValue =
                confirmPassword.value;


            /* ================= VALIDATION ================= */

            if (!nameValue) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                fullName.focus();

                return;
            }


            if (!emailValue) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                email.focus();

                return;
            }


            if (passwordValue.length < 6) {

                showMessage(
                    "Password must be at least 6 characters.",
                    "error"
                );

                password.focus();

                return;
            }


            if (passwordValue !== confirmPasswordValue) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                confirmPassword.focus();

                return;
            }


            /* ================= GET ACCOUNTS ================= */

            const ACCOUNT_KEY =
                "staynestAccounts";

            let accounts = [];


            try {

                accounts =
                    JSON.parse(
                        localStorage.getItem(
                            ACCOUNT_KEY
                        )
                    ) || [];

            } catch {

                accounts = [];

            }


            /* ================= CHECK EXISTING ACCOUNT ================= */

            const existingAccount =
                accounts.find(
                    account =>
                        account.email === emailValue
                );


            if (existingAccount) {

                showMessage(
                    "An account with this email already exists.",
                    "error"
                );

                email.focus();

                return;
            }


            /* ================= CREATE ACCOUNT ================= */

            const account = {

                id:
                    "USER-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 10)
                        .toUpperCase(),

                name: nameValue,

                email: emailValue,

                password: passwordValue,

                createdAt:
                    new Date().toISOString()

            };


            accounts.push(account);


            localStorage.setItem(
                ACCOUNT_KEY,
                JSON.stringify(accounts)
            );


            /* ================= SAVE CURRENT USER ================= */

            localStorage.setItem(
                "staynestCurrentUser",
                JSON.stringify({
                    id: account.id,
                    name: account.name,
                    email: account.email
                })
            );


            /* ================= SUCCESS ================= */

            showMessage(
                "Account created successfully! Redirecting...",
                "success"
            );


            signupForm.reset();


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 1000);

        }
    );


    /* ================= MESSAGE FUNCTION ================= */

    function showMessage(message, type) {

        formMessage.textContent =
            message;

        if (type === "success") {

            formMessage.style.color =
                "#2b9b50";

        } else {

            formMessage.style.color =
                "#d64545";

        }

    }

});