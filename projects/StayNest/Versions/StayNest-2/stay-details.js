
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

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
        },

        "Kyoto Garden Ryokan": {
            name: "Kyoto Garden Ryokan", location: "Kyoto, Japan", type: "Resort", price: 145, rating: 4.9, reviews: "186 reviews",
            image: "https://images.unsplash.com/photo-1769643207226-dcc20cbe7d70?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "A peaceful Kyoto-style stay with traditional interiors, garden views and a calm atmosphere."
        },
        "Gion Serenity Hotel": {
            name: "Gion Serenity Hotel", location: "Kyoto, Japan", type: "Hotel", price: 175, rating: 4.8, reviews: "143 reviews",
            image: "https://images.unsplash.com/photo-1758970081655-a9c08d367e68?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "A refined Kyoto hotel inspired by traditional design and the atmosphere of historic Gion."
        },
        "Arashiyama Bamboo Retreat": {
            name: "Arashiyama Bamboo Retreat", location: "Kyoto, Japan", type: "Resort", price: 130, rating: 4.7, reviews: "121 reviews",
            image: "https://images.unsplash.com/photo-1742519077728-f40bd20f7d52?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "A relaxing retreat near Arashiyama's famous bamboo and peaceful natural surroundings."
        },
        "Kyoto Heritage Suites": {
            name: "Kyoto Heritage Suites", location: "Kyoto, Japan", type: "Hotel", price: 220, rating: 4.9, reviews: "204 reviews",
            image: "https://images.unsplash.com/photo-1740047957758-24c66b4468e4?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "Elegant suites blending modern comfort with Kyoto's traditional architectural character."
        },
        "Table Mountain View Hotel": {
            name: "Table Mountain View Hotel", location: "Cape Town, South Africa", type: "Hotel", price: 155, rating: 4.8, reviews: "167 reviews",
            image: "https://images.unsplash.com/photo-1641375741322-7d90777d009c?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "A comfortable Cape Town base with memorable city, mountain and coastal views."
        },
        "Cape Point Ocean Lodge": {
            name: "Cape Point Ocean Lodge", location: "Cape Town, South Africa", type: "Resort", price: 190, rating: 4.9, reviews: "231 reviews",
            image: "https://images.unsplash.com/photo-1709551008598-3381fee87365?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "A coastal escape designed around ocean scenery and the natural beauty of the Cape Peninsula."
        },
        "Sea Point Horizon Hotel": {
            name: "Sea Point Horizon Hotel", location: "Cape Town, South Africa", type: "Hotel", price: 140, rating: 4.7, reviews: "118 reviews",
            image: "https://images.unsplash.com/photo-1657002682435-5493da643e65?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "A modern Sea Point stay close to the coast, restaurants and Cape Town's waterfront energy."
        },
        "V&A Waterfront Suites": {
            name: "V&A Waterfront Suites", location: "Cape Town, South Africa", type: "Apartment", price: 210, rating: 4.8, reviews: "192 reviews",
            image: "https://images.unsplash.com/photo-1692690134767-90bcc75d5653?auto=format&fit=crop&fm=jpg&q=85&w=1200",
            description: "Spacious waterfront-style suites offering a convenient base for exploring Cape Town."
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
       ACTIVE DEAL
    ================================================= */

    let activeDeal = null;

    try {
        const savedDeal = JSON.parse(
            localStorage.getItem("staynestSelectedDeal") || "null"
        );

        const savedDeadline = Number(
            savedDeal?.expiresAt
        );

        const currentDeadline = Number(
            localStorage.getItem("staynestDealDeadline")
        );

        if (
            savedDeal &&
            savedDeal.stay === stay.name &&
            Number.isFinite(savedDeadline) &&
            Number.isFinite(currentDeadline) &&
            savedDeadline === currentDeadline &&
            savedDeadline > Date.now()
        ) {
            const dealPrice = Number(savedDeal.dealPrice);
            const discount = Number(savedDeal.discount);

            if (
                Number.isFinite(dealPrice) &&
                dealPrice > 0 &&
                Number.isFinite(discount) &&
                discount > 0 &&
                discount < 100
            ) {
                activeDeal = {
                    dealPrice,
                    discount
                };
            }
        }
    } catch {
        activeDeal = null;
    }


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
        activeDeal
            ? activeDeal.dealPrice
            : stay.price;

    if (activeDeal) {
        const priceRow =
            stayPrice.closest(".price-row");

        if (priceRow) {
            let dealBadge =
                priceRow.querySelector(".stay-deal-badge");

            if (!dealBadge) {
                dealBadge =
                    document.createElement("span");

                dealBadge.className =
                    "stay-deal-badge";

                dealBadge.style.display = "inline-block";
                dealBadge.style.marginTop = "8px";
                dealBadge.style.padding = "5px 9px";
                dealBadge.style.borderRadius = "999px";
                dealBadge.style.background = "#F3AE31";
                dealBadge.style.color = "#15193A";
                dealBadge.style.fontSize = "12px";
                dealBadge.style.fontWeight = "700";

                const priceBlock =
                    stayPrice.closest("div");

                priceBlock?.appendChild(dealBadge);
            }

            dealBadge.textContent =
                `${activeDeal.discount}% OFF`;
        }
    }

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