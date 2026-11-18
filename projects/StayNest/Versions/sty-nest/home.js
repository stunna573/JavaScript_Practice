/* =====================================================
   STAYNEST - HOME PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchButton = document.getElementById("Search");
    const guestSelect = document.getElementById("Guest");

    const destinationInput = document.querySelector(
        ".search-field.destination input"
    );

    const dateInputs = document.querySelectorAll(
        '.search-field input[type="date"]'
    );

    const checkInInput = dateInputs[0];
    const checkOutInput = dateInputs[1];

    const destinationCards = document.querySelectorAll(
        ".destination-card"
    );

    const stayCards = document.querySelectorAll(
        ".stay-card"
    );

    const favoriteButtons = document.querySelectorAll(
        ".favorite"
    );

    const newsletterForm = document.querySelector(
        ".newsletter-form"
    );

    const newsletterInput = document.querySelector(
        ".newsletter-form input"
    );

    const bookButton = document.querySelector(
        ".book-button"
    );

    const menuButton = document.querySelector(
        ".menu"
    );

    const nav = document.querySelector(
        ".navbar"
    );

    const navLinks = document.querySelectorAll(
        ".enquires li"
    );

    const logo = document.querySelector(
        ".logo"
    );

    const footerLogo = document.querySelector(
        ".footer-logo"
    );


    /* =====================================================
       MESSAGE / TOAST
    ===================================================== */

    function showMessage(message, type = "success") {

        const oldMessage =
            document.querySelector(".staynest-message");

        if (oldMessage) {
            oldMessage.remove();
        }

        const messageBox =
            document.createElement("div");

        messageBox.className =
            "staynest-message";

        messageBox.textContent =
            message;

        messageBox.style.position = "fixed";
        messageBox.style.top = "20px";
        messageBox.style.left = "50%";
        messageBox.style.transform =
            "translateX(-50%)";

        messageBox.style.padding =
            "12px 20px";

        messageBox.style.borderRadius =
            "8px";

        messageBox.style.fontSize =
            "14px";

        messageBox.style.fontWeight =
            "600";

        messageBox.style.zIndex =
            "9999";

        messageBox.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.15)";

        if (type === "error") {

            messageBox.style.backgroundColor =
                "#ffe5e5";

            messageBox.style.color =
                "#b42318";

        } else {

            messageBox.style.backgroundColor =
                "#e7f8ed";

            messageBox.style.color =
                "#147a3d";
        }

        document.body.appendChild(
            messageBox
        );

        setTimeout(() => {

            if (messageBox) {
                messageBox.remove();
            }

        }, 3000);
    }


    /* =====================================================
       NORMALIZE SEARCH TEXT
    ===================================================== */

    function normalize(text) {

        return text
            .toLowerCase()
            .trim()
            .replace(/[.,]/g, "")
            .replace(/\s+/g, " ");
    }


    /* =====================================================
       DATE SETUP
    ===================================================== */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    if (checkInInput) {
        checkInInput.min = today;
    }

    if (checkOutInput) {
        checkOutInput.min = today;
    }


    /* =====================================================
       DATE VALIDATION
    ===================================================== */

    if (checkInInput && checkOutInput) {

        checkInInput.addEventListener(
            "change",
            () => {

                if (!checkInInput.value) {
                    return;
                }

                const checkInDate =
                    new Date(checkInInput.value);

                const nextDay =
                    new Date(checkInDate);

                nextDay.setDate(
                    nextDay.getDate() + 1
                );

                checkOutInput.min =
                    nextDay
                        .toISOString()
                        .split("T")[0];

                if (
                    checkOutInput.value &&
                    new Date(checkOutInput.value) <=
                    checkInDate
                ) {

                    checkOutInput.value = "";
                }
            }
        );
    }


    /* =====================================================
       FIND SEARCH RESULT TYPE
    ===================================================== */

    function findSearchResult(query) {

        const normalizedQuery =
            normalize(query);

        if (!normalizedQuery) {
            return null;
        }


        /* ---------------------------------------------
           FIRST: LOOK FOR AN EXACT STAY
        --------------------------------------------- */

        for (const card of stayCards) {

            const nameElement =
                card.querySelector(
                    ".stay-content h3"
                );

            const locationElement =
                card.querySelector(
                    ".location"
                );

            const name =
                normalize(
                    nameElement
                        ? nameElement.textContent
                        : ""
                );

            const location =
                normalize(
                    locationElement
                        ? locationElement.textContent
                        : ""
                );

            if (
                name === normalizedQuery
            ) {

                return {
                    type: "stay",
                    value:
                        nameElement.textContent.trim()
                };
            }
        }


        /* ---------------------------------------------
           SECOND: LOOK FOR A DESTINATION
        --------------------------------------------- */

        for (const card of destinationCards) {

            const nameElement =
                card.querySelector(
                    ".destination-info h4"
                );

            if (!nameElement) {
                continue;
            }

            const destination =
                nameElement.textContent.trim();

            const normalizedDestination =
                normalize(destination);

            const destinationShort =
                normalizedDestination
                    .split(" ")[0];


            if (
                normalizedDestination ===
                normalizedQuery ||

                normalizedDestination.includes(
                    normalizedQuery
                ) ||

                normalizedQuery.includes(
                    destinationShort
                )
            ) {

                return {
                    type: "destination",
                    value: destination
                };
            }
        }


        /* ---------------------------------------------
           THIRD: PARTIAL STAY SEARCH
        --------------------------------------------- */

        for (const card of stayCards) {

            const nameElement =
                card.querySelector(
                    ".stay-content h3"
                );

            const locationElement =
                card.querySelector(
                    ".location"
                );

            const name =
                normalize(
                    nameElement
                        ? nameElement.textContent
                        : ""
                );

            const location =
                normalize(
                    locationElement
                        ? locationElement.textContent
                        : ""
                );

            if (
                name.includes(normalizedQuery) ||
                location.includes(normalizedQuery)
            ) {

                return {
                    type: "stay",
                    value:
                        nameElement.textContent.trim()
                };
            }
        }


        return null;
    }


    /* =====================================================
       HOME SEARCH
    ===================================================== */

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            () => {

                const query =
                    destinationInput
                        ? destinationInput.value.trim()
                        : "";

                const checkIn =
                    checkInInput
                        ? checkInInput.value
                        : "";

                const checkOut =
                    checkOutInput
                        ? checkOutInput.value
                        : "";

                const guests =
                    guestSelect
                        ? guestSelect.value
                        : "";


                /* -----------------------------------------
                   DESTINATION REQUIRED
                ----------------------------------------- */

                if (!query) {

                    showMessage(
                        "Please enter a destination or stay.",
                        "error"
                    );

                    if (destinationInput) {
                        destinationInput.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   DATE VALIDATION
                ----------------------------------------- */

                if (!checkIn || !checkOut) {

                    showMessage(
                        "Please select your check-in and check-out dates.",
                        "error"
                    );

                    return;
                }


                const checkInDate =
                    new Date(checkIn);

                const checkOutDate =
                    new Date(checkOut);


                if (
                    checkOutDate <=
                    checkInDate
                ) {

                    showMessage(
                        "Check-out must be after check-in.",
                        "error"
                    );

                    return;
                }


                /* -----------------------------------------
                   FIND WHAT USER SEARCHED FOR
                ----------------------------------------- */

                const result =
                    findSearchResult(query);


                if (!result) {

                    showMessage(
                        `No destination or stay found for "${query}".`,
                        "error"
                    );

                    return;
                }


                /* -----------------------------------------
                   SAVE SEARCH
                ----------------------------------------- */

                localStorage.setItem(
                    "staynestLastSearch",
                    query
                );

                localStorage.setItem(
                    "staynestSearchDates",
                    JSON.stringify({
                        checkIn,
                        checkOut,
                        guests
                    })
                );


                /* -----------------------------------------
                   DESTINATION RESULT
                ----------------------------------------- */

                if (result.type === "destination") {

                    window.location.href =
                        `destinations.html?search=${encodeURIComponent(
                            result.value
                        )}`;

                    return;
                }


                /* -----------------------------------------
                   STAY RESULT
                ----------------------------------------- */

                if (result.type === "stay") {

                    window.location.href =
                        `stays.html?search=${encodeURIComponent(
                            result.value
                        )}`;

                    return;
                }
            }
        );
    }


    /* =====================================================
       ENTER KEY SEARCH
    ===================================================== */

    if (destinationInput) {

        destinationInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    if (searchButton) {
                        searchButton.click();
                    }
                }
            }
        );
    }


    /* =====================================================
       DESTINATION CARD CLICK
    ===================================================== */

    destinationCards.forEach(card => {

        card.style.cursor = "pointer";

        card.addEventListener(
            "click",
            event => {

                /* Don't navigate when favorite button
                   is clicked */
                if (
                    event.target.closest(
                        ".favorite-button"
                    )
                ) {
                    return;
                }

                const nameElement =
                    card.querySelector(
                        ".destination-info h4"
                    );

                if (!nameElement) {
                    return;
                }

                const destination =
                    nameElement.textContent.trim();


                localStorage.setItem(
                    "staynestSelectedDestination",
                    destination
                );


                window.location.href =
                    `destinations.html?search=${encodeURIComponent(
                        destination
                    )}`;
            }
        );
    });


    /* =====================================================
       STAY CARD CLICK
    ===================================================== */

    stayCards.forEach(card => {

        card.style.cursor = "pointer";

        card.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".favorite"
                    )
                ) {
                    return;
                }

                const nameElement =
                    card.querySelector(
                        ".stay-content h3"
                    );

                if (!nameElement) {
                    return;
                }

                const stay =
                    nameElement.textContent.trim();


                localStorage.setItem(
                    "staynestSelectedStay",
                    stay
                );


                window.location.href =
                    `stays.html?search=${encodeURIComponent(
                        stay
                    )}`;
            }
        );
    });


    /* =====================================================
       FAVORITES
    ===================================================== */

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "staynestFavorites"
            ) || "[]"
        );


    function updateFavoriteButtons() {

        favoriteButtons.forEach(
            button => {

                const card =
                    button.closest(
                        ".stay-card"
                    );

                if (!card) {
                    return;
                }

                const nameElement =
                    card.querySelector(
                        ".stay-content h3"
                    );

                if (!nameElement) {
                    return;
                }

                const name =
                    nameElement
                        .textContent
                        .trim();


                if (
                    favorites.includes(name)
                ) {

                    button.textContent = "♥";

                } else {

                    button.textContent = "♡";
                }
            }
        );
    }


    updateFavoriteButtons();


    favoriteButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const card =
                        button.closest(
                            ".stay-card"
                        );

                    if (!card) {
                        return;
                    }

                    const nameElement =
                        card.querySelector(
                            ".stay-content h3"
                        );

                    if (!nameElement) {
                        return;
                    }

                    const name =
                        nameElement
                            .textContent
                            .trim();


                    if (
                        favorites.includes(name)
                    ) {

                        favorites =
                            favorites.filter(
                                item =>
                                    item !== name
                            );

                        showMessage(
                            `${name} removed from favorites.`
                        );

                    } else {

                        favorites.push(name);

                        showMessage(
                            `${name} added to favorites.`
                        );
                    }


                    localStorage.setItem(
                        "staynestFavorites",
                        JSON.stringify(
                            favorites
                        )
                    );

                    updateFavoriteButtons();
                }
            );
        }
    );


    /* =====================================================
       FAVORITES NAVIGATION
    ===================================================== */

    const accountItems =
        document.querySelectorAll(
            ".accounts li"
        );

    if (accountItems.length > 0) {

        accountItems[0].addEventListener(
            "click",
            () => {

                if (favorites.length === 0) {

                    showMessage(
                        "You haven't added any favorites yet.",
                        "error"
                    );

                    return;
                }

                window.location.href =
                    `stays.html?favorites=true`;
            }
        );
    }


    /* =====================================================
       BOOK BUTTON
    ===================================================== */

    if (bookButton) {

        bookButton.addEventListener(
            "click",
            () => {

                if (destinationInput) {

                    destinationInput.focus();

                    const searchBox =
                        document.querySelector(
                            ".questions"
                        );

                    if (searchBox) {

                        searchBox.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }

                    showMessage(
                        "Choose your destination and dates to continue."
                    );
                }
            }
        );
    }


    /* =====================================================
       COUNTDOWN
    ===================================================== */

    const countdown =
        document.querySelector(
            ".countdown"
        );

    if (countdown) {

        const countdownBoxes =
            countdown.querySelectorAll(
                "div"
            );

        let endTime =
            localStorage.getItem(
                "staynestOfferEnd"
            );

        if (!endTime) {

            endTime =
                Date.now() +
                (2 * 24 * 60 * 60 * 1000);

            localStorage.setItem(
                "staynestOfferEnd",
                endTime
            );
        }

        endTime =
            parseInt(endTime);


        function updateCountdown() {

            const remaining =
                endTime - Date.now();

            if (remaining <= 0) {

                countdownBoxes.forEach(
                    box => {

                        const number =
                            box.querySelector(
                                "strong"
                            );

                        if (number) {
                            number.textContent =
                                "00";
                        }
                    }
                );

                return;
            }


            const days =
                Math.floor(
                    remaining /
                    (1000 * 60 * 60 * 24)
                );

            const hours =
                Math.floor(
                    (remaining /
                        (1000 * 60 * 60)) %
                    24
                );

            const minutes =
                Math.floor(
                    (remaining /
                        (1000 * 60)) %
                    60
                );

            const seconds =
                Math.floor(
                    (remaining / 1000) %
                    60
                );


            const values = [
                days,
                hours,
                minutes,
                seconds
            ];


            countdownBoxes.forEach(
                (box, index) => {

                    const number =
                        box.querySelector(
                            "strong"
                        );

                    if (number) {

                        number.textContent =
                            String(
                                values[index]
                            ).padStart(2, "0");
                    }
                }
            );
        }


        updateCountdown();

        setInterval(
            updateCountdown,
            1000
        );
    }


    /* =====================================================
       NEWSLETTER
    ===================================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const email =
                    newsletterInput
                        ? newsletterInput.value.trim()
                        : "";


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!email) {

                    showMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    return;
                }


                if (
                    !emailPattern.test(email)
                ) {

                    showMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                localStorage.setItem(
                    "staynestNewsletterEmail",
                    email
                );


                newsletterInput.value = "";


                showMessage(
                    "You're subscribed! Welcome to StayNest."
                );
            }
        );
    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    navLinks.forEach(
        link => {

            const anchor =
                link.querySelector("a");

            if (!anchor) {
                return;
            }

            link.addEventListener(
                "click",
                event => {

                    const href =
                        anchor.getAttribute("href");

                    if (
                        href &&
                        href !== "#"
                    ) {
                        return;
                    }

                    event.preventDefault();
                }
            );
        }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuButton && nav) {

        menuButton.addEventListener(
            "click",
            () => {

                nav.classList.toggle(
                    "mobile-menu-open"
                );

                let mobileMenu =
                    document.querySelector(
                        ".staynest-mobile-menu"
                    );


                if (!mobileMenu) {

                    mobileMenu =
                        document.createElement(
                            "ul"
                        );

                    mobileMenu.className =
                        "staynest-mobile-menu";


                    const pages = [
                        ["Home", "home.html"],
                        ["Destinations", "destinations.html"],
                        ["Stays", "stays.html"],
                        ["Deals", "deals.html"],
                        ["About Us", "about.html"],
                        ["Contact", "contact.html"]
                    ];


                    pages.forEach(
                        ([name, href]) => {

                            const item =
                                document.createElement(
                                    "li"
                                );

                            const link =
                                document.createElement(
                                    "a"
                                );

                            link.textContent =
                                name;

                            link.href =
                                href;

                            item.appendChild(link);

                            mobileMenu.appendChild(
                                item
                            );
                        }
                    );


                    nav.appendChild(
                        mobileMenu
                    );
                }


                mobileMenu.classList.toggle(
                    "show"
                );
            }
        );
    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                const mobileMenu =
                    document.querySelector(
                        ".staynest-mobile-menu"
                    );

                if (mobileMenu) {
                    mobileMenu.classList.remove(
                        "show"
                    );
                }

                if (nav) {
                    nav.classList.remove(
                        "mobile-menu-open"
                    );
                }
            }
        }
    );


    /* =====================================================
       LOGOS
    ===================================================== */

    if (logo) {

        logo.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    if (footerLogo) {

        footerLogo.addEventListener(
            "click",
            event => {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    /* =====================================================
       APP BUTTONS
    ===================================================== */

    document.querySelectorAll(
        ".app-buttons button"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    showMessage(
                        "The StayNest app will be available soon."
                    );
                }
            );
        }
    );


    console.log(
        "StayNest Home JS loaded successfully."
    );

});