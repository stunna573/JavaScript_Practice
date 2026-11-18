document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       STAY DATA
    ================================================= */

    const stayData = {

        "Oceanview Resort & Spa": {
            location: "Bali, Indonesia",
            price: 120,
            rating: 4.8,
            image: "./Assets/ocean_view.jpeg"
        },

        "The Grand Paris Hotel": {
            location: "Paris, France",
            price: 210,
            rating: 4.7,
            image: "./Assets/grand_paris.jpeg"
        },

        "Maldives Paradise": {
            location: "Maldives",
            price: 350,
            rating: 4.9,
            image: "./Assets/maldavies_paradise_.jpeg"
        },

        "Luxury Stay Dubai": {
            location: "Dubai, UAE",
            price: 160,
            rating: 4.6,
            image: "./Assets/luxury_stay_.jpeg"
        },

        "Blue Horizon Hotel": {
            location: "New York, USA",
            price: 190,
            rating: 4.7,
            image: "./Assets/blue_horizon.jpeg"
        }

    };


    /* =================================================
       GET ELEMENTS
    ================================================= */

    const bookingForm =
        document.getElementById("bookingForm");

    const bookingLayout =
        document.getElementById("bookingLayout");

    const confirmation =
        document.getElementById("confirmation");

    const stayNameElement =
        document.getElementById("stayName");

    const stayLocationElement =
        document.getElementById("stayLocation");

    const stayImageElement =
        document.getElementById("stayImage");

    const stayRatingElement =
        document.getElementById("stayRating");

    const stayPriceElement =
        document.getElementById("stayPrice");

    const checkIn =
        document.getElementById("checkIn");

    const checkOut =
        document.getElementById("checkOut");

    const guests =
        document.getElementById("guests");

    const rooms =
        document.getElementById("rooms");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const summaryStay =
        document.getElementById("summaryStay");

    const summaryDates =
        document.getElementById("summaryDates");

    const summaryGuests =
        document.getElementById("summaryGuests");

    const summaryNightly =
        document.getElementById("summaryNightly");

    const summaryNights =
        document.getElementById("summaryNights");

    const summaryRooms =
        document.getElementById("summaryRooms");

    const summaryTotal =
        document.getElementById("summaryTotal");


    /* =================================================
       SELECT STAY
    ================================================= */

    const params =
        new URLSearchParams(
            window.location.search
        );

    let selectedStay =
        params.get("stay");

    if (!selectedStay) {

        selectedStay =
            localStorage.getItem(
                "staynestSelectedStay"
            );
    }

    if (
        !selectedStay ||
        !stayData[selectedStay]
    ) {

        selectedStay =
            "Oceanview Resort & Spa";
    }

    const stay =
        stayData[selectedStay];


    /* =================================================
       DEAL INFORMATION
    ================================================= */

    let selectedDeal = null;

    try {

        const savedDeal =
            localStorage.getItem(
                "staynestSelectedDeal"
            );

        if (savedDeal) {

            selectedDeal =
                JSON.parse(savedDeal);
        }

    } catch (error) {

        selectedDeal = null;
    }


    /*
       IMPORTANT FIX:

       The values coming from localStorage are strings.

       Convert BOTH timestamps to Numbers before
       comparing them.
    */

    const savedDealDeadline =
        selectedDeal &&
        selectedDeal.expiresAt
            ? Number(selectedDeal.expiresAt)
            : null;

    const currentDealDeadline =
        Number(
            localStorage.getItem(
                "staynestDealDeadline"
            )
        );


    /*
       A deal is valid ONLY when:

       1. A selected deal exists
       2. It belongs to the selected stay
       3. It has a valid expiry timestamp
       4. The expiry has not passed
       5. Its expiry timestamp matches the
          CURRENT active deal cycle
    */

    const dealIsValid =
        !!selectedDeal &&
        selectedDeal.stay === selectedStay &&
        Number.isFinite(savedDealDeadline) &&
        savedDealDeadline > Date.now() &&
        Number.isFinite(currentDealDeadline) &&
        currentDealDeadline > Date.now() &&
        savedDealDeadline === currentDealDeadline;


    /* =================================================
       PRICES
    ================================================= */

    let nightlyPrice =
        stay.price;

    let originalNightlyPrice =
        stay.price;

    let discount =
        0;


    if (dealIsValid) {

        nightlyPrice =
            Number(selectedDeal.dealPrice);

        originalNightlyPrice =
            Number(selectedDeal.regularPrice);

        discount =
            Number(selectedDeal.discount);

    }


    /* =================================================
       DISPLAY STAY
    ================================================= */

    if (stayNameElement) {

        stayNameElement.textContent =
            selectedStay;
    }

    if (stayLocationElement) {

        stayLocationElement.textContent =
            stay.location;
    }

    if (stayImageElement) {

        stayImageElement.src =
            stay.image;

        stayImageElement.alt =
            selectedStay;
    }

    if (stayRatingElement) {

        stayRatingElement.textContent =
            `★ ${stay.rating}`;
    }

    if (stayPriceElement) {

        stayPriceElement.textContent =
            `$${nightlyPrice} / night`;
    }

    if (summaryStay) {

        summaryStay.textContent =
            selectedStay;
    }


    /* =================================================
       DEAL NOTICE
    ================================================= */

    let dealRow =
        document.getElementById(
            "dealDiscountRow"
        );


    if (dealIsValid) {

        if (!dealRow) {

            dealRow =
                document.createElement("div");

            dealRow.id =
                "dealDiscountRow";

            dealRow.className =
                "deal-discount-row";

            const totalRow =
                summaryTotal?.closest(
                    ".price-summary"
                );

            if (totalRow) {

                totalRow.insertBefore(
                    dealRow,
                    totalRow.querySelector(
                        ".total-row"
                    )
                );
            }
        }

        if (dealRow) {

            dealRow.innerHTML = `
                <span>
                    Deal discount
                </span>

                <strong>
                    ${discount}% OFF
                </strong>
            `;
        }

    } else if (dealRow) {

        dealRow.remove();
    }


    /* =================================================
       DEFAULT DATES
    ================================================= */

    function formatDate(date) {

        return date
            .toISOString()
            .split("T")[0];
    }


    const today =
        new Date();


    if (
        checkIn &&
        !checkIn.value
    ) {

        const tomorrow =
            new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        checkIn.value =
            formatDate(tomorrow);
    }


    if (
        checkOut &&
        !checkOut.value
    ) {

        const afterTomorrow =
            new Date(today);

        afterTomorrow.setDate(
            afterTomorrow.getDate() + 2
        );

        checkOut.value =
            formatDate(afterTomorrow);
    }


    /* =================================================
       CALCULATE NIGHTS
    ================================================= */

    function calculateNights() {

        if (
            !checkIn ||
            !checkOut ||
            !checkIn.value ||
            !checkOut.value
        ) {

            return 0;
        }


        const start =
            new Date(
                checkIn.value +
                "T00:00:00"
            );

        const end =
            new Date(
                checkOut.value +
                "T00:00:00"
            );


        const difference =
            end - start;


        return Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );
    }


    /* =================================================
       UPDATE SUMMARY
    ================================================= */

    function updateSummary() {

        const nights =
            calculateNights();

        const guestCount =
            guests
                ? guests.value
                : "2";

        const roomCount =
            rooms
                ? Number(rooms.value)
                : 1;


        const total =
            nights *
            nightlyPrice *
            roomCount;


        if (summaryStay) {

            summaryStay.textContent =
                selectedStay;
        }


        if (summaryDates) {

            if (
                checkIn?.value &&
                checkOut?.value
            ) {

                summaryDates.textContent =
                    `${checkIn.value} → ${checkOut.value}`;

            } else {

                summaryDates.textContent =
                    "Select your dates";
            }
        }


        if (summaryGuests) {

            summaryGuests.textContent =
                `${guestCount} Guests`;
        }


        if (summaryNightly) {

            summaryNightly.textContent =
                `$${nightlyPrice}`;
        }


        if (summaryNights) {

            summaryNights.textContent =
                nights;
        }


        if (summaryRooms) {

            summaryRooms.textContent =
                roomCount;
        }


        if (summaryTotal) {

            summaryTotal.textContent =
                `$${total}`;
        }
    }


    /* =================================================
       DATE / GUEST / ROOM EVENTS
    ================================================= */

    checkIn?.addEventListener(
        "change",
        updateSummary
    );

    checkOut?.addEventListener(
        "change",
        updateSummary
    );

    guests?.addEventListener(
        "change",
        updateSummary
    );

    rooms?.addEventListener(
        "change",
        updateSummary
    );


    /* =================================================
       FORM SUBMISSION
    ================================================= */

    bookingForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /* -----------------------------------------
               CHECK DEAL AGAIN BEFORE BOOKING

               This is important because the user could
               leave the booking page open until the
               deal expires.
            ----------------------------------------- */

            let finalDealIsValid =
                false;

            let finalDeal = null;


            try {

                finalDeal =
                    JSON.parse(
                        localStorage.getItem(
                            "staynestSelectedDeal"
                        )
                    );

            } catch (error) {

                finalDeal = null;
            }


            const finalSavedDeadline =
                finalDeal &&
                finalDeal.expiresAt
                    ? Number(finalDeal.expiresAt)
                    : null;

            const finalCurrentDeadline =
                Number(
                    localStorage.getItem(
                        "staynestDealDeadline"
                    )
                );


            finalDealIsValid =
                !!finalDeal &&
                finalDeal.stay === selectedStay &&
                Number.isFinite(
                    finalSavedDeadline
                ) &&
                finalSavedDeadline >
                    Date.now() &&
                Number.isFinite(
                    finalCurrentDeadline
                ) &&
                finalCurrentDeadline >
                    Date.now() &&
                finalSavedDeadline ===
                    finalCurrentDeadline;


            /*
               If the deal really expired while the
               booking page was open, stop the booking.
            */

            if (
                selectedDeal &&
                !finalDealIsValid
            ) {

                /*
                   Only show this message if the user
                   actually came through the Deals flow.
                */

                alert(
                    "Sorry, this deal is no longer active."
                );

                return;
            }


            const nights =
                calculateNights();


            if (nights <= 0) {

                alert(
                    "Please select a valid check-in and check-out date."
                );

                return;
            }


            const roomCount =
                rooms
                    ? Number(rooms.value)
                    : 1;


            const total =
                nights *
                nightlyPrice *
                roomCount;


            /* -----------------------------------------
               BOOKING ID
            ----------------------------------------- */

            const bookingId =
                "SN" +
                Date.now()
                    .toString()
                    .slice(-8);


            /* -----------------------------------------
               BOOKING OBJECT
            ----------------------------------------- */

            const booking = {

                id:
                    bookingId,

                stay:
                    selectedStay,

                location:
                    stay.location,

                image:
                    stay.image,

                guestName:
                    fullName
                        ? fullName.value.trim()
                        : "",

                guestEmail:
                    email
                        ? email.value.trim()
                        : "",

                checkIn:
                    checkIn.value,

                checkOut:
                    checkOut.value,

                guests:
                    guests
                        ? guests.value
                        : "2",

                rooms:
                    roomCount,

                nights:
                    nights,

                nightlyPrice:
                    nightlyPrice,

                originalNightlyPrice:
                    originalNightlyPrice,

                discount:
                    finalDealIsValid
                        ? Number(
                            finalDeal.discount
                        )
                        : 0,

                dealApplied:
                    finalDealIsValid,

                total:
                    total,

                createdAt:
                    new Date().toISOString()
            };


            /* =================================================
               SAVE BOOKING
            ================================================= */

            let bookings = [];

            try {

                bookings =
                    JSON.parse(
                        localStorage.getItem(
                            "staynestBookings"
                        )
                    ) || [];

            } catch (error) {

                bookings = [];
            }


            bookings.push(booking);


            localStorage.setItem(
                "staynestBookings",
                JSON.stringify(bookings)
            );


            /* =================================================
               CONFIRMATION
            ================================================= */

            const bookingIdElement =
                document.getElementById(
                    "bookingId"
                );

            const confirmedStay =
                document.getElementById(
                    "confirmedStay"
                );

            const confirmedDates =
                document.getElementById(
                    "confirmedDates"
                );

            const confirmedTotal =
                document.getElementById(
                    "confirmedTotal"
                );


            if (bookingIdElement) {

                bookingIdElement.textContent =
                    bookingId;
            }


            if (confirmedStay) {

                confirmedStay.textContent =
                    selectedStay;
            }


            if (confirmedDates) {

                confirmedDates.textContent =
                    `${booking.checkIn} → ${booking.checkOut}`;
            }


            if (confirmedTotal) {

                confirmedTotal.textContent =
                    `$${total}`;
            }


            if (bookingLayout) {

                bookingLayout.style.display =
                    "none";
            }


            if (confirmation) {

                confirmation.hidden =
                    false;

                confirmation.style.display =
                    "block";
            }


            /* -----------------------------------------
               DEAL HAS BEEN USED
            ----------------------------------------- */

            localStorage.removeItem(
                "staynestSelectedDeal"
            );

            localStorage.removeItem(
                "staynestSelectedStay"
            );
        }
    );


    /* =================================================
       MOBILE MENU
    ================================================= */

    const menuBtn =
        document.querySelector(".menu");

    const navLinks =
        document.querySelector(".nav-links");


    if (
        menuBtn &&
        navLinks
    ) {

        menuBtn.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "mobile-open"
                );
            }
        );
    }


    /* =================================================
       ACCOUNT LINK
    ================================================= */

    const accountLink =
        document.getElementById(
            "accountLink"
        );


    if (accountLink) {

        const currentUser =
            localStorage.getItem(
                "staynestCurrentUser"
            );


        if (currentUser) {

            accountLink.textContent =
                "Dashboard";

            accountLink.href =
                "dashboard.html";

        } else {

            accountLink.textContent =
                "Sign in";

            accountLink.href =
                "login.html";
        }
    }


    /* =================================================
       INITIALIZE
    ================================================= */

    updateSummary();

});