document.addEventListener("DOMContentLoaded", function () {
  const burgerBtn = document.getElementById("burger-btn");
  const closeMenu = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  mobileMenu.style.display = "none";

  if (window.innerWidth < 1024) {
    overlay.style.display = "none";
    mobileMenu.style.display = "none";
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < 1024) {
      overlay.style.display = "none";
      mobileMenu.style.display = "none";
    }
  });
  
  console.log(mobileMenu.style.display, overlay.style.display)

  // console.log(burgerBtn)

  // burgerBtn.addEventListener("click", () => {
  //   toggleMenu();
  // })
  // if (burgerBtn && closeMenu && mobileMenu && overlay) {
  //   console.log('ff')
    const toggleMenu = () => {
      mobileMenu.style.display = mobileMenu.style.display === "flex" ? "none" : "flex";
      overlay.style.display = overlay.style.display === "block" ? "none" : "block";
      document.body.classList.toggle("no-scroll");
    };

    document.querySelectorAll(".header__nav__link").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelector(".mobile-menu").style.display = "none"; 
        document.querySelector(".overlay").style.display = "none"; 
        document.body.classList.remove("no-scroll");
      });
    });
    burgerBtn.addEventListener("click", toggleMenu);
    closeMenu.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
  // }

  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const stepImages = [
    document.getElementById("stepImage1"),
    document.getElementById("stepImage2"),
    document.getElementById("stepImage3"),
    document.getElementById("stepImage4"),
  ].filter(Boolean); 

  if (stepImages.length > 0) {
    const handleScroll = () => {
      stepImages.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const scrollProgress = Math.min(1, Math.max((window.innerHeight - rect.top) / window.innerHeight, 0));
        const maxScroll = 40;
        const translateY = Math.max(-maxScroll, (1 - scrollProgress) * -maxScroll);
        img.style.transform = `translateY(${translateY}%)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  const previewRef = document.getElementById("previewRef");
  if (previewRef) {
    const isLg = window.matchMedia("(min-width: 1024px)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            previewRef.classList.add("visible");

            if (isLg) {
              const handleScroll = () => {
                const rect = previewRef.getBoundingClientRect();
                const scrollProgress = Math.min(1, Math.max(rect.top / window.innerHeight, 0));

                previewRef.style.transform = `
                  perspective(1845px)
                  translateY(${scrollProgress * 18}px)
                  scale(${1 + scrollProgress * 0.09})
                  rotateX(${scrollProgress * 18}deg)
                `;
              };

              window.addEventListener("scroll", handleScroll);
              handleScroll();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(previewRef);
  }

});

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  const carousel = document.querySelector(".carousel");
  const arrowBtns = document.querySelectorAll(".price__btns button");

  if (!wrapper || !carousel || arrowBtns.length === 0) {
    console.error("Не удалось найти необходимые элементы для карусели.");
    return;
  }

  const firstCard = carousel.querySelector(".card");
  if (!firstCard) {
    console.error("Карточки не найдены в карусели.");
    return;
  }
  const firstCardWidth = firstCard.offsetWidth;

  const carouselChildrens = [...carousel.children];
  let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

  let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

  carouselChildrens
    .slice(-cardPerView)
    .reverse()
    .forEach((card) => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

  carouselChildrens.slice(0, cardPerView).forEach((card) => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");

  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
  });
  });

  // Функции для перетаскивания
  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  const infiniteScroll = () => {
    if (carousel.scrollLeft === 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }

    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
  };

  // const autoPlay = () => {
  //   if (window.innerWidth < 800 || !isAutoPlay) return;
  //   timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
  // };

  // autoPlay();
  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infiniteScroll);
  // wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  // wrapper.addEventListener("mouseleave", autoPlay);
});