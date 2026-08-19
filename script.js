const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");


// ===============================
// MOBILE MENU
// ===============================

menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});


// Tutup menu setelah memilih navigasi

document.querySelectorAll("#navLinks a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});


// ===============================
// ACTIVE NAVIGATION
// ===============================

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll("#navLinks a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });


    navItems.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


// ===============================
// LIGHTBOX & PROJECT LINKS
// ===============================

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".work-item[data-action]").forEach(item => {

    item.addEventListener("click", () => {

        const action = item.getAttribute("data-action");

        if (action === "lightbox") {

            const src = item.getAttribute("data-src");
            lightboxImg.src = src;
            lightboxImg.alt = item.querySelector("img")?.alt || "";
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";

        } else if (action === "link") {

            const href = item.getAttribute("data-href");
            window.open(href, "_blank");

        }

    });

});


function closeLightbox() {

    lightbox.classList.remove("active");
    document.body.style.overflow = "";

}


lightboxClose.addEventListener("click", closeLightbox);

lightbox.querySelector(".lightbox-overlay").addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") closeLightbox();

});
