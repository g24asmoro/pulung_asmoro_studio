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
const lightboxTrack = document.getElementById("lightboxTrack");
const lightboxSlider = document.getElementById("lightboxSlider");
const lightboxDots = document.getElementById("lightboxDots");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentSlide = 0;
let totalSlides = 0;
let images = [];

// Drag / swipe state
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;


function openLightbox(imageList) {

    images = imageList;
    totalSlides = images.length;
    currentSlide = 0;

    // Build slides
    lightboxTrack.innerHTML = "";

    images.forEach((src, i) => {

        const slide = document.createElement("div");
        slide.className = "lightbox-slide";

        const img = document.createElement("img");
        img.src = src;
        img.alt = "Slide " + (i + 1);
        img.draggable = false;

        slide.appendChild(img);
        lightboxTrack.appendChild(slide);

    });

    // Build dots
    lightboxDots.innerHTML = "";

    if (totalSlides > 1) {

        images.forEach((_, i) => {

            const dot = document.createElement("button");
            dot.className = "lightbox-dot" + (i === 0 ? " active" : "");
            dot.setAttribute("aria-label", "Slide " + (i + 1));

            dot.addEventListener("click", () => {

                goToSlide(i);

            });

            lightboxDots.appendChild(dot);

        });

    }

    updateSliderPosition(false);
    updateNavVisibility();

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

}


function closeLightbox() {

    lightbox.classList.remove("active");
    document.body.style.overflow = "";

}


function goToSlide(index) {

    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    updateSliderPosition(true);

}


function updateSliderPosition(animate) {

    const track = lightboxTrack;

    if (!animate) {

        track.style.transition = "none";

    } else {

        track.style.transition = "transform .4s cubic-bezier(.25,.46,.45,.94)";

    }

    currentTranslate = -currentSlide * 100;
    prevTranslate = currentTranslate;
    track.style.transform = "translateX(" + currentTranslate + "%)";

    // Update dots
    const dots = lightboxDots.querySelectorAll(".lightbox-dot");

    dots.forEach((dot, i) => {

        dot.classList.toggle("active", i === currentSlide);

    });

}


function updateNavVisibility() {

    if (totalSlides <= 1) {

        lightboxPrev.style.display = "none";
        lightboxNext.style.display = "none";

    } else {

        lightboxPrev.style.display = "flex";
        lightboxNext.style.display = "flex";

    }

}


// Arrow navigation
lightboxPrev.addEventListener("click", () => {

    if (currentSlide > 0) {

        goToSlide(currentSlide - 1);

    } else {

        goToSlide(totalSlides - 1); // loop to end

    }

});


lightboxNext.addEventListener("click", () => {

    if (currentSlide < totalSlides - 1) {

        goToSlide(currentSlide + 1);

    } else {

        goToSlide(0); // loop to start

    }

});


// Touch / Mouse drag
function dragStart(e) {

    isDragging = true;
    startX = getPositionX(e);
    lightboxTrack.classList.add("dragging");

    animationID = requestAnimationFrame(animation);

}


function dragMove(e) {

    if (!isDragging) return;

    const currentX = getPositionX(e);
    const diff = currentX - startX;
    const sliderWidth = lightboxSlider.offsetWidth;

    currentTranslate = prevTranslate + (diff / sliderWidth) * 100;

}


function dragEnd() {

    isDragging = false;
    cancelAnimationFrame(animationID);
    lightboxTrack.classList.remove("dragging");

    const movedBy = currentTranslate - prevTranslate;

    // Threshold: 15% swipe to change slide
    if (movedBy < -15 && currentSlide < totalSlides - 1) {

        currentSlide++;

    } else if (movedBy > 15 && currentSlide > 0) {

        currentSlide--;

    }

    updateSliderPosition(true);

}


function getPositionX(e) {

    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

}


function animation() {

    if (isDragging) {

        lightboxTrack.style.transform = "translateX(" + currentTranslate + "%)";
        requestAnimationFrame(animation);

    }

}


// Mouse events
lightboxSlider.addEventListener("mousedown", dragStart);
lightboxSlider.addEventListener("mousemove", dragMove);
lightboxSlider.addEventListener("mouseup", dragEnd);
lightboxSlider.addEventListener("mouseleave", () => {

    if (isDragging) dragEnd();

});


// Touch events
lightboxSlider.addEventListener("touchstart", dragStart, { passive: true });
lightboxSlider.addEventListener("touchmove", dragMove, { passive: true });
lightboxSlider.addEventListener("touchend", dragEnd);


// Keyboard navigation
document.addEventListener("keydown", (e) => {

    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && currentSlide > 0) goToSlide(currentSlide - 1);
    if (e.key === "ArrowRight" && currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);

});


// Click handlers for work items
document.querySelectorAll(".work-item[data-action]").forEach(item => {

    item.addEventListener("click", () => {

        const action = item.getAttribute("data-action");

        if (action === "lightbox") {

            const dataImages = item.getAttribute("data-images");

            if (dataImages) {

                const imageList = JSON.parse(dataImages);

                if (imageList.length > 0) {

                    openLightbox(imageList);

                }

            }

        } else if (action === "link") {

            const href = item.getAttribute("data-href");
            window.open(href, "_blank");

        }

    });

});


lightboxClose.addEventListener("click", closeLightbox);

lightboxClose.addEventListener("touchend", (e) => {

    e.preventDefault();
    closeLightbox();

});

lightbox.querySelector(".lightbox-overlay").addEventListener("click", closeLightbox);
