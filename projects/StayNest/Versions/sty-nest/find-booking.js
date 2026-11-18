document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
    ================================================= */

    const form =
        document.getElementById("findBookingForm");

    const bookingIdInput =
        document.getElementById("bookingId");

    const emailInput =
        document.getElementById("bookingEmail");

    const message =
        document.getElementById("bookingMessage");

    const resultSection =
        document.getElementById("bookingResultSection");


    /* =================================================
       MOBILE MENU
    ================================================= */

    const menuButton =
        document.querySelector(".menu-button");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {

            mobileMenu.classList.toggle("show");

        });

    }


    /* =================================================
       FIND BOOKING
    ================================================= */

    form.addEventListener("submit", event => {

        event.preventDefault();


        const bookingId =
            bookingIdInput.value
                .trim()
                .toUpperCase();

        const email =
            emailInput.value
                .trim()
                .toLowerCase();


        message.textContent = "";
        message.className = "booking-message";


        if (!bookingId || !email) {

            message.textContent =
                "Please enter your Booking ID and email address.";

            message.classList.add("error");

            return;

        }


        /* =================================================
           GET SAVED BOOKINGS
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


        /* =================================================
           FIND MATCHING BOOKING
        ================================================= */

        const booking =
            bookings.find(item => {

                const savedId =
                    String(item.id || "")
                        .trim()
                        .toUpperCase();

                const savedEmail =
                    String(item.email || "")
                        .trim()
                        .toLowerCase();

                return (
                    savedId === bookingId &&
                    savedEmail === email
                );

            });


        /* =================================================
           NO BOOKING FOUND
        ================================================= */

        if (!booking) {

            resultSection.hidden = true;

            message.textContent =
                "We couldn't find a booking with those details. Please check your Booking ID and email.";

            message.classList.add("error");

            return;

        }


        /* =================================================
           BOOKING FOUND
        ================================================= */

        message.textContent =
            "Your booking was found successfully.";

        message.classList.add("success");


        /* =================================================
           DISPLAY BOOKING
        ================================================= */

        document.getElementById(
            "resultStayName"
        ).textContent =
            booking.stay || "StayNest Stay";


        document.getElementById(
            "resultLocation"
        ).textContent =
            booking.location || "Location unavailable";


        document.getElementById(
            "resultImage"
        ).src =
            booking.image || "./Assets/hero.jpeg";


        document.getElementById(
            "resultImage"
        ).alt =
            booking.stay || "Booked stay";


        document.getElementById(
            "resultBookingId"
        ).textContent =
            booking.id || "-";


        document.getElementById(
            "resultGuestName"
        ).textContent =
            booking.guestName || "-";


        document.getElementById(
            "resultCheckIn"
        ).textContent =
            formatDate(booking.checkIn);


        document.getElementById(
            "resultCheckOut"
        ).textContent =
            formatDate(booking.checkOut);


        document.getElementById(
            "resultGuests"
        ).textContent =
            booking.guests
                ? `${booking.guests} guest${booking.guests > 1 ? "s" : ""}`
                : "-";


        document.getElementById(
            "resultRooms"
        ).textContent =
            booking.rooms
                ? `${booking.rooms} room${booking.rooms > 1 ? "s" : ""}`
                : "-";


        document.getElementById(
            "resultNights"
        ).textContent =
            booking.nights
                ? `${booking.nights} night${booking.nights > 1 ? "s" : ""}`
                : "-";


        document.getElementById(
            "resultRating"
        ).textContent =
            booking.rating
                ? `★ ${booking.rating}`
                : "-";


        document.getElementById(
            "resultTotal"
        ).textContent =
            formatCurrency(booking.total);


        resultSection.hidden = false;


        /* =================================================
           SCROLL TO RESULT
        ================================================= */

        setTimeout(() => {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    });


    /* =================================================
       DATE FORMATTER
    ================================================= */

    function formatDate(dateString) {

        if (!dateString) {
            return "-";
        }

        const date =
            new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* =================================================
       CURRENCY FORMATTER
    ================================================= */

    function formatCurrency(amount) {

        const number =
            Number(amount);

        if (Number.isNaN(number)) {
            return "$0";
        }

        return `$${number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}`;

    }

});