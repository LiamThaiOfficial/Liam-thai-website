// Force scroll to top on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

// Main Intro Animation (Home as Loader)
lenis.stop(); // Stop scrolling during intro

const introTl = gsap.timeline({
    onComplete: () => {
        lenis.start();
        ScrollTrigger.refresh(); // Ensure start values are correct after intro
        // Re-enable interactions or clear distinct properties if needed
    }
});

// Select elements for intro
const heroTitle = new SplitType('.hero-title', { types: 'lines, words' });
const heroImageContainer = document.querySelector('.hero-image-container');
const servicesBox = document.querySelector('.services-container');

// Logo and Nav Split
const logoText = new SplitType('.logo span', { types: 'chars' });
const navText = new SplitType('.nav a', { types: 'chars' });

// Function to wrap elements for reveal
const wrapElements = (elements, styles = {}) => {
    elements.forEach(el => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'inline-block';
        Object.assign(wrapper.style, styles);
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    });
};

// Wrap hero title lines
heroTitle.lines.forEach(line => {
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    wrapper.style.display = 'block';
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
});

// Wrap logo and nav chars
wrapElements(logoText.chars, { paddingBottom: '8px' });
wrapElements(navText.chars);

// Set Initial States
gsap.set(logoText.chars, { yPercent: 100 });
gsap.set(navText.chars, { yPercent: 100 });
gsap.set(heroTitle.lines, { yPercent: 100 });
gsap.set('.hero-image-reveal', { clipPath: "inset(100% 0% 0% 0%)" });
// Removed img scale set

// Services Camera Animation Setup
gsap.set(servicesBox, { autoAlpha: 0 }); // Hide container initially
const servicesCorners = document.querySelectorAll('.services-container .corner');
const servicesContent = document.querySelectorAll('.services-intro, .services-grid');
gsap.set(servicesContent, { autoAlpha: 0 }); // Hide content

// Center corners
gsap.set(".services-container .tl", { top: "50%", left: "50%", xPercent: -50, yPercent: -50 });
gsap.set(".services-container .tr", { top: "50%", right: "50%", xPercent: 50, yPercent: -50 });
gsap.set(".services-container .bl", { bottom: "50%", left: "50%", xPercent: -50, yPercent: 50 });
gsap.set(".services-container .br", { bottom: "50%", right: "50%", xPercent: 50, yPercent: 50 });

// Helper to split and wrap text
const splitAndWrap = (selector, type = 'lines') => {
    const split = new SplitType(selector, { types: type });
    // Wrap lines/words/chars
    const target = type === 'lines' ? split.lines : (type === 'words' ? split.words : split.chars);
    if (!target) return null;

    target.forEach(el => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = type === 'lines' ? 'block' : 'inline-block';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    });
    return target; // Return the specific split elements (lines/chars)
};

// Helper to wrap a NodeList (used for manually split elements)
const wrapNodeList = (nodes) => {
    nodes.forEach(el => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    });
};

// 1. Services Text (Intro) - Removed split effect as requested
// const servicesIntroLines = splitAndWrap('.services-intro', 'lines'); ...

// Set initial states for Services
// note: servicesContent autoAlpha already set to 0 above
// No text splitting for services

// 2. About Description (Pinned)
const aboutDescLines = splitAndWrap('.about-desc', 'lines');
gsap.set(aboutDescLines, { yPercent: 100 });


// 3. Other Sections (Work & Contact) - Standard ScrollTrigger
const otherTextSelectors = ['.section-label', '.contact-title', '.contact-info p'];
const otherTextElements = [];

otherTextSelectors.forEach(selector => {
    // We need to split them individually to create triggers for each or batch them?
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const split = new SplitType(el, { types: 'lines' });
        if (split.lines) {
            wrapNodeList(split.lines);
            gsap.set(split.lines, { yPercent: 100 });

            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(split.lines, {
                        yPercent: 0,
                        duration: 1,
                        stagger: 0.1,
                        ease: "power3.out"
                    });
                }
            });
        }
    });
});


// ... (Intro TL Construction) ...

// Build Intro Timeline
introTl
    .to(logoText.chars, {
        yPercent: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out"
    })
    .to(navText.chars, {
        yPercent: 0,
        duration: 1,
        stagger: 0.01,
        ease: "power4.out"
    }, "<0.2")
    .to(heroTitle.lines, {
        yPercent: 0,
        duration: 2,
        stagger: 0.1,
        ease: "power4.out"
    }, "-=0.8")
    .to('.hero-image-reveal', {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "expo.inOut"
    }, "-=2.5")

    // Camera Expansion
    .to(servicesBox, { autoAlpha: 1, duration: 0.1 }, "-=1.5")
    .to(".services-container .tl", { top: "0%", left: "0%", xPercent: 0, yPercent: 0, duration: 0.7, ease: "power3.inOut" }, ">")
    .to(".services-container .tr", { top: "0%", right: "0%", xPercent: 0, yPercent: 0, duration: 0.7, ease: "power3.inOut" }, "<")
    .to(".services-container .bl", { bottom: "0%", left: "0%", xPercent: 0, yPercent: 0, duration: 0.7, ease: "power3.inOut" }, "<")
    .to(".services-container .br", { bottom: "0%", right: "0%", xPercent: 0, yPercent: 0, duration: 0.7, ease: "power3.inOut" }, "<")

    // Services Text Reveal (Simple Fade - Restored)
    .to(servicesContent, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.75");


const heroContainer = document.querySelector('.hero-image-container');
const heroRevealDiv = document.querySelector('.hero-image-reveal');
const heroImages = heroRevealDiv.querySelectorAll('img');
const homeSection = document.querySelector('#home');
const aboutSection = document.querySelector('#about-me');
const aboutImgActual = document.querySelector('.about-image img');
const coreValuesContainer = document.querySelector('.core-values-container');
const circle = document.getElementById('homeAboutTrigger');

let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    // Initial state Desktop
    gsap.set(aboutSection, { autoAlpha: 0 });
    gsap.set(aboutImgActual, { opacity: 0 });
    gsap.set(coreValuesContainer, { autoAlpha: 0 });
    gsap.set(".core-values-container .tl", { top: "50%", left: "50%", xPercent: -50, yPercent: -50 });
    gsap.set(".core-values-container .tr", { top: "50%", right: "50%", xPercent: 50, yPercent: -50 });
    gsap.set(".core-values-container .bl", { bottom: "50%", left: "50%", xPercent: -50, yPercent: 50 });
    gsap.set(".core-values-container .br", { bottom: "50%", right: "50%", xPercent: 50, yPercent: 50 });
    gsap.set(circle, { autoAlpha: 0 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#main-container",
            start: "top top",
            end: "+=700%",
            scrub: 2,
            pin: true,
            pinSpacing: true,
            fastScrollEnd: true,
            preventOverlaps: true
        }
    });

    tl.fromTo([".logo-nav", ".hero-title-container", ".services-container"],
        { opacity: 1 },
        {
            opacity: 0,
            duration: 1.5,
            stagger: 0,
            ease: "power2.in"
        }, "start")
        .to(heroContainer, {
            y: "20vh",
            scale: 0.9,
            duration: 2.5,
            ease: "expo.inOut"
        }, "start")

        // STAGE 1: Morph
        .to(heroRevealDiv, {
            borderRadius: "100%",
            backgroundColor: "#A6FF00",
            duration: 4,
            y: "-30vh",
            x: "-57.5vw",
            ease: "power2.inOut"
        }, "morph")

        // STAGE 2: Swap
        .to(aboutSection, {
            autoAlpha: 1,
            duration: 8,
            ease: "power2.inOut"
        }, "morph")
        .to(homeSection, {
            opacity: 0,
            duration: 10,
            ease: "power2.inOut"
        }, "morph")

        // STAGE 4: Image Morph
        .to(heroRevealDiv, {
            width: aboutImgActual.offsetWidth,
            height: aboutImgActual.offsetHeight,
            scale: 1.1,
            borderRadius: "4px",
            duration: 4,
            ease: "power2.inOut"
        }, "morph+=2")
        .to(aboutImgActual, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "morph+=2.5")
        .to(heroRevealDiv, {
            autoAlpha: 0,
            duration: 6
        }, "morph+=4")

        // STAGE 5: Final Reveal
        .to(coreValuesContainer, { autoAlpha: 1, duration: 5 }, "land")
        .to(".core-values-container .tl", { top: "0%", left: "0%", xPercent: 0, yPercent: 0, duration: 3, ease: "power3.inOut" }, "land+=0.5")
        .to(".core-values-container .tr", { top: "0%", right: "0%", xPercent: 0, yPercent: 0, duration: 3, ease: "power3.inOut" }, "<")
        .to(".core-values-container .bl", { bottom: "0%", left: "0%", xPercent: 0, yPercent: 0, duration: 3, ease: "power3.inOut" }, "<")
        .to(".core-values-container .br", { bottom: "0%", right: "0%", xPercent: 0, yPercent: 0, duration: 3, ease: "power3.inOut" }, "<")

        .to(aboutDescLines, {
            yPercent: 0,
            duration: 2,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=1");
});

mm.add("(max-width: 768px)", () => {
    // Initial State Mobile
    gsap.set(aboutSection, { autoAlpha: 0 }); // Hidden initially
    gsap.set(aboutImgActual, { opacity: 1 }); // Image visible in its container
    gsap.set(heroRevealDiv, { clearProps: "all" }); // Reset props
    gsap.set(".hero-image-reveal", { clipPath: "inset(0% 0% 0% 0%)" }); // Ensure visible

    // Set Initial State for Core Values Corners (same as intro services)
    gsap.set(".core-values-container .tl", { top: "50%", left: "50%", xPercent: -50, yPercent: -50 });
    gsap.set(".core-values-container .tr", { top: "50%", right: "50%", xPercent: 50, yPercent: -50 });
    gsap.set(".core-values-container .bl", { bottom: "50%", left: "50%", xPercent: -50, yPercent: 50 });
    gsap.set(".core-values-container .br", { bottom: "50%", right: "50%", xPercent: 50, yPercent: 50 });
    gsap.set(coreValuesContainer, { autoAlpha: 0 }); // Hide container initially

    // We create a simpler timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#main-container",
            start: "top top",
            end: "+=150%", // shorter scroll for mobile
            scrub: 1,
            pin: true,
            pinSpacing: true
        }
    });

    // Simple Crossfade sequence
    tl.to(homeSection, { opacity: 0, duration: 1 })
        .to(aboutSection, { autoAlpha: 1, duration: 1 }, "<0.5")

        // Core Values Camera Expansion (On Scroll)
        .fromTo(coreValuesContainer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, "<")
        .to(".core-values-container .tl", { top: "0%", left: "0%", xPercent: 0, yPercent: 0, duration: 1, ease: "power2.out" }, "<")
        .to(".core-values-container .tr", { top: "0%", right: "0%", xPercent: 0, yPercent: 0, duration: 1, ease: "power2.out" }, "<")
        .to(".core-values-container .bl", { bottom: "0%", left: "0%", xPercent: 0, yPercent: 0, duration: 1, ease: "power2.out" }, "<")
        .to(".core-values-container .br", { bottom: "0%", right: "0%", xPercent: 0, yPercent: 0, duration: 1, ease: "power2.out" }, "<")

        .to(aboutDescLines, { yPercent: 0, duration: 1, stagger: 0.05 }, "<0.5");
});

// Horizontal Scroll Logic (My Work) - Desktop/Tablet Only
const workSection = document.querySelector("#my-work");
const workTrack = document.querySelector(".work-track");

if (workSection && workTrack) {
    let mmWork = gsap.matchMedia();

    // Only apply horizontal scroll on desktop/tablet (not mobile)
    mmWork.add("(min-width: 769px)", () => {
        // Calculate width dynamically
        const getScrollAmount = () => {
            return -(workTrack.scrollWidth - window.innerWidth);
        };

        const tween = gsap.to(workTrack, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: "#my-work",
                start: "top top",
                end: () => `+=${workTrack.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    });
}

// Work Grid Lightbox
// Work Grid Project Modal
// Work Grid Project Modal & Infinite Loop Logic
const cards = document.querySelectorAll('.work-card');
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalGallery = document.getElementById('modalGallery');
const closeBtn = document.querySelector('.close-lightbox');

let currentLoopTrace = null; // Store reference to kill animation on close

// Helper: Horizontal Loop Function (Simplified for this context)
function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;

    gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });
    gsap.set(items, { x: 0 });
    totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
            .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = vars => toIndex(curIndex + 1, vars);
    tl.previous = vars => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}

cards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const description = card.dataset.description || "Project details.";
        const galleryRaw = card.dataset.gallery;
        const mainImgSrc = card.querySelector('img').src;
        let galleryImages = galleryRaw ? galleryRaw.split(',') : [mainImgSrc];

        // Populate Modal
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        modalGallery.innerHTML = '';

        // Create enough duplicates to fill screen and allow looping
        // Minimum images needed for smooth loop depends on width, let's just clone set 4 times to be safe
        let completeList = [...galleryImages, ...galleryImages, ...galleryImages, ...galleryImages];

        completeList.forEach(src => {
            const img = document.createElement('img');
            img.src = src.trim();
            img.alt = title;
            modalGallery.appendChild(img);
        });

        // Show Modal
        projectModal.classList.add('active');
        // Stop Lenis
        lenis.stop();

        // Initialize Loop after a brief delay to ensure layout rendering
        setTimeout(() => {
            const images = modalGallery.querySelectorAll('img');
            const loop = horizontalLoop(images, {
                speed: 1, // relatively slow base speed
                repeat: -1,
                paddingRight: parseFloat(getComputedStyle(images[0]).marginRight)
            });

            currentLoopTrace = loop;

            // Add Wheel Listener for Interaction
            let observer = Observer.create({
                target: modalGallery,
                type: "wheel,touch,pointer",
                dragMinimum: 10,
                onPress: () => loop.pause(),
                onRelease: () => loop.play(),
                onChange: (self) => {
                    // Adjust timeScale based on drag/scroll delta
                    const delta = self.deltaX || self.deltaY;
                    gsap.to(loop, {
                        timeScale: delta * -0.5, // Sensitivity
                        duration: 0.5,
                        overwrite: true,
                        onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1 }) // Return to normal speed
                    });
                }
            });
            currentLoopTrace.observer = observer; // attached to clean up later

        }, 100);
    });
});

const closeLightbox = () => {
    projectModal.classList.remove('active');
    lenis.start(); // Resume page scroll

    // Kill the loop animation and observer
    if (currentLoopTrace) {
        if (currentLoopTrace.observer) currentLoopTrace.observer.kill();
        currentLoopTrace.kill();
        currentLoopTrace = null;
    }

    modalGallery.innerHTML = ''; // Clear images
};

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (projectModal) projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// Smooth scroll to top when Home is clicked
document.querySelectorAll('a[href="#home"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        lenis.scrollTo(0, { immediate: true }); // Jump instantly to top
    });
});
