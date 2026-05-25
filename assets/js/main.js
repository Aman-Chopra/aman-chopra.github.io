(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
    } else {
      initTheme(state);
    }
  };

  lamp.addEventListener("click", (e) => {
    const currentTheme = body.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    
    const rect = lamp.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.backgroundColor = nextTheme === "dark" ? "#131418" : "#ffffff";
    
    body.appendChild(ripple);
    
    setTimeout(() => {
      if (nextTheme === "dark") {
        localStorage.setItem("theme", "dark");
        body.setAttribute("data-theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
        body.removeAttribute("data-theme");
      }
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    }, 200);
  });

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });

  // Typing effect on Homepage
  const typingElement = document.getElementById("typing-element");
  if (typingElement) {
    const words = ["Software Engineer", "Distributed Systems Specialist", "NYU Courant Graduate"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 40 : 80;
      
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }
      
      setTimeout(type, typeSpeed);
    };
    
    setTimeout(type, 1000);
  }

  // Scroll Progress Indicator
  const scrollIndicator = document.getElementById("scroll-progress-indicator");
  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollIndicator.style.width = scrolled + "%";
    });
  }

  // Live GitHub Stats Caching Fetcher
  const repos = document.querySelectorAll(".project-github-stats");
  if (repos.length > 0) {
    repos.forEach((el) => {
      const repoName = el.getAttribute("data-repo");
      if (!repoName) return;
      
      const cacheKey = `gh-stats-${repoName}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      const updateStats = (stars, forks) => {
        const starEl = el.querySelector(".gh-stars .gh-count");
        const forkEl = el.querySelector(".gh-forks .gh-count");
        if (starEl) starEl.textContent = stars;
        if (forkEl) forkEl.textContent = forks;
      };
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const age = Date.now() - parsed.timestamp;
        if (age < 3600000) {
          updateStats(parsed.stars, parsed.forks);
          return;
        }
      }
      
      fetch(`https://api.github.com/repos/${repoName}`)
        .then((res) => {
          if (!res.ok) throw new Error("GitHub Limit reached");
          return res.json();
        })
        .then((data) => {
          const stars = data.stargazers_count;
          const forks = data.forks_count;
          updateStats(stars, forks);
          localStorage.setItem(cacheKey, JSON.stringify({
            stars,
            forks,
            timestamp: Date.now()
          }));
        })
        .catch((err) => {
          console.warn("GitHub Stats Load Error: ", err);
          updateStats(0, 0);
        });
    });
  }

  // Experience Accordion Slide Toggler
  const accordions = document.querySelectorAll(".expandable-experience");
  if (accordions.length > 0) {
    accordions.forEach((el) => {
      el.addEventListener("click", (e) => {
        // Prevent toggling if user clicks an actual link inside the accordion
        if (e.target.closest("a")) return;

        const isOpen = el.classList.contains("exp-open");
        
        // Optional: close other experience accordions for a clean single-open accordion feel
        accordions.forEach((other) => {
          other.classList.remove("exp-open");
          const otherContent = other.querySelector(".experience-details-content");
          if (otherContent) otherContent.style.maxHeight = null;
        });
        
        const content = el.querySelector(".experience-details-content");
        if (content) {
          if (isOpen) {
            el.classList.remove("exp-open");
            content.style.maxHeight = null;
          } else {
            el.classList.add("exp-open");
            content.style.maxHeight = content.scrollHeight + "px";
          }
        }
      });
    });
  }

  // Publications BibTeX Citation Copy Trigger
  const citationBtns = document.querySelectorAll(".pub-citation-btn");
  if (citationBtns.length > 0) {
    citationBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const bibtex = btn.getAttribute("data-bibtex");
        if (!bibtex) return;

        navigator.clipboard.writeText(bibtex)
          .then(() => {
            const btnText = btn.querySelector(".btn-text");
            const originalText = btnText.textContent;
            btnText.textContent = "Copied! ✓";
            btn.classList.add("citation-copied");

            setTimeout(() => {
              btnText.textContent = originalText;
              btn.classList.remove("citation-copied");
            }, 2000);
          })
          .catch((err) => {
            console.error("BibTeX copy failed: ", err);
          });
      });
    });
  }
})();
