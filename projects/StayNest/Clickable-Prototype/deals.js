document.addEventListener("DOMContentLoaded", () => {

    /* ================= MOBILE MENU ================= */

    const menuButton = document.getElementById("menuButton");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
    }


    /* ================= COPY PROMO CODE ================= */

    const copyCodeButton = document.getElementById("copyCode");

    if (copyCodeButton) {

        copyCodeButton.addEventListener("click", async () => {

            const promoCode = "STAYNEST20";

            try {

                await navigator.clipboard.writeText(promoCode);

                copyCodeButton.textContent = "Copied!";

                setTimeout(() => {
                    copyCodeButton.textContent = "Copy Code";
                }, 2000);

            } catch (error) {

                copyCodeButton.textContent = "STAYNEST20";

            }

        });

    }


    /* ================= NEWSLETTER ================= */

    const newsletterForm =
        document.getElementById("newsletterForm");

    const newsletterEmail =
        document.getElementById("newsletterEmail");

    const newsletterMessage =
        document.getElementById("newsletterMessage");


    if (newsletterForm) {

        newsletterForm.addEventListener("submit", event => {

            event.preventDefault();

            const email = newsletterEmail.value.trim();

            if (!email) {
                return;
            }

            localStorage.setItem(
                "staynestNewsletterEmail",
                email
            );

            newsletterMessage.textContent =
                "You're subscribed! We'll keep you updated with our latest deals.";

            newsletterEmail.value = "";

        });

    }

});