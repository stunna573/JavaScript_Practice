document.addEventListener("DOMContentLoaded", () => {


    /* ================= ELEMENTS ================= */

    const loginForm =
        document.getElementById("loginForm");

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");

    const formMessage =
        document.getElementById("formMessage");


    /* ================= FORM SUBMIT ================= */

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const emailValue =
                email.value.trim().toLowerCase();

            const passwordValue =
                password.value;


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


            /* ================= FIND ACCOUNT ================= */

            const account =
                accounts.find(
                    user =>
                        user.email === emailValue
                );


            if (!account) {

                showMessage(
                    "No account was found with this email.",
                    "error"
                );

                email.focus();

                return;
            }


            /* ================= CHECK PASSWORD ================= */

            if (
                account.password !==
                passwordValue
            ) {

                showMessage(
                    "Incorrect password. Please try again.",
                    "error"
                );

                password.focus();

                return;
            }


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
                "Login successful! Redirecting...",
                "success"
            );


            loginForm.reset();


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