document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("findBookingForm");
    const bookingIdInput = document.getElementById("bookingId");
    const emailInput = document.getElementById("bookingEmail");
    const message = document.getElementById("bookingMessage");
    const resultSection = document.getElementById("bookingResultSection");

    /* =========================
       MOBILE MENU
    ========================= */

    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("show");
            menuButton.setAttribute(
                "aria-expanded",
                String(mobileMenu.classList.contains("show"))
            );
        });
    }

    /* =========================
       PREFILL FROM URL / USER
    ========================= */

    const params = new URLSearchParams(window.location.search);
    const urlBookingId = params.get("id");

    if (urlBookingId && bookingIdInput) {
        bookingIdInput.value = urlBookingId;
    }

    try {
        const currentUser = JSON.parse(
            localStorage.getItem("staynestCurrentUser") || "null"
        );

        if (currentUser?.email && emailInput && !emailInput.value) {
            emailInput.value = currentUser.email;
        }
    } catch {
        // Ignore malformed session data.
    }

    /* =========================
       FIND BOOKING
    ========================= */

    form?.addEventListener("submit", event => {
        event.preventDefault();

        const bookingId =
            bookingIdInput?.value.trim().toUpperCase() || "";

        const email =
            emailInput?.value.trim().toLowerCase() || "";

        if (message) {
            message.textContent = "";
            message.className = "booking-message";
        }

        if (!bookingId || !email) {
            showMessage(
                "Please enter your Booking ID and email address.",
                "error"
            );
            return;
        }

        let bookings = [];

        try {
            const saved =
                JSON.parse(
                    localStorage.getItem("staynestBookings") || "[]"
                );

            bookings = Array.isArray(saved) ? saved : [];
        } catch {
            bookings = [];
        }

        const booking = bookings.find(item => {
            const savedId =
                String(item.id || "")
                    .trim()
                    .toUpperCase();

            /*
                New bookings use email.
                Older bookings may use guestEmail.
            */
            const savedEmail =
                String(
                    item.email ||
                    item.guestEmail ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            return (
                savedId === bookingId &&
                savedEmail === email
            );
        });

        if (!booking) {
            if (resultSection) {
                resultSection.hidden = true;
            }

            showMessage(
                "We couldn't find a booking with those details. Please check your Booking ID and email.",
                "error"
            );
            return;
        }

        showMessage(
            "Your booking was found successfully.",
            "success"
        );

        setText("resultStayName", booking.stay || "StayNest Stay");
        setText("resultLocation", booking.location || "Location unavailable");

        const resultImage = document.getElementById("resultImage");
        if (resultImage) {
            resultImage.src =
                booking.image || "./Assets/hero.jpeg";
            resultImage.alt =
                booking.stay || "Booked stay";
        }

        setText("resultBookingId", booking.id || "-");
        setText("resultGuestName", booking.guestName || "-");
        setText("resultCheckIn", formatDate(booking.checkIn));
        setText("resultCheckOut", formatDate(booking.checkOut));

        const guestCount = Number(booking.guests);
        setText(
            "resultGuests",
            Number.isFinite(guestCount)
                ? `${guestCount} guest${guestCount === 1 ? "" : "s"}`
                : booking.guests || "-"
        );

        const roomCount = Number(booking.rooms);
        setText(
            "resultRooms",
            Number.isFinite(roomCount)
                ? `${roomCount} room${roomCount === 1 ? "" : "s"}`
                : "-"
        );

        const nightCount = Number(booking.nights);
        setText(
            "resultNights",
            Number.isFinite(nightCount)
                ? `${nightCount} night${nightCount === 1 ? "" : "s"}`
                : "-"
        );

        const rating = Number(booking.rating);
        setText(
            "resultRating",
            Number.isFinite(rating) && rating > 0
                ? `★ ${rating}`
                : "-"
        );

        setText(
            "resultTotal",
            formatCurrency(booking.total)
        );

        if (resultSection) {
            resultSection.hidden = false;

            setTimeout(() => {
                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        }
    });

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    function showMessage(text, type) {
        if (!message) return;

        message.textContent = text;
        message.className =
            `booking-message ${type || ""}`.trim();
    }

    function formatDate(dateString) {
        if (!dateString) return "-";

        const date =
            new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function formatCurrency(amount) {
        const number = Number(amount);

        if (!Number.isFinite(number)) {
            return "$0";
        }

        return `$${number.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    }
});
