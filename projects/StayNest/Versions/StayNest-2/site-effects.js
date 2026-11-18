/* =========================================================
   StayNest — Shared page motion
   Adds the same fade-up / staggered reveal used on Home
   to the rest of the site without changing page behavior.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const allSections = document.querySelectorAll("main > section");

    allSections.forEach(section => {
        const className = typeof section.className === "string"
            ? section.className
            : "";

        const isHero = className
            .split(/\s+/)
            .some(name => name.toLowerCase().includes("hero"));

        if (!isHero) {
            section.classList.add("reveal");
        }
    });

    /* Index page: keep the existing animation vocabulary and timing. */
    document.querySelectorAll(
        ".About, .destination_section, .stays-section, .offer, .reviews-section, .newsletter"
    ).forEach(section => section.classList.add("reveal"));

    document.querySelectorAll(
        ".destination-grid, .stays-grid, .reviews-grid, .values-grid, .deals-grid, .dashboard-grid, .favorites-grid, .booking-info-grid"
    ).forEach(grid => grid.classList.add("reveal-stagger"));

    /* Hero text entrance on all non-Home hero pages. */
    document.querySelectorAll(
        "section[class*='hero'] .hero-content, section[class*='hero'] .hero-btn"
    ).forEach((element, index) => {
        element.classList.add("site-hero-enter");
        if (index > 0) element.classList.add("site-hero-enter-delay-2");
    });

    /* Pages such as Login / Sign Up have a centered card instead of a hero. */
    document.querySelectorAll(
        ".login-card, .signup-card"
    ).forEach(card => card.classList.add("site-card-entrance"));

    const revealItems = document.querySelectorAll(
        ".reveal, .reveal-stagger"
    );

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach(item => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
    });

    revealItems.forEach(item => observer.observe(item));
});
