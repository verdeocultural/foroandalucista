const root = document.documentElement;
const btnTop = document.getElementById("btn-top");
const mobileSignBtn = document.getElementById("btn-mobile-sign");
const formBlock = document.getElementById("formulario-firma");
const cookieBanner = document.getElementById("cookie-banner");
const cookieAcceptBtn = document.getElementById("cookie-accept");
const cookieRejectBtn = document.getElementById("cookie-reject");
const firmaIframe = document.getElementById("firma-iframe");

const CONSENT_KEY = "foroandalucista_cookie_pref";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const MOBILE_BREAKPOINT = 900;

function loadTallyEmbed() {
    if (!firmaIframe) {
        return;
    }

    const scriptUrl = "https://tally.so/widgets/embed.js";

    const initEmbed = () => {
        if (typeof Tally !== "undefined") {
            Tally.loadEmbeds();
        }
    };

    if (typeof Tally !== "undefined") {
        initEmbed();
        return;
    }

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
        existingScript.addEventListener("load", initEmbed, { once: true });
        return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onload = initEmbed;
    script.onerror = initEmbed;
    document.body.appendChild(script);
}

function updateFloatingOffsets() {
    const bannerHeight = cookieBanner && !cookieBanner.hidden ? cookieBanner.offsetHeight + 10 : 0;
    root.style.setProperty("--cookie-banner-height", `${bannerHeight}px`);

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const ctaVisible =
        isMobile &&
        mobileSignBtn &&
        getComputedStyle(mobileSignBtn).display !== "none" &&
        !mobileSignBtn.classList.contains("is-hidden");

    const ctaOffset = ctaVisible ? mobileSignBtn.offsetHeight + 12 : 0;
    root.style.setProperty("--mobile-cta-offset", `${ctaOffset}px`);
}

function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);

    if (cookieBanner) {
        cookieBanner.hidden = true;
    }

    updateFloatingOffsets();
}

function initCookies() {
    const storedConsent = localStorage.getItem(CONSENT_KEY);

    if (cookieBanner) {
        cookieBanner.hidden = storedConsent === CONSENT_ACCEPTED || storedConsent === CONSENT_REJECTED;
    }

    updateFloatingOffsets();
}

function initMobileSignCta() {
    if (!mobileSignBtn || !formBlock) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
            const hideCta = isMobile && entry.isIntersecting;
            mobileSignBtn.classList.toggle("is-hidden", hideCta);
            updateFloatingOffsets();
        },
        {
            threshold: 0.2
        }
    );

    observer.observe(formBlock);
}

if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener("click", () => setConsent(CONSENT_ACCEPTED));
}

if (cookieRejectBtn) {
    cookieRejectBtn.addEventListener("click", () => setConsent(CONSENT_REJECTED));
}

if (btnTop) {
    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        btnTop.style.display = scrollTop > 300 ? "block" : "none";
    });

    btnTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

window.addEventListener("resize", updateFloatingOffsets);

loadTallyEmbed();
initCookies();
initMobileSignCta();
updateFloatingOffsets();
