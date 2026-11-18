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
        },
        "Kyoto Garden Ryokan": { location: "Kyoto, Japan", price: 145, rating: 4.9, image: "https://images.unsplash.com/photo-1769643207226-dcc20cbe7d70?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "Gion Serenity Hotel": { location: "Kyoto, Japan", price: 175, rating: 4.8, image: "https://images.unsplash.com/photo-1758970081655-a9c08d367e68?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "Arashiyama Bamboo Retreat": { location: "Kyoto, Japan", price: 130, rating: 4.7, image: "https://images.unsplash.com/photo-1742519077728-f40bd20f7d52?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "Kyoto Heritage Suites": { location: "Kyoto, Japan", price: 220, rating: 4.9, image: "https://images.unsplash.com/photo-1740047957758-24c66b4468e4?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "Table Mountain View Hotel": { location: "Cape Town, South Africa", price: 155, rating: 4.8, image: "https://images.unsplash.com/photo-1641375741322-7d90777d009c?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "Cape Point Ocean Lodge": { location: "Cape Town, South Africa", price: 190, rating: 4.9, image: "https://images.unsplash.com/photo-1709551008598-3381fee87365?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "Sea Point Horizon Hotel": { location: "Cape Town, South Africa", price: 140, rating: 4.7, image: "https://images.unsplash.com/photo-1657002682435-5493da643e65?auto=format&fit=crop&fm=jpg&q=85&w=1200" },
        "V&A Waterfront Suites": { location: "Cape Town, South Africa", price: 210, rating: 4.8, image: "https://images.unsplash.com/photo-1692690134767-90bcc75d5653?auto=format&fit=crop&fm=jpg&q=85&w=1200" }
    };

    /* =================================================
       ELEMENTS
    ================================================= */

    const bookingForm = document.getElementById("bookingForm");
    const bookingLayout = document.getElementById("bookingLayout");
    const confirmation = document.getElementById("confirmation");

    const stayNameElement = document.getElementById("stayName");
    const stayLocationElement = document.getElementById("stayLocation");
    const stayImageElement = document.getElementById("stayImage");
    const stayRatingElement = document.getElementById("stayRating");
    const stayPriceElement = document.getElementById("stayPrice");

    const checkIn = document.getElementById("checkIn");
    const checkOut = document.getElementById("checkOut");
    const guests = document.getElementById("guests");
    const rooms = document.getElementById("rooms");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");

    const summaryStay = document.getElementById("summaryStay");
    const summaryDates = document.getElementById("summaryDates");
    const summaryGuests = document.getElementById("summaryGuests");
    const summaryNightly = document.getElementById("summaryNightly");
    const summaryNights = document.getElementById("summaryNights");
    const summaryRooms = document.getElementById("summaryRooms");
    const summaryDiscount = document.getElementById("summaryDiscount");
    const summaryTotal = document.getElementById("summaryTotal");
    const dealDiscountRow = document.getElementById("dealDiscountRow");

    /* =================================================
       SELECT STAY
    ================================================= */

    const params = new URLSearchParams(window.location.search);

    let selectedStay =
        params.get("stay") ||
        localStorage.getItem("staynestSelectedStay");

    if (!selectedStay || !stayData[selectedStay]) {
        selectedStay = "Oceanview Resort & Spa";
    }

    const stay = stayData[selectedStay];

    /* =================================================
       CURRENT USER PREFILL
    ================================================= */

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("staynestCurrentUser") || "null"
        );
    } catch {
        currentUser = null;
    }

    if (currentUser) {
        if (fullName && !fullName.value) {
            fullName.value = currentUser.name || "";
        }

        if (email && !email.value) {
            email.value = currentUser.email || "";
        }
    }

    /* =================================================
       DEAL VALIDATION
    ================================================= */

    function readSelectedDeal() {
        try {
            const saved = localStorage.getItem("staynestSelectedDeal");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    }

    function getCurrentDealDeadline() {
        const value = Number(
            localStorage.getItem("staynestDealDeadline")
        );

        return Number.isFinite(value) && value > 0
            ? value
            : null;
    }

    function validateDeal(deal) {
        if (!deal || deal.stay !== selectedStay) {
            return {
                valid: false,
                deal: null
            };
        }

        const savedDeadline = Number(deal.expiresAt);
        const currentDeadline = getCurrentDealDeadline();

        const validDates =
            Number.isFinite(savedDeadline) &&
            Number.isFinite(currentDeadline) &&
            savedDeadline > Date.now() &&
            currentDeadline > Date.now() &&
            savedDeadline === currentDeadline;

        const regularPrice = Number(deal.regularPrice);
        const dealPrice = Number(deal.dealPrice);
        const discount = Number(deal.discount);

        const validPrices =
            Number.isFinite(regularPrice) &&
            regularPrice > 0 &&
            Number.isFinite(dealPrice) &&
            dealPrice > 0 &&
            Number.isFinite(discount) &&
            discount > 0 &&
            discount < 100;

        if (!validDates || !validPrices) {
            return {
                valid: false,
                deal: null
            };
        }

        return {
            valid: true,
            deal: {
                ...deal,
                regularPrice,
                dealPrice,
                discount,
                expiresAt: savedDeadline
            }
        };
    }

    let selectedDeal = readSelectedDeal();
    let dealValidation = validateDeal(selectedDeal);
    let dealIsValid = dealValidation.valid;

    if (!dealIsValid && selectedDeal) {
        /*
            The saved deal belongs to another stay or another
            deal cycle. Do not let it block a normal booking.
        */
        localStorage.removeItem("staynestSelectedDeal");
        selectedDeal = null;
    } else {
        selectedDeal = dealValidation.deal;
    }

    /* =================================================
       PRICES
    ================================================= */

    let nightlyPrice = stay.price;
    let originalNightlyPrice = stay.price;
    let discount = 0;

    if (dealIsValid) {
        nightlyPrice = selectedDeal.dealPrice;
        originalNightlyPrice = selectedDeal.regularPrice;
        discount = selectedDeal.discount;
    }

    /* =================================================
       DISPLAY STAY
    ================================================= */

    if (stayNameElement) stayNameElement.textContent = selectedStay;
    if (stayLocationElement) stayLocationElement.textContent = stay.location;

    if (stayImageElement) {
        stayImageElement.src = stay.image;
        stayImageElement.alt = selectedStay;
    }

    if (stayRatingElement) {
        stayRatingElement.textContent = stay.rating;
    }

    if (stayPriceElement) {
        stayPriceElement.textContent =
            `$${formatMoney(nightlyPrice)}`;
    }

    if (summaryStay) {
        summaryStay.textContent = selectedStay;
    }

    /* =================================================
       DEAL SUMMARY ROW
    ================================================= */

    if (dealDiscountRow) {
        dealDiscountRow.hidden = !dealIsValid;
    }

    /* =================================================
       DATE HELPERS
    ================================================= */

    function formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function calculateNights() {
        if (!checkIn?.value || !checkOut?.value) {
            return 0;
        }

        const start =
            new Date(`${checkIn.value}T00:00:00`);
        const end =
            new Date(`${checkOut.value}T00:00:00`);

        const difference = end - start;

        if (!Number.isFinite(difference) || difference <= 0) {
            return 0;
        }

        return Math.round(
            difference / (1000 * 60 * 60 * 24)
        );
    }

    /* =================================================
       DEFAULT / SAVED SEARCH DATES
    ================================================= */

    const today = new Date();
    const todayString = formatLocalDate(today);

    let savedSearch = null;

    try {
        const saved =
            JSON.parse(
                localStorage.getItem("staynestSearchDates") || "null"
            );

        if (saved && typeof saved === "object") {
            savedSearch = saved;
        }
    } catch {
        savedSearch = null;
    }

    if (checkIn) {
        checkIn.min = todayString;

        if (
            !checkIn.value &&
            savedSearch?.checkIn &&
            savedSearch.checkIn >= todayString
        ) {
            checkIn.value = savedSearch.checkIn;
        }

        if (!checkIn.value) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            checkIn.value = formatLocalDate(tomorrow);
        }
    }

    if (checkOut) {
        checkOut.min = todayString;

        if (
            !checkOut.value &&
            savedSearch?.checkOut &&
            savedSearch.checkOut > (checkIn?.value || todayString)
        ) {
            checkOut.value = savedSearch.checkOut;
        }

        if (!checkOut.value) {
            const dayAfter = new Date(today);
            dayAfter.setDate(dayAfter.getDate() + 2);
            checkOut.value = formatLocalDate(dayAfter);
        }
    }

    /*
        Carry the guest count from the Home search when
        possible. Home stores values such as:
        "2 Adults • 1 Child".
    */
    if (guests && savedSearch?.guests) {
        const guestMatch =
            String(savedSearch.guests).match(/^\s*(\d+)/);

        const savedGuestCount =
            guestMatch ? Number(guestMatch[1]) : null;

        if (
            Number.isFinite(savedGuestCount) &&
            Array.from(guests.options).some(
                option => Number(option.value) === savedGuestCount
            )
        ) {
            guests.value = String(savedGuestCount);
        }
    }

    if (checkIn && checkOut && checkIn.value) {
        const checkInDate =
            new Date(`${checkIn.value}T00:00:00`);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);

        checkOut.min = formatLocalDate(nextDay);

        if (checkOut.value <= checkIn.value) {
            checkOut.value = formatLocalDate(nextDay);
        }
    }

    /* =================================================
       SUMMARY
    ================================================= */

    function formatMoney(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    function updateSummary() {
        const nights = calculateNights();

        const guestValue = guests?.value || "2";
        const roomCount = Math.max(
            1,
            Number(rooms?.value || 1)
        );

        const total =
            nights * nightlyPrice * roomCount;

        const originalTotal =
            nights * originalNightlyPrice * roomCount;

        const discountAmount =
            Math.max(0, originalTotal - total);

        if (summaryDates) {
            summaryDates.textContent =
                checkIn?.value && checkOut?.value
                    ? `${checkIn.value} → ${checkOut.value}`
                    : "Select your dates";
        }

        if (summaryGuests) {
            summaryGuests.textContent =
                `${guestValue} Guest${guestValue === "1" ? "" : "s"}`;
        }

        if (summaryNightly) {
            summaryNightly.textContent =
                `$${formatMoney(nightlyPrice)}`;
        }

        if (summaryNights) {
            summaryNights.textContent = nights;
        }

        if (summaryRooms) {
            summaryRooms.textContent =
                `${roomCount} Room${roomCount === 1 ? "" : "s"}`;
        }

        if (summaryDiscount) {
            summaryDiscount.textContent =
                dealIsValid
                    ? `-$${formatMoney(discountAmount)}`
                    : "-$0";
        }

        if (dealDiscountRow) {
            dealDiscountRow.hidden =
                !dealIsValid || discountAmount <= 0;
        }

        if (summaryTotal) {
            summaryTotal.textContent =
                `$${formatMoney(total)}`;
        }
    }

    checkIn?.addEventListener("change", () => {
        if (checkOut && checkIn?.value) {
            const date =
                new Date(`${checkIn.value}T00:00:00`);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            checkOut.min = formatLocalDate(nextDay);

            if (
                !checkOut.value ||
                checkOut.value <= checkIn.value
            ) {
                checkOut.value = formatLocalDate(nextDay);
            }
        }

        updateSummary();
    });

    checkOut?.addEventListener("change", () => {
        updateSummary();
    });

    guests?.addEventListener("change", updateSummary);
    rooms?.addEventListener("change", updateSummary);

    /* =================================================
       FORM SUBMISSION
    ================================================= */

    bookingForm?.addEventListener("submit", event => {
        event.preventDefault();

        const nights = calculateNights();

        if (nights <= 0) {
            alert(
                "Please select a valid check-in and check-out date."
            );
            return;
        }

        const roomCount = Math.max(
            1,
            Number(rooms?.value || 1)
        );

        const bookingName =
            fullName?.value.trim() || "";

        const bookingEmail =
            email?.value.trim().toLowerCase() || "";

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (bookingName.length < 2) {
            alert("Please enter your full name.");
            fullName?.focus();
            return;
        }

        if (!emailPattern.test(bookingEmail)) {
            alert("Please enter a valid email address.");
            email?.focus();
            return;
        }

        if (checkIn?.value < todayString) {
            alert("Check-in cannot be in the past.");
            return;
        }

        if (checkOut?.value <= checkIn?.value) {
            alert("Check-out must be after check-in.");
            return;
        }

        /* -----------------------------------------
           RECHECK DEAL AT THE MOMENT OF BOOKING
        ----------------------------------------- */

        const latestDeal = readSelectedDeal();
        const latestValidation =
            validateDeal(latestDeal);

        if (dealIsValid && !latestValidation.valid) {
            alert(
                "Sorry, this deal is no longer active. The current booking price has not been changed."
            );
            return;
        }

        /*
            If this page started as a normal booking and a stale
            deal appears in storage later, do not block the booking.
        */
        if (
            dealIsValid &&
            latestValidation.valid
        ) {
            selectedDeal = latestValidation.deal;
        }

        const finalNightlyPrice =
            dealIsValid && selectedDeal
                ? Number(selectedDeal.dealPrice)
                : stay.price;

        const finalOriginalNightlyPrice =
            dealIsValid && selectedDeal
                ? Number(selectedDeal.regularPrice)
                : stay.price;

        const finalDiscount =
            dealIsValid && selectedDeal
                ? Number(selectedDeal.discount)
                : 0;

        const total =
            nights *
            finalNightlyPrice *
            roomCount;

        const bookingId =
            "SN" +
            Date.now()
                .toString()
                .slice(-8);

        const booking = {
            id: bookingId,
            stay: selectedStay,
            location: stay.location,
            image: stay.image,
            rating: stay.rating,

            userId: currentUser?.id || null,

            guestName: bookingName,

            /*
                Keep BOTH keys for compatibility with
                older/newer booking pages.
            */
            guestEmail: bookingEmail,
            email: bookingEmail,

            checkIn: checkIn.value,
            checkOut: checkOut.value,
            guests: guests?.value || "2",
            rooms: roomCount,
            nights,

            nightlyPrice: finalNightlyPrice,
            originalNightlyPrice: finalOriginalNightlyPrice,
            discount: finalDiscount,
            dealApplied:
                dealIsValid && !!selectedDeal,

            total,

            createdAt:
                new Date().toISOString()
        };

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

        bookings.push(booking);

        localStorage.setItem(
            "staynestBookings",
            JSON.stringify(bookings)
        );

        /* =================================================
           CONFIRMATION
        ================================================= */

        document.getElementById("bookingId").textContent =
            bookingId;

        document.getElementById("confirmedStay").textContent =
            selectedStay;

        document.getElementById("confirmedDates").textContent =
            `${booking.checkIn} → ${booking.checkOut}`;

        document.getElementById("confirmedTotal").textContent =
            `$${formatMoney(total)}`;

        if (bookingLayout) {
            bookingLayout.style.display = "none";
        }

        if (confirmation) {
            confirmation.hidden = false;
            confirmation.style.display = "block";
        }

        localStorage.removeItem("staynestSelectedDeal");
        localStorage.removeItem("staynestSelectedStay");
    });

    /* =================================================
       MOBILE MENU
    ================================================= */

    const menuBtn = document.querySelector(".menu");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-open");

            menuBtn.setAttribute(
                "aria-expanded",
                String(
                    navLinks.classList.contains("mobile-open")
                )
            );
        });
    }

    /* =================================================
       ACCOUNT LINK
    ================================================= */

    const accountLink =
        document.getElementById("accountLink");

    if (accountLink) {
        if (currentUser) {
            accountLink.textContent = "◯ Dashboard";
            accountLink.href = "dashboard.html";
        } else {
            accountLink.textContent = "◯ Sign in";
            accountLink.href = "login.html";
        }
    }

    updateSummary();
});
