
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuButton =
        document.querySelector(".menu-btn");

    const navLinks =
        document.querySelector(".nav-links");

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            navLinks.classList.toggle("mobile-open");

        });

    }


    /* =========================
       FAVORITE COUNT
    ========================= */

    const favoriteCount =
        document.querySelector(".favorite-count");

    const favorites =
        JSON.parse(
            localStorage.getItem("staynestFavorites")
        ) || [];

    if (favoriteCount) {

        favoriteCount.textContent =
            favorites.length;

    }


    /* =========================
       CONTACT FORM
    ========================= */

    const contactForm =
        document.getElementById("contactForm");

    const formMessage =
        document.getElementById("formMessage");


    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();


        const firstName =
            document.getElementById("firstName")
                .value
                .trim();

        const lastName =
            document.getElementById("lastName")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const subject =
            document.getElementById("subject")
                .value;

        const message =
            document.getElementById("message")
                .value
                .trim();


        /* VALIDATION */

        if (
            !firstName ||
            !lastName ||
            !email ||
            !subject ||
            !message
        ) {

            formMessage.textContent =
                "Please complete all fields.";

            return;
        }


        if (!email.includes("@")) {

            formMessage.textContent =
                "Please enter a valid email address.";

            return;
        }


        /* SAVE MESSAGE */

        const contactMessages =
            JSON.parse(
                localStorage.getItem(
                    "staynestContactMessages"
                )
            ) || [];


        contactMessages.push({

            firstName,
            lastName,
            email,
            subject,
            message,

            date:
                new Date().toLocaleString()

        });


        localStorage.setItem(
            "staynestContactMessages",
            JSON.stringify(contactMessages)
        );


        formMessage.textContent =
            "Message sent successfully! We'll get back to you soon. 🎉";


        contactForm.reset();

    });


    /* =========================
       FAQ ACCORDION
    ========================= */

    const faqQuestions =
        document.querySelectorAll(
            ".faq-question"
        );


    faqQuestions.forEach(question => {

        question.addEventListener("click", () => {

            const currentItem =
                question.parentElement;

            const answer =
                currentItem.querySelector(
                    ".faq-answer"
                );


            document
                .querySelectorAll(".faq-item")
                .forEach(item => {

                    if (item !== currentItem) {

                        item.classList.remove("open");

                        item.querySelector(
                            ".faq-answer"
                        ).style.maxHeight = null;

                    }

                });


            currentItem.classList.toggle("open");


            if (
                currentItem.classList.contains("open")
            ) {

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            } else {

                answer.style.maxHeight = null;

            }

        });

    });


    /* =========================
       NEWSLETTER
    ========================= */

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );

    const newsletterEmail =
        document.getElementById(
            "newsletterEmail"
        );

    const newsletterMessage =
        document.getElementById(
            "newsletterMessage"
        );


    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const email =
                newsletterEmail.value.trim();


            if (
                !email ||
                !email.includes("@")
            ) {

                newsletterMessage.textContent =
                    "Please enter a valid email address.";

                return;
            }


            localStorage.setItem(
                "staynestNewsletter",
                email
            );


            newsletterMessage.textContent =
                "You're subscribed! 🎉";


            newsletterForm.reset();

        }
    );

});