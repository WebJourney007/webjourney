
// Une promesse par URL : deux appels concurrents pour le même script partagent la même
// attente. Sans ça, le second appel voyait la balise créée par le premier et résolvait
// immédiatement, alors que la lib n'était pas encore exécutée (gsap undefined chez l'appelant).
const scriptLoads = new Map();

function loadScript(src, attrs) {
  const pending = scriptLoads.get(src);
  if (pending) return pending;

  const load = new Promise((resolve, reject) => {
    if (src.includes('gsap.min.js') && typeof gsap !== 'undefined') {
      resolve();
      return;
    }
    if (src.includes('ScrollTrigger.min.js') && typeof ScrollTrigger !== 'undefined') {
      resolve();
      return;
    }

    // Balise écrite en dur dans le HTML : on attend son exécution au lieu de résoudre à l'aveugle.
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      // Une balise defer déjà exécutée ne réémettra pas 'load' : on résout directement.
      if (document.readyState === 'complete') {
        resolve();
      } else {
        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', reject, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    // Attributs optionnels (integrity, crossorigin…) pour conserver le SRI.
    Object.entries(attrs || {}).forEach(([name, value]) => script.setAttribute(name, value));
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  scriptLoads.set(src, load);
  return load;
}

function initSimpleLotties() {
  if (typeof lottie === 'undefined') {
    setTimeout(initSimpleLotties, 100);
    return;
  }
  const traitElement = document.querySelector('.trait');
  if (traitElement) {
    const traitAnim = lottie.loadAnimation({
      container: traitElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'documents/trait_001.json'
    });
    traitAnim.setSpeed(0.6);
    traitAnim.addEventListener('complete', function() {
      setTimeout(() => traitAnim.goToAndPlay(0, true), 2000);
    });
  }
}

function initScripts() {

  $(document).ready(function() {
$("[tr-scroll-toggle='component']").each(function () {
  let component = $(this);
  let lists = component.find("[tr-scroll-toggle='list']");
  let itemTotal = lists.first().children().length;
  component.find("[tr-scroll-toggle='number-total']").text(itemTotal);

  let firstTrigger = component.find("[tr-scroll-toggle='trigger']").first();
  for (let i = 1; i < itemTotal; i++) {
    firstTrigger.clone().appendTo(component);
  }
  let triggers = component.find("[tr-scroll-toggle='trigger']");
  firstTrigger.css("margin-top", "-100vh");
  let trSpacer = $("<div class='tr-scroll-toggle-spacer' style='width: 100%; height: 100vh;'></div>").hide().appendTo(component);

  let minWidth = 0;
  let trMinWidth = component.attr("tr-min-width");
  if (trMinWidth !== undefined && trMinWidth !== false) {
    minWidth = +trMinWidth;
  }
  if (typeof gsap === 'undefined' || typeof gsap.matchMedia !== 'function') {
    return;
  }
  gsap.matchMedia().add(`(min-width: ${minWidth}px)`, () => {
    trSpacer.show();
    function makeItemActive(activeIndex) {
      component.find("[tr-scroll-toggle='transform-y']").css("transform", `translateY(${activeIndex * -100}%)`);
      component.find("[tr-scroll-toggle='transform-x']").css("transform", `translateX(${activeIndex * -100}%)`);
      component.find("[tr-scroll-toggle='number-current']").text(activeIndex + 1);
      lists.each(function () {
        $(this).children().removeClass("is-active");
        const activeItem = $(this).children().eq(activeIndex);
        activeItem.addClass("is-active");

        $(this).find("[data-animation-type='lottie']").each(function() {
          const projectImg = $(this).closest('.project__imgs');
          const anim = projectImg.data('lottie-anim');
          if (anim) {

            anim.goToAndStop(0, true);

          }
        });
      });
    }
    makeItemActive(0);

    let anchorLinks = component.find("[tr-anchors]").children();
    anchorLinks.on("click", function () {
      let myIndex = $(this).index();
      let scrollDistance = triggers.eq(myIndex).offset().top + triggers.eq(myIndex).height() - 1;
      $("html, body").animate({ scrollTop: scrollDistance });
    });

    triggers.each(function (index) {
      let triggerIndex = index;
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top top",
          end: "bottom top",
          scrub: true,
          onToggle: ({ isActive }) => {
            if (isActive) makeItemActive(triggerIndex);
          }
        },
        defaults: { ease: "none" }
      });
      lists.each(function () {
        let childItem = $(this).children().eq(triggerIndex);
        tl.to(childItem.find("[tr-item-animation='scale-to-1']"), { scale: 1 }, 0);
        tl.from(childItem.find("[tr-item-animation='scale-from-1']"), { scale: 1 }, 0);
        tl.to(childItem.find("[tr-item-animation='progress-horizontal']"), { width: "100%" }, 0);
        tl.to(childItem.find("[tr-item-animation='progress-vertical']"), { height: "100%" }, 0);
        tl.to(childItem.find("[tr-item-animation='rotate-to-0']"), { rotation: 0 }, 0);
        tl.from(childItem.find("[tr-item-animation='rotate-from-0']"), { rotation: 0 }, 0);
      });
    });

    const lottieAnimations = [];

    function initLotties() {
      if (typeof lottie === 'undefined') {
        setTimeout(initLotties, 100);
        return;
      }

      lists.each(function(listIndex) {
        const list = $(this);
        const lottiesInList = list.find("[data-animation-type='lottie']");

        lottiesInList.each(function() {
          const lottieElement = this;

          const projectImg = $(lottieElement).closest('.project__imgs');
          const itemIndex = projectImg.index();

          if (itemIndex === -1) {
            return;
          }

          const src = lottieElement.getAttribute("data-src");
          if (!src) {
            return;
          }

          lottieElement.innerHTML = "";

      let anim = lottie.loadAnimation({
            container: lottieElement,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: src
      });

      anim.addEventListener("DOMLoaded", () => {
        let frames = anim.totalFrames;

            lottieAnimations[itemIndex] = {
              anim: anim,
              frames: frames,
              projectImg: projectImg
            };

            anim.goToAndStop(0, true);
          });
        });
      });

      triggers.each(function (triggerIndex) {
        const trigger = $(this);

        ScrollTrigger.create({
          trigger: trigger[0],
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: self => {

            if (lottieAnimations[triggerIndex]) {
              const lottieData = lottieAnimations[triggerIndex];

              if (lottieData.projectImg.hasClass('is-active')) {
                let currentFrame = Math.round(self.progress * lottieData.frames);
                lottieData.anim.goToAndStop(currentFrame, true);
              }
            }

            lottieAnimations.forEach((lottieData, index) => {
              if (index !== triggerIndex && lottieData && !lottieData.projectImg.hasClass('is-active')) {
                lottieData.anim.goToAndStop(0, true);
              }
            });
          }
        });
      });
    }

    initLotties();

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: component,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      },
      defaults: { ease: "none" }
    });
    tl.to(component.find("[tr-section-animation='scale-to-1']"), { scale: 1 }, 0);
    tl.from(component.find("[tr-section-animation='scale-from-1']"), { scale: 1 }, 0);
    tl.to(component.find("[tr-section-animation='progress-horizontal']"), { width: "100%" }, 0);
    tl.to(component.find("[tr-section-animation='progress-vertical']"), { height: "100%" }, 0);
    tl.to(component.find("[tr-section-animation='rotate-to-0']"), { rotation: 0 }, 0);
    tl.from(component.find("[tr-section-animation='rotate-from-0']"), { rotation: 0 }, 0);

    if (component.attr("tr-scroll-snap") === "true") {
      let tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: component,
          start: "top top",
          end: "bottom bottom",
          snap: {
            snapTo: "labelsDirectional",
            duration: { min: 0.01, max: 0.2 },
            delay: 0.0001,
            ease: "power1.out"
          }
        }
      });
      triggers.each(function (index) {
        tl2.to($(this), { scale: 1, duration: 1 });
        tl2.addLabel("trigger" + index);
      });
    }

    return () => {
      trSpacer.hide();
      component.find("[tr-scroll-toggle='transform-y']").css("transform", "translateY(0%)");
      component.find("[tr-scroll-toggle='transform-x']").css("transform", "translateX(0%)");
      lists.each(function () {
        $(this).children().removeClass("is-active");
      });
    };
  });
  });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const navOffsetElement = document.getElementById('nav_offset');

  const navTriggers = document.querySelectorAll('.nav_trigger');

  function prepareTextWithLetters(textElement, text) {

    const existingLetters = textElement.querySelectorAll('.letter');
    existingLetters.forEach(letter => letter.remove());

    const letters = text.split('').map(char => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      return span;
    });

    textElement.textContent = '';
    letters.forEach(letter => textElement.appendChild(letter));

    return letters;
  }

  function updateButtonTexts(isMenuOpen, animate = true) {
    navTriggers.forEach(function(trigger) {
      const openElement = trigger.querySelector('.button_text.open');
      const closeElement = trigger.querySelector('.button_text.close');

      if (openElement && closeElement) {

        if (typeof gsap !== 'undefined' && animate) {

          let openLetters = openElement.querySelectorAll('.letter');
          let closeLetters = closeElement.querySelectorAll('.letter');

          if (openLetters.length === 0) {
            openLetters = prepareTextWithLetters(openElement, 'menu +');
          } else {
            openLetters = Array.from(openLetters);
          }

          if (closeLetters.length === 0) {
            closeLetters = prepareTextWithLetters(closeElement, 'close -');
          } else {
            closeLetters = Array.from(closeLetters);
          }

          if (isMenuOpen) {

            gsap.to(openLetters, {
              y: -20,
              opacity: 0,
              duration: 0.3,
              stagger: 0.02,
              ease: "power2.in",
              onComplete: function() {
                openElement.style.display = 'none';
              }
            });

            closeElement.style.display = 'block';
            gsap.fromTo(closeLetters, {
              y: 20,
              opacity: 0
            }, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.02,
              ease: "power2.out"
            });
          } else {

            gsap.to(closeLetters, {
              y: -20,
              opacity: 0,
              duration: 0.3,
              stagger: 0.02,
              ease: "power2.in",
              onComplete: function() {
                closeElement.style.display = 'none';
              }
            });

            openElement.style.display = 'block';
            gsap.fromTo(openLetters, {
              y: 20,
              opacity: 0
            }, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.02,
              ease: "power2.out"
            });
          }
        } else {

          if (isMenuOpen) {
            openElement.style.display = 'none';
            closeElement.style.display = 'block';
          } else {
            openElement.style.display = 'block';
            closeElement.style.display = 'none';
          }
        }
      }
    });
  }

  if (navTriggers.length > 0 && navOffsetElement) {

    const initialDisplay = window.getComputedStyle(navOffsetElement).display;
    const isInitiallyOpen = initialDisplay !== 'none';

    function initializeMenuOpacity() {
      if (typeof gsap === 'undefined') return;

      const initialDisplay = window.getComputedStyle(navOffsetElement).display;
      const isOpen = initialDisplay !== 'none';

      if (isOpen) {
        gsap.set(navOffsetElement, { opacity: 1 });
        const navOffsetContent = navOffsetElement.querySelector('.nav_offset_content');
        if (navOffsetContent) {

          const menuList = navOffsetContent.querySelector('ul');
          const menuItems = menuList ? Array.from(menuList.querySelectorAll('li')) : [];
          gsap.set(menuItems, { x: 0, opacity: 1 });
        }
      } else {
        gsap.set(navOffsetElement, { opacity: 0 });
        const navOffsetContent = navOffsetElement.querySelector('.nav_offset_content');
        if (navOffsetContent) {

          const menuList = navOffsetContent.querySelector('ul');
          const menuItems = menuList ? Array.from(menuList.querySelectorAll('li')) : [];
          gsap.set(menuItems, { x: 20, opacity: 0 });
        }
      }
    }

    updateButtonTexts(isInitiallyOpen, false);

    function prepareAllLetters() {
      if (typeof gsap === 'undefined') return;

      navTriggers.forEach(function(trigger) {
        const openElement = trigger.querySelector('.button_text.open');
        const closeElement = trigger.querySelector('.button_text.close');

        if (openElement && closeElement) {

          let openLetters = openElement.querySelectorAll('.letter');
          if (openLetters.length === 0) {
            openLetters = prepareTextWithLetters(openElement, 'menu +');
          } else {
            openLetters = Array.from(openLetters);
          }
          gsap.set(openLetters, { y: 0, opacity: 1 });

          let closeLetters = closeElement.querySelectorAll('.letter');
          if (closeLetters.length === 0) {
            closeLetters = prepareTextWithLetters(closeElement, 'close -');
          } else {
            closeLetters = Array.from(closeLetters);
          }
          gsap.set(closeLetters, { y: 0, opacity: 1 });
        }
      });
    }

    if (typeof gsap === 'undefined') {
      Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js'),
        loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js')
      ]).then(() => {
        prepareAllLetters();
        initializeMenuOpacity();
      });
    } else {

      prepareAllLetters();
      initializeMenuOpacity();
    }

    function openMenu() {
      if (typeof gsap === 'undefined') {
        navOffsetElement.style.display = 'flex';
        updateButtonTexts(true);
        return;
      }

      navOffsetElement.style.display = 'flex';

      const navOffsetContent = navOffsetElement.querySelector('.nav_offset_content');
      const menuList = navOffsetContent ? navOffsetContent.querySelector('ul') : null;
      const menuItems = menuList ? Array.from(menuList.querySelectorAll('li')) : [];

      gsap.set(navOffsetElement, {
        opacity: 0,
        scale: 0,
        transformOrigin: "top right"
      });
      if (menuItems.length > 0) {
        gsap.set(menuItems, { x: 20, opacity: 0 });
      }

      const tl = gsap.timeline();

      tl.to(navOffsetElement, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      if (menuItems.length > 0) {
        tl.to(menuItems, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out"
        }, "-=0.2");
      }

      updateButtonTexts(true);
    }

    function closeMenu() {
      if (typeof gsap === 'undefined') {
        navOffsetElement.style.display = 'none';
        updateButtonTexts(false);
        return;
      }

      const navOffsetContent = navOffsetElement.querySelector('.nav_offset_content');
      const menuList = navOffsetContent ? navOffsetContent.querySelector('ul') : null;
      const menuItems = menuList ? Array.from(menuList.querySelectorAll('li')) : [];

      const tl = gsap.timeline({
        onComplete: () => {
          navOffsetElement.style.display = 'none';

          gsap.set(navOffsetElement, { transformOrigin: "top right" });
        }
      });

      if (menuItems.length > 0) {
        tl.to(menuItems, {
          x: 20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.in"
        });
      }

      tl.set(navOffsetElement, { transformOrigin: "top right" });
      tl.to(navOffsetElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      }, "-=0.09>");

      updateButtonTexts(false);
    }

    navTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const computedStyle = window.getComputedStyle(navOffsetElement);
        const currentDisplay = computedStyle.display;

        if (currentDisplay === 'none') {
          openMenu();
        } else {
          closeMenu();
        }
      });
    });

    document.addEventListener('click', function(e) {
      const computedStyle = window.getComputedStyle(navOffsetElement);
      const currentDisplay = computedStyle.display;

      if (currentDisplay !== 'none') {

        const isClickInsideMenu = navOffsetElement.contains(e.target);
        const isClickOnTrigger = Array.from(navTriggers).some(function(trigger) {
          return trigger.contains(e.target);
        });

        if (!isClickInsideMenu && !isClickOnTrigger) {
          closeMenu();
        }
      }
    });
  }

  initFAQAccordion();
  initFormSubmitHandlers();
  initUsecaseShowcase();
});

function initFAQAccordion() {
  const faqButtons = document.querySelectorAll('.button.is-plus');
  if (faqButtons.length === 0) return;

  if (typeof gsap !== 'undefined') {
    faqButtons.forEach(function(button) {
      const buttonText = button.querySelector('p');
      if (buttonText) {
        gsap.set(buttonText, { opacity: 1, y: 0 });
      }
    });
  }

  const isAlreadyInitialized = faqButtons[0] && faqButtons[0].hasAttribute('data-faq-initialized');

  if (isAlreadyInitialized) {

    if (typeof gsap !== 'undefined') {
      faqButtons.forEach(function(button) {
        const buttonText = button.querySelector('p');
        if (buttonText) {
          gsap.set(buttonText, { opacity: 1, y: 0 });
        }
      });
    }
    return;
  }

  faqButtons.forEach(function(button) {
    button.setAttribute('data-faq-initialized', 'true');
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const faqWrapper = button.closest('.faq_wrapper');
      if (!faqWrapper) return;

      const faqReponse = faqWrapper.querySelector('.faq_reponse');
      if (!faqReponse) return;

      const isOpen = faqReponse.classList.contains('is-open');
      const faqReponseText = faqReponse.querySelector('.faq_reponse_text');

      if (isOpen) {

        faqReponse.classList.remove('is-open');

        const currentHeight = faqReponse.offsetHeight;

        if (typeof gsap !== 'undefined') {

          gsap.to(faqReponse, {
            height: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {

            }
          });
        } else {

          faqReponse.style.height = currentHeight + 'px';

          void faqReponse.offsetHeight;

          requestAnimationFrame(() => {
            faqReponse.style.height = '0';
          });
        }

        const buttonText = button.querySelector('p');
        if (buttonText) {
          if (typeof gsap !== 'undefined') {

            gsap.to(buttonText, {
              opacity: 0,
              y: 10,
              duration: 0.15,
              ease: "power2.in",
              onComplete: () => {
                buttonText.textContent = '+';
                gsap.fromTo(buttonText,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                );
              }
            });
          } else {

            buttonText.textContent = '+';
          }
        }
      } else {

        document.querySelectorAll('.faq_reponse.is-open').forEach(function(otherReponse) {
          if (otherReponse === faqReponse) return;
          otherReponse.classList.remove('is-open');
          const otherHeight = otherReponse.offsetHeight;
          if (typeof gsap !== 'undefined') {
            gsap.to(otherReponse, { height: 0, duration: 0.25, ease: "power2.inOut" });
          } else {
            otherReponse.style.height = otherHeight + 'px';
            void otherReponse.offsetHeight;
            otherReponse.style.height = '0';
          }
          const otherWrapper = otherReponse.closest('.faq_wrapper');
          const otherBtn = otherWrapper && otherWrapper.querySelector('.button.is-plus p');
          if (otherBtn) otherBtn.textContent = '+';
        });

        faqReponse.style.height = '0';

        void faqReponse.offsetHeight;

        faqReponse.style.height = 'auto';
        const targetHeight = faqReponse.scrollHeight;
        faqReponse.style.height = '0';

        void faqReponse.offsetHeight;

        faqReponse.classList.add('is-open');

        if (typeof gsap !== 'undefined') {

          gsap.to(faqReponse, {
            height: targetHeight,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {

              if (faqReponse.classList.contains('is-open')) {

                setTimeout(() => {
                  if (faqReponse.classList.contains('is-open')) {

                    requestAnimationFrame(() => {
                      if (faqReponse.classList.contains('is-open')) {
                        faqReponse.style.height = 'auto';
                      }
                    });
                  }
                }, 350);
              }
            }
          });
        } else {

          requestAnimationFrame(() => {
            faqReponse.style.height = targetHeight + 'px';

            setTimeout(() => {
              if (faqReponse.classList.contains('is-open')) {
                faqReponse.style.height = 'auto';
              }
            }, 350);
          });
        }

        const buttonText = button.querySelector('p');
        if (buttonText) {
          if (typeof gsap !== 'undefined') {

            gsap.to(buttonText, {
              opacity: 0,
              y: -10,
              duration: 0.15,
              ease: "power2.in",
              onComplete: () => {
                buttonText.textContent = '−';
                gsap.fromTo(buttonText,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                );
              }
            });
          } else {

            buttonText.textContent = '−';
          }
        }
      }
    });
  });
}

function initUsecaseShowcase() {
  var wrapper = document.querySelector('.usecase-showcase__wrapper');
  var beforeLayer = document.getElementById('usecase-before-layer');
  var divider = document.getElementById('usecase-divider');
  if (!wrapper || !beforeLayer || !divider) return;

  var currentPercent = 50;

  function setPosition(percent) {
    currentPercent = Math.max(0, Math.min(100, percent));
    divider.style.left = currentPercent + '%';
    beforeLayer.style.clipPath = 'inset(0 ' + (100 - currentPercent) + '% 0 0)';
  }

  function getPercent(clientX) {
    var rect = wrapper.getBoundingClientRect();
    var x = clientX - rect.left;
    return (x / rect.width) * 100;
  }

  function onMove(clientX) {
    setPosition(getPercent(clientX));
  }

  function onPointerDown(e) {
    e.preventDefault();
    onMove(e.touches ? e.touches[0].clientX : e.clientX);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  }

  function onMouseMove(e) {
    onMove(e.clientX);
  }

  function onTouchMove(e) {
    e.preventDefault();
    onMove(e.touches[0].clientX);
  }

  function onPointerUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onPointerUp);
  }

  divider.addEventListener('mousedown', onPointerDown);
  divider.addEventListener('touchstart', onPointerDown, { passive: true });

  setPosition(50);
}

function initFormSubmitHandlers() {
  var forms = document.querySelectorAll('form[action*="send-email"]');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var messageEl = form.querySelector('[id$="form-message"]') || form.querySelector('.devis-form__message, .contact_page_form__message');
      var submitBtn = form.querySelector('button[type="submit"]');
      var baseClass = messageEl ? messageEl.className.replace(/\s*is-(success|error)\s*/g, '').trim() : '';
      if (!messageEl) return;
      messageEl.textContent = '';
      messageEl.className = baseClass;
      messageEl.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
      }
      var action = form.getAttribute('action') || '/send-email.php';
      var formData = new FormData(form);
      fetch(action, { method: 'POST', body: formData })
        .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
        .then(function(_ref) {
          var ok = _ref.ok;
          var data = _ref.data;
          var msg = (data && data.message) ? data.message : (ok ? 'Message envoyé.' : 'Une erreur est survenue.');
          messageEl.textContent = msg;
          messageEl.className = baseClass + (ok ? ' is-success' : ' is-error');
          messageEl.style.display = 'block';
          if (ok) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: 'form_submit',
              form_type: form.id || 'contact'
            });
            if (typeof fbq === 'function') fbq('track', 'Lead');
          }
          requestAnimationFrame(function() {
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        })
        .catch(function() {
          messageEl.textContent = 'Erreur de connexion. Veuillez réessayer ou nous contacter par email.';
          messageEl.className = baseClass + ' is-error';
          messageEl.style.display = 'block';
          requestAnimationFrame(function() {
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        })
        .finally(function() {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
}

function initPillAnimation() {

  const isMobile = window.matchMedia('(max-width: 991px)').matches;

  const len = v => Math.hypot(v.x, v.y);
  const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
  const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
  const mul = (v, k) => ({ x: v.x * k, y: v.y * k });
  const norm = v => { const L = len(v) || 1; return { x: v.x / L, y: v.y / L }; };
  const dot = (a, b) => a.x * b.x + a.y * b.y;
  const cross = (a, b) => a.x * b.y - a.y * b.x;
  function areaPx(pts) {
    let s = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      s += p.x * q.y - q.x * p.y;
    }
    return s / 2;
  }
  function roundedPathFromPolygon(pxPts, radius) {
    const n = pxPts.length, isCW = areaPx(pxPts) < 0;
    let d = '';
    for (let i = 0; i < n; i++) {
      const pPrev = pxPts[(i - 1 + n) % n], p = pxPts[i], pNext = pxPts[(i + 1) % n];
      const vin = norm(sub(p, pPrev)), vout = norm(sub(pNext, p));
      const cosT = Math.max(-1, Math.min(1, dot(mul(vin, -1), vout)));
      const theta = Math.acos(cosT);
      const off = Math.min(
        radius / Math.tan(theta / 2 || 1e-6),
        len(sub(p, pPrev)) * 0.5,
        len(sub(pNext, p)) * 0.5
      );
      const p1 = add(p, mul(vin, -off)), p2 = add(p, mul(vout, off));
      if (i === 0) d += `M${p1.x},${p1.y}`; else d += `L${p1.x},${p1.y}`;
      const t = cross(vin, vout), sweep = isCW ? (t > 0 ? 0 : 1) : (t > 0 ? 1 : 0);
      d += ` A${radius},${radius} 0 0 ${sweep} ${p2.x},${p2.y}`;
    }
    return d + 'Z';
  }
  function applyRoundedClipPath(el, ptsPercent, radiusPx) {
    const w = el.clientWidth, h = el.clientHeight;
    const pxPts = ptsPercent.map(([xp, yp]) => ({ x: xp / 100 * w, y: yp / 100 * h }));
    el.style.clipPath = `path('${roundedPathFromPolygon(pxPts, radiusPx)}')`;
  }

  const bgPanels = document.querySelectorAll('[class*="bg--panels"], [class*="bg--panel"]');

  if (bgPanels.length === 0) {
    return;
  }

  bgPanels.forEach(function(bgPanel) {

    const refParent = bgPanel.parentElement;
    const pill = refParent.querySelector('[class*="pill"]');

    if (!pill) {
      return;
    }

    const pillContent = refParent.querySelector('[class*="project--name"]') || pill.querySelector('p, .capital');

    function checkIsMobile() {
      return window.matchMedia('(max-width: 991px)').matches;
    }

    function computePolygonFromPill() {
      const pr = refParent.getBoundingClientRect();
      const br = pill.getBoundingClientRect();
      const w = pr.width, h = pr.height;

      if (w === 0 || h === 0 || !isFinite(w) || !isFinite(h)) {
        return null;
      }

      const yTop = ((br.top - pr.top) / h) * 100;
      const yBot = ((br.bottom - pr.top) / h) * 100;
      const depth = ((br.left - pr.left + br.width) / w) * 100;

      const safeYTop = Math.max(0, Math.min(100, yTop));
      const safeYBot = Math.max(0, Math.min(100, yBot));
      const safeDepth = Math.max(0, Math.min(100, depth));

      return [
        [0, 0], [100, 0], [100, 100], [0, 100],
        [0, safeYBot], [safeDepth, safeYBot], [safeDepth, safeYTop], [0, safeYTop]
      ];
    }
    function pillRadius() {
      const v = getComputedStyle(pill).borderTopLeftRadius;
      const px = parseFloat(v) || 12;
      return px + 1;
    }

    function recalculateSubstract() {

      const prRect = refParent.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();

      if (prRect.width === 0 || prRect.height === 0 ||
          pillRect.width === 0 || pillRect.height === 0 ||
          !isFinite(prRect.width) || !isFinite(prRect.height)) {

        bgPanel.style.clipPath = 'none';
        return;
      }

      const pts = computePolygonFromPill();

      if (pts === null) {
        bgPanel.style.clipPath = 'none';
        return;
      }

      applyRoundedClipPath(bgPanel, pts, pillRadius());
    }

    function render() {
      recalculateSubstract();
    }

    const proxy = { x: -105, opacity: 0 };
    function applyPillX() {
      pill.style.transform = `translateX(0%)`;

      if (pillContent && !pillContent.classList.contains('project--name')) {

        if (typeof gsap !== 'undefined') {
          gsap.set(pillContent, { opacity: proxy.opacity, clearProps: 'none' });
        } else {

          pillContent.style.opacity = proxy.opacity;
        }
      }

      render();
    }

    const tl = gsap.timeline({})
      .to(proxy, {
        keyframes: [
          { x: -5, opacity: 0, duration: 1.2, ease: "power1.out", onUpdate: applyPillX },
          { x: -5, opacity: 1, duration: 0.5, ease: "power2.out", onUpdate: applyPillX }
        ]
      });

    applyPillX();

    const mediaQuery = window.matchMedia('(max-width: 991px)');
    function handleMediaChange(e) {

      recalculateSubstract();

      tl.invalidate();
      proxy.x = -105;
      proxy.opacity = 0;
      applyPillX();

      tl.restart();
    }
    mediaQuery.addEventListener('change', handleMediaChange);

    let resizeRafId = null;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    function handleResize() {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      if (currentWidth === lastWidth && currentHeight === lastHeight) {
        return;
      }

      lastWidth = currentWidth;
      lastHeight = currentHeight;

      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }

      resizeRafId = requestAnimationFrame(() => {

        recalculateSubstract();

        tl.invalidate();

        proxy.x = -105;
        proxy.opacity = 0;
        applyPillX();

        tl.restart();

        resizeRafId = null;
      });
    }

    window.addEventListener('resize', handleResize);

    let rafId = null;
    function scheduleRender() {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {

          render();
          rafId = null;
        });
      }
    }

    new ResizeObserver(() => scheduleRender()).observe(pill);
    new ResizeObserver(() => scheduleRender()).observe(refParent);

    recalculateSubstract();

  });
}

function initTextSplitAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof lottie === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const original = document.querySelector(".lottie--split");
  if (!original) return;

  const src = original.getAttribute("data-src") || original.getAttribute("data-lottie-url");
  if (!src) return;

  const clean = original.cloneNode(false);
  ["data-animation-type","data-src","data-lottie-url","data-autoplay","data-default-duration","data-loop","data-w-id"]
    .forEach(a => clean.removeAttribute(a));
  original.replaceWith(clean);
  Object.assign(clean.style, {
    position: "absolute",
    inset: "0",
    margin: "auto",
    visibility: "hidden"
  });
  const wrapper = clean.closest(".lottie__wrapper") || document.body;
  const setSize = () => {
    const r = wrapper.getBoundingClientRect();
    clean.style.width  = r.width * 0.6 + "px";
    clean.style.height = r.height * 0.6 + "px";
  };
  window.addEventListener("resize", () => { setSize(); ScrollTrigger.refresh(); });
  setSize();

  const anim = lottie.loadAnimation({
    container: clean,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: src
  });

  function shuffleArray(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  anim.addEventListener("DOMLoaded", () => {
    anim.stop();
    clean.style.visibility = "visible";
    const total = Math.max(anim.totalFrames || 0, 1);
    let last = -1;

    const line1LeftFinal  = "Vision <span class='main--text'>globale</span>";
    const line1RightFinal = "Expertise <span class='main--text'>technique</span>";
    const line2LeftFinal  = "Stratégie, identité, expérience :";
    const line2RightFinal = "Développement sur mesure,";
    const line3LeftFinal  = "chaque étape trouve sa place,";
    const line3RightFinal = "optimisation, innovation :";
    const line4LeftFinal  = "chaque élément";
    const line4RightFinal = "une maîtrise discrète,";
    const line5LeftFinal  = "dialogue avec l'autre.";
    const line5RightFinal = "au service de vos ambitions digitales.";

    const lines = [
      { left: ".line-1-left", right: ".line-1-right", distLeft: 90,  distRight: 60, range: [0.45, 0.5], finalLeft: line1LeftFinal, finalRight: line1RightFinal },
      { left: ".line-2-left", right: ".line-2-right", distLeft: 100, distRight: 80,  range: [0.45, 0.51], finalLeft: line2LeftFinal, finalRight: line2RightFinal },
      { left: ".line-3-left", right: ".line-3-right", distLeft: 50, distRight: 110, range: [0.47, 0.55], finalLeft: line3LeftFinal, finalRight: line3RightFinal },
      { left: ".line-4-left", right: ".line-4-right", distLeft: 80,  distRight: 120, range: [0.48, 0.55], finalLeft: line4LeftFinal, finalRight: line4RightFinal },
      { left: ".line-5-left", right: ".line-5-right", distLeft: 120, distRight: 90,  range: [0.49, 0.58], finalLeft: line5LeftFinal, finalRight: line5RightFinal }
    ];

    lines.forEach(line => {
      [line.left, line.right].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          el.dataset.original = el.innerHTML;
        }
      });
    });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: () => "+=" + window.innerHeight * 1.5,
      scrub: true,
      ease: "easeInOut",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      markers: false,
      onUpdate: self => {
        const frame = Math.floor(self.progress * (total - 1));
        if (frame !== last) {
          last = frame;
          anim.goToAndStop(frame, true);
        }

        lines.forEach((line) => {
          const elLeft  = document.querySelector(line.left);
          const elRight = document.querySelector(line.right);
          if (!elLeft || !elRight) return;
          const [start, end] = line.range;
          const p = gsap.utils.clamp(0, 1, (self.progress - start) / (end - start));
          const leftX  = -line.distLeft  * p;
          const rightX =  line.distRight * p;
          gsap.set(elLeft,  { x: leftX });
          gsap.set(elRight, { x: rightX });
          [elLeft, elRight].forEach((el, sideIndex) => {
            const finalHTML = sideIndex === 0 ? line.finalLeft : line.finalRight;
            const finalText = finalHTML.replace(/<[^>]*>/g, "");
            const origHTML = el.dataset.original;
            const origText = origHTML.replace(/<[^>]*>/g, "");
            const origLen = origText.length;
            const finalLen = finalText.length;
            if (p > 0 && p < 1) {
              const currentLen = Math.floor(origLen + (finalLen - origLen) * p);
              let chars = origText.split(" ");

              if (p < 0.3) {
                const amount = Math.floor(chars.length * p * 0.5);
                for (let i = 0; i < amount; i++) {
                  const j = Math.floor(Math.random() * chars.length);
                  const k = Math.floor(Math.random() * chars.length);
                  [chars[j], chars[k]] = [chars[k], chars[j]];
                }
              }

              else if (p < 0.7) {
                chars = shuffleArray(chars);
              }

              else {
                const revealProgress = (p - 0.7) / 0.3;
                const revealCount = Math.floor(finalLen * revealProgress);
                chars = shuffleArray(chars).slice(0, currentLen).split ? shuffleArray(chars).slice(0, currentLen) : chars;
                let arr = Array.isArray(chars) ? chars : chars.split("");
                let finalArr = finalText.split("");
                for (let i = 0; i < revealCount && i < finalLen; i++) {
                  arr[i] = finalArr[i];
                }
                chars = arr;
              }
              el.textContent = chars.join("").slice(0, currentLen);
            } else if (p >= 1) {
              el.innerHTML = finalHTML;
            } else if (p <= 0) {
              el.innerHTML = el.dataset.original;
            }
          });
        });
      }
    });
    ScrollTrigger.refresh();
  });
}

// GSAP pilote le menu et les animations visibles d'emblée : chargement immédiat.
const gsapPromise = (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined')
  ? Promise.resolve()
  : Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js'),
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js')
    ]);

// jQuery (~90 Ko) et lottie-web (~260 Ko) ne servent qu'à des blocs situés sous la ligne
// de flottaison. Les charger dès le départ vole de la bande passante au LCP et gonfle
// le TBT. On attend donc l'approche de ces blocs, avec un filet au premier temps mort.
const JQUERY_SRC = 'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=68a5ea1e1a93d5624e764e91';
const LOTTIE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
const HEAVY_SELECTOR = "[tr-scroll-toggle='component'], .trait, .lottie--split, [data-animation-type='lottie']";

function whenApproaching(targets) {
  return new Promise((resolve) => {
    if (!('IntersectionObserver' in window)) {
      resolve();
      return;
    }
    // 1200px de marge : les libs sont prêtes bien avant que le bloc n'entre à l'écran,
    // et les mutations DOM de initScripts() restent hors viewport (pas de CLS).
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        resolve();
      }
    }, { rootMargin: '1200px 0px' });
    targets.forEach(target => observer.observe(target));
  });
}

function onDomReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
}

// Animations visibles d'emblée : ne dépendent que de GSAP.
gsapPromise.then(() => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  onDomReady(() => {
    initPillAnimation();
    initFAQAccordion();
  });
}).catch(err => {
});

// Blocs sous la ligne de flottaison. Si la page n'en contient aucun, jQuery et lottie
// ne sont jamais téléchargés : un visiteur qui ne scrolle pas ne paie rien.
const heavyTargets = document.querySelectorAll(HEAVY_SELECTOR);

if (heavyTargets.length) {
  const heavyLibsPromise = whenApproaching(heavyTargets).then(() => Promise.all([
    typeof jQuery !== 'undefined'
      ? Promise.resolve()
      : loadScript(JQUERY_SRC, { integrity: 'sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=', crossorigin: 'anonymous' }),
    typeof lottie !== 'undefined'
      ? Promise.resolve()
      : loadScript(LOTTIE_SRC)
  ]));

  Promise.all([gsapPromise, heavyLibsPromise]).then(() => {
    initScripts();
    onDomReady(() => {
      initSimpleLotties();
      initTextSplitAnimation();
    });
  }).catch(err => {
  });
}

function initProjectAnimation() {
  const projetButtons = document.querySelectorAll('.button.is-projet');
  if (projetButtons.length === 0) return;

  const isAlreadyInitialized = projetButtons[0] && projetButtons[0].hasAttribute('data-projet-initialized');

  if (isAlreadyInitialized) {
    return;
  }

  projetButtons.forEach(function(button) {
    button.setAttribute('data-projet-initialized', 'true');
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const projectItem = button.closest('.project_item');
      if (!projectItem) return;

      const projetReponse = projectItem.querySelector('.projet_reponse');
      if (!projetReponse) return;

      const isOpen = projetReponse.classList.contains('is-open');
      const buttonText = button.querySelector('.button_text');

      if (isOpen) {

        projetReponse.classList.remove('is-open');

        const currentHeight = projetReponse.offsetHeight;

        if (typeof gsap !== 'undefined') {
          gsap.to(projetReponse, {
            height: 0,
            paddingTop: 0,
            duration: 0.3,
            ease: "power2.inOut"
          });
        } else {
          projetReponse.style.height = currentHeight + 'px';
          void projetReponse.offsetHeight;
          requestAnimationFrame(() => {
            projetReponse.style.height = '0';
            projetReponse.style.paddingTop = '0';
          });
        }

        if (buttonText) {
          const originalText = buttonText.getAttribute('data-original-text') || buttonText.textContent.replace('−', '+');
          if (typeof gsap !== 'undefined') {
            gsap.to(buttonText, {
              opacity: 0,
              y: 10,
              duration: 0.15,
              ease: "power2.in",
              onComplete: () => {
                buttonText.textContent = originalText;
                gsap.fromTo(buttonText,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                );
              }
            });
          } else {
            buttonText.textContent = originalText;
          }
        }
      } else {

        projetReponse.style.height = '0';
        projetReponse.style.paddingTop = '0';
        void projetReponse.offsetHeight;
        projetReponse.style.paddingTop = '1.5em';
        projetReponse.style.height = 'auto';
        const targetHeight = projetReponse.scrollHeight;
        projetReponse.style.height = '0';
        projetReponse.style.paddingTop = '0';
        void projetReponse.offsetHeight;
        projetReponse.classList.add('is-open');

        if (typeof gsap !== 'undefined') {
          gsap.to(projetReponse, {
            height: targetHeight,
            paddingTop: '1.5em',
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
              setTimeout(() => {
                if (projetReponse.classList.contains('is-open')) {
                  requestAnimationFrame(() => {
                    if (projetReponse.classList.contains('is-open')) {
                      projetReponse.style.height = 'auto';
                    }
                  });
                }
              }, 350);
            }
          });
        } else {
          requestAnimationFrame(() => {
            projetReponse.style.height = targetHeight + 'px';
            projetReponse.style.paddingTop = '1.5em';
            setTimeout(() => {
              if (projetReponse.classList.contains('is-open')) {
                projetReponse.style.height = 'auto';
              }
            }, 350);
          });
        }

        if (buttonText) {

          if (!buttonText.hasAttribute('data-original-text')) {
            buttonText.setAttribute('data-original-text', buttonText.textContent);
          }
          const originalText = buttonText.getAttribute('data-original-text');
          const newText = originalText.replace('+', '−');

          if (typeof gsap !== 'undefined') {
            gsap.to(buttonText, {
              opacity: 0,
              y: -10,
              duration: 0.15,
              ease: "power2.in",
              onComplete: () => {
                buttonText.textContent = newText;
                gsap.fromTo(buttonText,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                );
              }
            });
          } else {
            buttonText.textContent = newText;
          }
        }
      }
    });
  });
}

function applyAlternatingLayout() {
  const projectItems = document.querySelectorAll('.project_item');
  if (projectItems.length === 0) return;

  const visibleProjects = Array.from(projectItems).filter(project => !project.classList.contains('is-hidden'));

  projectItems.forEach(project => {
    project.classList.remove('is-left-auto');
  });

  visibleProjects.forEach((project, index) => {

    if (index % 2 === 1) {
      project.classList.add('is-left-auto');
    }
  });
}

function initProjectFilter() {
  const filterWrapper = document.querySelector('.projet_filter_wrapper');
  const projectItems = document.querySelectorAll('.project_item');

  if (!filterWrapper || projectItems.length === 0) {
    return;
  }

  const filterButtons = filterWrapper.querySelectorAll('.button[filter-category]');

  if (filterButtons.length === 0) {
    return;
  }

  let activeFilter = null;

  function parseProjectCategories(categoryString) {
    if (!categoryString) return [];

    if (categoryString.startsWith('[') && categoryString.endsWith(']')) {
      return categoryString
        .slice(1, -1)
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);
    }

    return [categoryString.trim()];
  }

  function filterProjects(category) {

    if (activeFilter === category) {
      activeFilter = null;
      projectItems.forEach(project => {
        project.classList.remove('is-hidden');
      });

      filterButtons.forEach(button => {
        button.classList.remove('is-active');
      });

      applyAlternatingLayout();
      return;
    }

    activeFilter = category;

    projectItems.forEach(project => {
      const projectCategoryString = project.getAttribute('filter-category');
      const projectCategories = parseProjectCategories(projectCategoryString);

      if (projectCategories.includes(category)) {
        project.classList.remove('is-hidden');
      } else {
        project.classList.add('is-hidden');
      }
    });

    applyAlternatingLayout();

    filterButtons.forEach(button => {
      const buttonCategory = button.getAttribute('filter-category');
      if (buttonCategory === category) {
        button.classList.add('is-active');
      } else {
        button.classList.remove('is-active');
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('filter-category');
      if (category) {
        filterProjects(category);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProjectFilter();
    initProjectAnimation();

    applyAlternatingLayout();
  });
} else {
  initProjectFilter();
  initProjectAnimation();

  applyAlternatingLayout();
}


function fakeAccents(container) {
  const map = {
    'é': { base: 'e', accent: 'acute' },
    'è': { base: 'e', accent: 'grave' },
    'ê': { base: 'e', accent: 'circumflex' },
    'î': { base: 'i', accent: 'circumflex' },
    'ô': { base: 'o', accent: 'circumflex' },
    'û': { base: 'u', accent: 'circumflex' },
    'â': { base: 'a', accent: 'circumflex' },
    'ç': { base: 'c', accent: 'cedilla' },
    'à': { base: 'a', accent: 'grave' },
    'ù': { base: 'u', accent: 'grave' }
  };

  const ACCENT_RE = /[éèêîôûâçàù]/;

  function processTextNode(textNode) {
    const text = textNode.textContent;
    if (!ACCENT_RE.test(text)) return;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const info = map[text[i]];
      if (!info) continue;

      if (i > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, i)));
      }
      const span = document.createElement('span');
      span.className = `accent-fix ${info.accent}`;
      span.textContent = info.base;
      frag.appendChild(span);
      lastIndex = i + 1;
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
  }

  function walkNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.classList.contains('circumflex') || node.classList.contains('acute') ||
        node.classList.contains('grave') || node.classList.contains('cedilla')) return;
    Array.from(node.childNodes).forEach(walkNode);
  }

  const target = container.querySelector('p, h1, h2, h3, h4, h5, h6') || container;
  if (!target || !ACCENT_RE.test(target.textContent)) return;

  walkNode(target);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accent-fix').forEach(fakeAccents);
  });
} else {
  document.querySelectorAll('.accent-fix').forEach(fakeAccents);
}

function initVitrineToggle() {
  const toggle = document.getElementById('vitrineToggle');
  if (!toggle) return;

  const simpleMode = document.querySelector('.vitrine-section__mode--simple');
  const technicalMode = document.querySelector('.vitrine-section__mode--technical');

  if (!simpleMode || !technicalMode) return;

  toggle.setAttribute('aria-pressed', 'false');

  toggle.addEventListener('click', () => {
    const isTechnical = toggle.getAttribute('aria-pressed') === 'true';

    if (isTechnical) {

      toggle.setAttribute('aria-pressed', 'false');
      simpleMode.classList.add('is-active');
      technicalMode.classList.remove('is-active');
    } else {

      toggle.setAttribute('aria-pressed', 'true');
      simpleMode.classList.remove('is-active');
      technicalMode.classList.add('is-active');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVitrineToggle);
} else {
  initVitrineToggle();
}

function initSurMesureToggle() {
  const toggle = document.getElementById('surMesureToggle');
  if (!toggle) return;

  const simpleMode = document.querySelector('.sur-mesure-section__mode--simple');
  const technicalMode = document.querySelector('.sur-mesure-section__mode--technical');

  if (!simpleMode || !technicalMode) return;

  toggle.setAttribute('aria-pressed', 'false');

  toggle.addEventListener('click', () => {
    const isTechnical = toggle.getAttribute('aria-pressed') === 'true';

    if (isTechnical) {

      toggle.setAttribute('aria-pressed', 'false');
      simpleMode.classList.add('is-active');
      technicalMode.classList.remove('is-active');
    } else {

      toggle.setAttribute('aria-pressed', 'true');
      simpleMode.classList.remove('is-active');
      technicalMode.classList.add('is-active');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSurMesureToggle);
} else {
  initSurMesureToggle();
}

function initAbonnementsFlip() {
  document.querySelectorAll('.abonnements-section__flip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.abonnements-section__flip-inner').classList.add('is-flipped');
    });
  });

  document.querySelectorAll('.abonnements-section__flip-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.abonnements-section__flip-inner').classList.remove('is-flipped');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAbonnementsFlip);
} else {
  initAbonnementsFlip();
}

function initSolutionsProgress() {
  const progressIndicator = document.getElementById('solutionsProgress');
  if (!progressIndicator) return;

  const steps = progressIndicator.querySelectorAll('.solutions-progress__step');
  const sections = document.querySelectorAll('[data-section]');
  const footer = document.querySelector('.footer');

  if (steps.length === 0 || sections.length === 0) return;

  function updateOverFooter() {
    if (!footer) return;
    const progressRect = progressIndicator.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    const footerBottomHalfTop = footerRect.top + footerRect.height / 2;
    const overlapsFooterBottomHalf = progressRect.bottom > footerBottomHalfTop && progressRect.top < footerRect.bottom;
    progressIndicator.classList.toggle('is-over-footer', overlapsFooterBottomHalf);
  }

  function updateActiveStep() {
    const viewportCenter = window.scrollY + window.innerHeight / 2;
    const viewportTop = window.scrollY;
    const viewportBottom = window.scrollY + window.innerHeight;

    let activeStepIndex = 0;
    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionCenter = sectionTop + section.offsetHeight / 2;

      const isVisible = (viewportTop < sectionBottom && viewportBottom > sectionTop);

      if (isVisible) {

        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      }
    });

    if (closestSection) {
      activeStepIndex = parseInt(closestSection.getAttribute('data-section')) - 1;
    } else {

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const distance = Math.min(
          Math.abs(viewportTop - sectionTop),
          Math.abs(viewportBottom - sectionBottom)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection) {
        activeStepIndex = parseInt(closestSection.getAttribute('data-section')) - 1;
      }
    }

    steps.forEach((step, index) => {
      if (index === activeStepIndex) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveStep();
        updateOverFooter();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateActiveStep();
  updateOverFooter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSolutionsProgress);
} else {
  initSolutionsProgress();
}

    function initCitationSwiper() {
      if (typeof Swiper !== 'undefined') {
        const citationSwiper = new Swiper('.citation-swiper', {
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 1,
            dynamicBulletsGrow: true,
          },
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          speed: 1000,
        });
      } else {

        setTimeout(initCitationSwiper, 100);
      }
    }

    var showcaseSwiperInstance = null;
    function initShowcaseSwiper() {
      var mobileBlock = document.querySelector('.showcase__mobile');
      var container = mobileBlock && mobileBlock.querySelector('.showcase-swiper');
      if (!container) return;
      var isMobile = window.matchMedia('(max-width: 990px)').matches;
      if (isMobile && !showcaseSwiperInstance) {
        if (typeof Swiper === 'undefined') {
          setTimeout(initShowcaseSwiper, 100);
          return;
        }
        try {
          var paginationEl = mobileBlock.querySelector('.showcase-swiper-pagination');
          showcaseSwiperInstance = new Swiper(container, {
            slidesPerView: 'auto',
            spaceBetween: 20,
            speed: 500,
            pagination: paginationEl ? { el: paginationEl, clickable: true } : false,
          });
        } catch (e) {
          setTimeout(initShowcaseSwiper, 100);
        }
      } else if (!isMobile && showcaseSwiperInstance) {
        try {
          showcaseSwiperInstance.destroy(true, true);
        } catch (e) {}
        showcaseSwiperInstance = null;
      }
    }

    function onShowcaseResize() {
      initShowcaseSwiper();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initCitationSwiper();
        initShowcaseSwiper();
        if (document.querySelector('.showcase__mobile')) {
          window.addEventListener('resize', onShowcaseResize);
        }
      });
    } else {
      initCitationSwiper();
      initShowcaseSwiper();
      if (document.querySelector('.showcase__mobile')) {
        window.addEventListener('resize', onShowcaseResize);
      }
    }

function scrollToDiscover() {
  const target = document.getElementById('discover');
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    const discoverBtn = document.getElementById('scroll-to-discover-btn');
    if (discoverBtn) {
      discoverBtn.addEventListener('click', scrollToDiscover);
    }
  });
} else {
  const discoverBtn = document.getElementById('scroll-to-discover-btn');
  if (discoverBtn) {
    discoverBtn.addEventListener('click', scrollToDiscover);
  }
}

function initStepsAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(initStepsAnimation, 100);
    return;
  }

  const stepWrapper = document.querySelector('.step_wrapper');
  if (!stepWrapper) return;

  const stepLine = stepWrapper.querySelector('.step-line');
  const stepItems = stepWrapper.querySelectorAll('.step_item');
  const stepCounters = Array.from(stepItems).map(item => item.querySelector('.step_item_counter'));
  const stepContents = Array.from(stepItems).map(item => item.querySelector('.step_item_content'));

  if (!stepLine || stepItems.length === 0) return;

  gsap.set(stepLine, { height: 0 });

  const stepHalos = [];
  stepCounters.forEach(counter => {
    if (counter) {
      gsap.set(counter, { scale: 0, opacity: 0 });

      const halo = document.createElement('div');
      halo.className = 'step_item_counter_halo';
      counter.appendChild(halo);
      stepHalos.push(halo);
      gsap.set(halo, { scale: 0.9, opacity: 0.4 });
    } else {
      stepHalos.push(null);
    }
  });
  stepContents.forEach(content => {
    if (content) {
      gsap.set(content, { opacity: 0, y: 20 });
    }
  });

  const lineStartTop = 49;
  const gapBetweenItems = 60;

  const segmentPercent = 74 / 4;

  const positions = [0, segmentPercent, segmentPercent * 2, segmentPercent * 3];

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: 'power2.out'
    }
  });

  if (stepCounters[0] && stepHalos[0]) {
    tl.to(stepCounters[0], {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.4)'
    }, 0);

    tl.to(stepHalos[0], {
      scale: 1.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0);
  }
  if (stepContents[0]) {
    tl.to(stepContents[0], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.2);
  }

  const lineStartTime = 0.3;
  const lineDuration = 0.9;
  const lineEndTime = lineStartTime + lineDuration;

  tl.to(stepLine, {
    height: '74%',
    duration: lineDuration,
    ease: 'none'
  }, lineStartTime);

  const timeToPosition2 = lineStartTime + (lineDuration / 3);
  if (stepCounters[1] && stepHalos[1]) {
    tl.to(stepCounters[1], {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.4)'
    }, timeToPosition2);

    tl.to(stepHalos[1], {
      scale: 1.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, timeToPosition2);
  }
  if (stepContents[1]) {
    tl.to(stepContents[1], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, timeToPosition2 + 0.2);
  }

  const timeToPosition3 = lineStartTime + (lineDuration * 2 / 3);
  if (stepCounters[2] && stepHalos[2]) {
    tl.to(stepCounters[2], {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.4)'
    }, timeToPosition3);

    tl.to(stepHalos[2], {
      scale: 1.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, timeToPosition3);
  }
  if (stepContents[2]) {
    tl.to(stepContents[2], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, timeToPosition3 + 0.2);
  }

  const timeToPosition4 = lineEndTime;
  if (stepCounters[3] && stepHalos[3]) {
    tl.to(stepCounters[3], {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.4)'
    }, timeToPosition4);

    tl.to(stepHalos[3], {
      scale: 1.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, timeToPosition4);
  }
  if (stepContents[3]) {
    tl.to(stepContents[3], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, timeToPosition4 + 0.2);
  }

  ScrollTrigger.create({
    trigger: stepWrapper,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      tl.play();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initStepsAnimation, 500);
  });
} else {
  setTimeout(initStepsAnimation, 500);
}

function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('lets-talk-btn');
  const closeBtn = document.querySelector('.contact-modal__close');
  const overlay = document.querySelector('.contact-modal__overlay');
  const form = document.getElementById('contact-form');
  const messageDiv = document.getElementById('contact-form-message');

  if (!modal) return;

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';

    setTimeout(() => {
      if (form) form.reset();
      if (messageDiv) {
        messageDiv.textContent = '';
        messageDiv.className = 'contact-form__message';
        messageDiv.style.display = 'none';
      }
    }, 300);
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openForm') === 'true') {

    setTimeout(() => {
      openModal();
    }, 100);
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone || 'Non renseigné');
    formData.append('message', data.message);

    messageDiv.textContent = '';
    messageDiv.className = 'contact-form__message';
    messageDiv.style.display = 'none';

    if (!data.name || !data.email || !data.message) {
      showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const submitBtn = form.querySelector('.contact-form__submit');
    const originalText = submitBtn.querySelector('.button_text').textContent;
    submitBtn.querySelector('.button_text').textContent = 'Envoi...';
    submitBtn.disabled = true;

    try {

      const formAction = form.getAttribute('action');
      const accessKey = form.querySelector('input[name="access_key"]')?.value;

      if (formAction && formAction.includes('.php')) {

        const response = await fetch(formAction, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const text = await response.text();

        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          throw new Error('Erreur de format de réponse du serveur. Vérifiez les logs PHP.');
        }

        if (result.success) {
          showMessage('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
          form.reset();

          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          throw new Error(result.message || 'Erreur lors de l\'envoi');
        }
      } else if (formAction && formAction.includes('web3forms.com')) {

        const response = await fetch(formAction, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showMessage('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
          form.reset();

          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          throw new Error(result.message || 'Erreur lors de l\'envoi');
        }
      } else if (formAction && formAction.includes('formspree.io')) {

        const response = await fetch(formAction, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || 'Non renseigné',
            message: data.message,
            _replyto: data.email,
            _subject: `Nouveau message de ${data.name} - Web Journey`
          })
        });

        if (response.ok) {
          showMessage('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
          form.reset();

          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      } else {

        const subject = encodeURIComponent(`Nouveau message de ${data.name} - Web Journey`);
        const body = encodeURIComponent(
          `Nom: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Téléphone: ${data.phone || 'Non renseigné'}\n\n` +
          `Message:\n${data.message}`
        );
        window.location.href = `mailto:hello@webjourney.ch?subject=${subject}&body=${body}`;

        showMessage('Redirection vers votre application de messagerie...', 'success');
        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (error) {
      showMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter directement à hello@webjourney.ch', 'error');
    } finally {
      submitBtn.querySelector('.button_text').textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `contact-form__message is-${type}`;
    messageDiv.style.display = 'block';

    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactModal);
} else {
  initContactModal();
}












document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("play-button");
  const container = document.getElementById("video-container");
  const wrapper = document.getElementById("vimeo-wrapper");
  const localVideo = document.getElementById("local-video");
  if (!playButton || !container || !wrapper || !localVideo) return;
  let playerLoaded = false;
  function loadVimeoAPI(callback) {
    if (playerLoaded) return callback();
    playerLoaded = true;
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.onload = callback;
    document.head.appendChild(script);
  }
  function initPlayer() {
    // Fade out local video
    localVideo.style.opacity = "0";
    localVideo.style.transition = "opacity 0.6s ease";
    // Fade overlay
    container.classList.add("video-play");
    // Inject Vimeo iframe dynamically
    wrapper.innerHTML = `
      <iframe
        src="https://player.vimeo.com/video/1039040998?autopause=false&autoplay=1&muted=0&controls=1&playsinline=1"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
    playButton.style.display = "none";
  }
  playButton.addEventListener("click", () => {
    loadVimeoAPI(initPlayer);
  });
  // Optional: Load API early on first scroll or mouse move
  ["scroll", "mousemove", "touchstart"].forEach(evt => {
    window.addEventListener(evt, () => {
      loadVimeoAPI(() => {});
    }, { once: true });
  });
});
