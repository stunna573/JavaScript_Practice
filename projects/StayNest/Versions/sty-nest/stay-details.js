document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       STAY DATA
    ================================================= */

    const stays = {

        "Oceanview Resort & Spa": {
            name: "Oceanview Resort & Spa",
            location: "Bali, Indonesia",
            type: "Resort",
            price: 120,
            rating: 4.8,
            reviews: "2,425 reviews",
            image: "./Assets/ocean_view.jpeg",
            description:
                "A beautiful oceanfront resort in Bali offering relaxing surroundings, comfortable accommodation and an unforgettable tropical getaway."
        },

        "The Grand Paris Hotel": {
            name: "The Grand Paris Hotel",
            location: "Paris, France",
            type: "Hotel",
            price: 210,
            rating: 4.7,
            reviews: "2,356 reviews",
            image: "./Assets/grand_paris.jpeg",
            description:
                "A stylish Parisian hotel offering a comfortable stay close to the beauty, culture and attractions of Paris."
        },

        "Maldives Paradise": {
            name: "Maldives Paradise",
            location: "Maldives",
            type: "Resort",
            price: 350,
            rating: 4.9,
            reviews: "1,785 reviews",
            image: "./Assets/maldavies_paradise_.jpeg",
            description:
                "A tropical island escape surrounded by beautiful scenery, peaceful surroundings and the clear waters of the Maldives."
        },

        "Luxury Stay Dubai": {
            name: "Luxury Stay Dubai",
            location: "Dubai, UAE",
            type: "Hotel",
            price: 160,
            rating: 4.6,
            reviews: "1,102 reviews",
            image: "./Assets/luxury_stay_.jpeg",
            description:
                "A comfortable Dubai stay combining modern accommodation with easy access to the city's attractions and experiences."
        },

        "Blue Horizon Hotel": {
            name: "Blue Horizon Hotel",
            location: "New York, USA",
            type: "Hotel",
            price: 190,
            rating: 4.7,
            reviews: "1,932 reviews",
            image: "./Assets/blue_horizon.jpeg",
            description:
                "A comfortable New York hotel offering a convenient base for exploring the city's energy, entertainment and iconic attractions."
        }

    };


    /* =================================================
       GET SELECTED STAY
    ================================================= */

    const params = new URLSearchParams(
        window.location.search
    );

    const stayNameFromURL =
        params.get("stay");

    const savedStay =
        localStorage.getItem(
            "staynestSelectedStay"
        );

    const selectedStayName =
        stayNameFromURL || savedStay;


    /* =================================================
       CHECK STAY
    ================================================= */

    if (
        !selectedStayName ||
        !stays[selectedStayName]
    ) {

        document.body.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                justify-content:center;
                align-items:center;
                text-align:center;
                padding:30px;
                font-family:Arial,sans-serif;
                color:#15193A;
            ">

                <div>

                    <h1>
                        Stay not found
                    </h1>

                    <p style="
                        margin:15px 0 25px;
                        color:#666;
                    ">
                        We couldn't find the stay you're
                        looking for.
                    </p>

                    <a
                        href="stays.html"
                        style="
                            display:inline-block;
                            padding:13px 22px;
                            background:#F3AE31;
                            border-radius:8px;
                            text-decoration:none;
                            color:#15193A;
                            font-weight:bold;
                        "
                    >
                        Back to stays
                    </a>

                </div>

            </div>
        `;

        return;
    }


    const stay =
        stays[selectedStayName];


    /* =================================================
       ELEMENTS
    ================================================= */

    const stayImage =
        document.getElementById("stayImage");

    const stayName =
        document.getElementById("stayName");

    const stayLocation =
        document.getElementById("stayLocation");

    const stayType =
        document.getElementById("stayType");

    const stayRating =
        document.getElementById("stayRating");

    const stayReviews =
        document.getElementById("stayReviews");

    const stayPrice =
        document.getElementById("stayPrice");

    const stayDescription =
        document.getElementById("stayDescription");

    const breadcrumbStay =
        document.getElementById("breadcrumbStay");

    const locationTitle =
        document.getElementById("locationTitle");

    const smallRating =
        document.getElementById("smallRating");

    const favoriteButton =
        document.getElementById("favoriteButton");

    const bookButton =
        document.getElementById("bookButton");


    /* =================================================
       DISPLAY STAY
    ================================================= */

    stayImage.src =
        stay.image;

    stayImage.alt =
        stay.name;

    stayName.textContent =
        stay.name;

    stayLocation.textContent =
        `📍 ${stay.location}`;

    stayType.textContent =
        stay.type;

    stayRating.textContent =
        stay.rating;

    stayReviews.textContent =
        `(${stay.reviews})`;

    stayPrice.textContent =
        stay.price;

    stayDescription.textContent =
        stay.description;

    breadcrumbStay.textContent =
        stay.name;

    locationTitle.textContent =
        stay.location;

    smallRating.textContent =
        stay.rating;

    document.title =
        `${stay.name} | StayNest`;


    /* =================================================
       SAVE SELECTED STAY
    ================================================= */

    localStorage.setItem(
        "staynestSelectedStay",
        stay.name
    );


    /* =================================================
       SEARCH INFORMATION
    ================================================= */

    const savedDates =
        JSON.parse(
            localStorage.getItem(
                "staynestSearchDates"
            )
        );


    if (savedDates) {

        const checkInDisplay =
            document.getElementById(
                "checkInDisplay"
            );

        const checkOutDisplay =
            document.getElementById(
                "checkOutDisplay"
            );

        if (
            savedDates.checkIn
        ) {

            checkInDisplay.textContent =
                formatDate(
                    savedDates.checkIn
                );

        }

        if (
            savedDates.checkOut
        ) {

            checkOutDisplay.textContent =
                formatDate(
                    savedDates.checkOut
                );

        }

    }


    /* =================================================
       GUEST INFORMATION
    ================================================= */

    const savedGuests =
        localStorage.getItem(
            "staynestGuests"
        );

    const guestsDisplay =
        document.getElementById(
            "guestsDisplay"
        );

    if (savedGuests) {

        guestsDisplay.textContent =
            savedGuests;

    }


    /* =================================================
       FAVORITES
    ================================================= */

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "staynestFavorites"
            )
        ) || [];


    function updateFavoriteButton() {

        if (
            favorites.includes(
                stay.name
            )
        ) {

            favoriteButton.textContent =
                "♥";

            favoriteButton.classList.add(
                "saved"
            );

            favoriteButton.setAttribute(
                "aria-label",
                "Remove from favorites"
            );

        } else {

            favoriteButton.textContent =
                "♡";

            favoriteButton.classList.remove(
                "saved"
            );

            favoriteButton.setAttribute(
                "aria-label",
                "Add to favorites"
            );

        }

    }


    updateFavoriteButton();


    favoriteButton.addEventListener(
        "click",
        () => {

            if (
                favorites.includes(
                    stay.name
                )
            ) {

                favorites =
                    favorites.filter(
                        name =>
                            name !== stay.name
                    );

            } else {

                favorites.push(
                    stay.name
                );

            }


            localStorage.setItem(
                "staynestFavorites",
                JSON.stringify(
                    favorites
                )
            );


            updateFavoriteButton();

        }
    );


    /* =================================================
       BOOK NOW
    ================================================= */

    bookButton.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "staynestSelectedStay",
                stay.name
            );


            window.location.href =
                `booking.html?stay=${encodeURIComponent(
                    stay.name
                )}`;

        }
    );


    /* =================================================
       NEWSLETTER
    ================================================= */

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );

    const newsletterEmail =
        document.getElementById(
            "newsletterEmail"
        );


    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                newsletterEmail.value.trim();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;

            }


            if (
                !emailPattern.test(email)
            ) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            localStorage.setItem(
                "staynestNewsletterEmail",
                email
            );


            newsletterEmail.value =
                "";


            alert(
                "You're subscribed to StayNest!"
            );

        }
    );


    /* =================================================
       MOBILE MENU
    ================================================= */

    const menuButton =
        document.querySelector(
            ".menu"
        );

    const navLinks =
        document.querySelector(
            ".nav-links"
        );


    if (
        menuButton &&
        navLinks
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "mobile-open"
                );


                if (
                    navLinks.classList.contains(
                        "mobile-open"
                    )
                ) {

                    navLinks.style.display =
                        "flex";

                    navLinks.style.position =
                        "absolute";

                    navLinks.style.top =
                        "75px";

                    navLinks.style.left =
                        "0";

                    navLinks.style.right =
                        "0";

                    navLinks.style.background =
                        "white";

                    navLinks.style.padding =
                        "20px";

                    navLinks.style.flexDirection =
                        "column";

                    navLinks.style.zIndex =
                        "100";

                } else {

                    navLinks.style.display =
                        "";

                }

            }
        );

    }


    /* =================================================
       DATE FORMATTER
    ================================================= */

    function formatDate(dateString) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    console.log(
        "StayNest Stay Details loaded:",
        stay.name
    );

});