// Safely select elements (they might be null if not present in HTML)


const heroUploadBtn = document.getElementById("heroUploadBtn");

const demoBtn = document.getElementById("demoBtn");



demoBtn?.addEventListener("click", () => {
    alert("Demo feature coming soon 🚀");
});

/* =========================================
   NAVBAR SCROLL EFFECT
========================================= */
const navbar = document.querySelector("nav");

if (navbar) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}

(function() {
  const stages = { 
    upload: document.getElementById('stageUpload'), 
    scan: document.getElementById('stageScan'), 
    result: document.getElementById('stageResult') 
  };

  if (!stages.upload) return;

  const uploadBar = document.getElementById('uploadBar');
  const scanLabel = document.getElementById('scanLabel');
  const scoreRing = document.getElementById('scoreRing');
  const scoreNum = document.getElementById('scoreNum');
  const metricRows = document.querySelectorAll('.metricRow');
  const trendLine = document.getElementById('trendLine');
  const trendDots = document.getElementById('trendDots');
  const insightBox = document.getElementById('insightBox');
  const floatingFile = document.getElementById('floatingFile');
  const uploadDetails = document.getElementById('uploadDetails');
  const arogiBrand = document.getElementById('arogiaLogo');
  
  let currentActive = 'upload';

  function switchStage(newName, callback) {
    const oldStage = stages[currentActive];
    const newStage = stages[newName];

    if (oldStage && oldStage !== newStage) {
      oldStage.classList.remove('active');
      setTimeout(() => {
        newStage.classList.add('active');
        currentActive = newName;
        if(callback) callback();
      }, 400); // Wait for fade out
    } else {
      newStage.classList.add('active');
      currentActive = newName;
      if(callback) callback();
    }
  }

  function resetResult() {
    scoreRing.style.transition = 'none';
    scoreRing.style.strokeDasharray = '0, 100';
    scoreNum.textContent = '0';
    metricRows.forEach(r => r.classList.remove('show'));
    trendLine.style.transition = 'none';
    trendLine.style.strokeDashoffset = '400';
    trendDots.innerHTML = '';
    insightBox.classList.remove('show');
  }

  function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

  function runCycle() {
    resetResult();
    
    arogiBrand.classList.remove('hide');
    arogiBrand.classList.add('show');
    
    floatingFile.classList.remove('dropped');
    uploadDetails.classList.remove('show');
    uploadBar.style.transform = `scaleX(0)`;

    switchStage('upload', () => {
      setTimeout(() => { floatingFile.classList.add('dropped'); }, 100);

      setTimeout(() => {
        uploadDetails.classList.add('show');
        let start = null;
        function animateUpload(timestamp) {
          if (!start) start = timestamp;
          let progress = (timestamp - start) / 1200;
          if (progress > 1) progress = 1;
          uploadBar.style.transform = `scaleX(${progress})`;
          if (progress < 1) requestAnimationFrame(animateUpload);
          else setTimeout(startScan, 300);
        }
        requestAnimationFrame(animateUpload);
      }, 900);
    });
  }

  function startScan() {
    const steps = ['Extracting values...', 'Comparing normal ranges...', 'Generating summary...'];
    let i = 0;
    scanLabel.textContent = steps[0];
    
    switchStage('scan', () => {
      const scanIv = setInterval(() => {
        i++;
        if (i < steps.length) {
          scanLabel.textContent = steps[i];
        } else {
          clearInterval(scanIv);
          startResult();
        }
      }, 800);
    });
  }

  function startResult() {
    arogiBrand.classList.remove('show');
    arogiBrand.classList.add('hide');

    switchStage('result', () => {
      const target = 82;
      
      setTimeout(() => {
        scoreRing.style.transition = 'stroke-dasharray 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        scoreRing.style.strokeDasharray = `${target}, 100`;
      }, 50);

      let startScore = null;
      function animateScore(timestamp) {
        if (!startScore) startScore = timestamp;
        let progress = (timestamp - startScore) / 1500;
        if (progress > 1) progress = 1;
        let currentScore = Math.floor(target * easeOutQuart(progress));
        scoreNum.textContent = currentScore;
        if (progress < 1) requestAnimationFrame(animateScore);
      }
      requestAnimationFrame(animateScore);

      metricRows.forEach((row, idx) => {
        setTimeout(() => { row.classList.add('show'); }, 400 + (idx * 150));
      });

      setTimeout(() => {
        const pts = [[10,15], [130,30], [250,40], [370,8]];
        let str = pts.map(p => p.join(',')).join(' ');
        trendLine.setAttribute('points', str);
        
        trendLine.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
        setTimeout(() => { trendLine.style.strokeDashoffset = '0'; }, 50);
        
        trendDots.innerHTML = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#F59E0B" style="animation-delay: ${i * 0.15}s"></circle>`).join('');
      }, 1000);

      setTimeout(() => { insightBox.classList.add('show'); }, 1800);

      setTimeout(runCycle, 8500);
    });
  }

  // Initial Boot
  stages.upload.classList.add('active');
  setTimeout(runCycle, 100);
})();

/* =========================================
   STATS — SCROLL REVEAL + COUNT UP
========================================= */
const stats = document.querySelectorAll(".stat");

function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  if (isNaN(target)) return; // skip text-only stats like "AI", "PDF"
  const suffix = el.dataset.suffix || "";
  const numSpan = el.querySelector("span");
  let current = 0;
  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = target * eased;
    el.firstChild.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
    if (progress < 1) requestAnimationFrame(tick);
    else el.firstChild.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
          const numEl = entry.target.querySelector(".stat-num");
          if (numEl && numEl.dataset.target) animateCount(numEl);
        }, index * 150);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

stats.forEach(stat => statsObserver.observe(stat));

/* =========================================
   HOW IT WORKS — SCROLL REVEAL (ONE BY ONE)
========================================= */
const stepEls = document.querySelectorAll(".step-v");

const stepsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 400);
        stepsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

stepEls.forEach(step => stepsObserver.observe(step));
/* =========================================
   SLOW & PREMIUM SMOOTH SCROLL (CUSTOM)
========================================= */
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault(); // Default fast jump ko rokne ke liye
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      // Navbar ki height (80px) minus kar rahe hain taaki section header hide na ho jaye
      const offset = 80;
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      
      // Scroll ka time: 1200ms = 1.2 seconds. (Isko 1500 karoge toh aur slow ho jayega)
      const duration = 1500; 
      let start = null;

      // Easing math: Dheere se start -> flow -> Dheere se stop
      function easeInOutQuart(time, begin, change, duration) {
        if ((time /= duration / 2) < 1) return change / 2 * time * time * time * time + begin;
        return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
      }

      // Animation frame loop
      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const scrollY = easeInOutQuart(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, scrollY);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Animation complete hone par ekdum perfect position set karna
          window.scrollTo(0, targetPosition);
        }
      }

      requestAnimationFrame(animation);
    }
  });
});

/* =========================================
   ZEN ORB SCROLL TRACKER
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const featCards = document.querySelectorAll('.feat-scroll-card');
  const tSteps = document.querySelectorAll('.t-step');
  const zenOrb = document.getElementById('zenOrb');

  if (featCards.length > 0 && zenOrb && tSteps.length > 0) {
    
    // Intersection Observer jo check karega screen par kya dikh raha hai
    const orbObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          
          // Pata lagao konsa card screen par hai
          const index = Array.from(featCards).indexOf(entry.target);
          
          // 1. Sabse pehle saare text ko wapas grey karo
          tSteps.forEach(step => step.classList.remove('active'));
          
          // 2. Jo card screen par hai, uske text ko dark (active) karo
          if (tSteps[index]) {
            tSteps[index].classList.add('active');
            
            // 3. Orb ko us active text ke saamne slide karke le jao
            // offsetTop se pata chalta hai ki text upar se kitna door hai
            const textPosition = tSteps[index].offsetTop;
            zenOrb.style.top = (textPosition + 4) + 'px'; 
          }
        }
      });
    }, { 
      // Ye margin batata hai ki card screen ke mid mein aane par hi trigger ho
      rootMargin: '-30% 0px -50% 0px' 
    });

    // Har card ko observe karna shuru karo
    featCards.forEach(card => orbObserver.observe(card));
  }
});

/* =========================================
   DROPZONE UPLOAD LOGIC
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');

  if (dropzone && fileInput) {
    // 1. Click on Dropzone -> Open File Picker
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    // 2. Drag & Drop Visual Effects
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    // 3. Handle File Selection via button/click
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });

    // Main Function to handle what happens next
    function handleFileSelect(file) {
      console.log("File selected:", file.name);
      alert(`Awesome! You selected: ${file.name}\n\n(In a real app, this would start uploading now.)`);
      // Future me hum yahan loading animation trigger kar sakte hain
    }
  }
});

/* =========================================
   FAQ ACCORDION
========================================= */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

/* =========================================
   SMART GLOSSARY: SEARCH + FILTERS + FORM
========================================= */
const glossarySearch = document.getElementById('glossarySearch');
const filterBtns = document.querySelectorAll('.filter-btn');
const glossaryCards = document.querySelectorAll('.glossary-card:not(.missing-term-card)'); // Ignore form card in search
const missingCard = document.querySelector('.missing-term-card');
const glossaryEmpty = document.getElementById('glossaryEmpty');

let currentFilter = 'all';
let currentSearch = '';

// Main function jo dono search aur filter ko combine karegi
function runGlossaryMagic() {
  let found = false;

  glossaryCards.forEach(card => {
    const term = card.querySelector('h4').textContent.toLowerCase();
    const category = card.getAttribute('data-category');

    const matchesSearch = term.includes(currentSearch);
    const matchesFilter = (currentFilter === 'all') || (category === currentFilter);

    if (matchesSearch && matchesFilter) {
      card.style.display = 'block';
      setTimeout(() => card.style.opacity = '1', 10);
      found = true;
    } else {
      card.style.opacity = '0';
      setTimeout(() => card.style.display = 'none', 200);
    }
  });

  // Empty state handling
  if (!found && currentSearch !== '') {
    glossaryEmpty.style.display = 'block';
  } else {
    glossaryEmpty.style.display = 'none';
  }
}

// 1. Search Bar Listener
if (glossarySearch) {
  glossarySearch.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    runGlossaryMagic();
  });
}

// 2. Filter Buttons Listener
if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Button ka color change karne ke liye active class update
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      // Naya filter set karo aur magic run karo
      currentFilter = e.target.getAttribute('data-filter');
      runGlossaryMagic();
    });
  });
}

// 3. Missing Term Form Logic
const missingBtn = document.getElementById('missingTermBtn');
const missingInput = document.getElementById('missingTermInput');
const missingSuccess = document.getElementById('missingSuccess');

if (missingBtn) {
  missingBtn.addEventListener('click', () => {
    if (missingInput.value.trim() !== "") {
      // Fake submission effect
      missingSuccess.style.display = "block";
      missingInput.value = "";
      
      // 3 second baad success message hata do
      setTimeout(() => {
        missingSuccess.style.display = "none";
      }, 3000);
    }
  });
}

/* =========================================
   ABOUT SECTION SCROLL REVEAL
========================================= */
const revealElements = document.querySelectorAll(".reveal-up");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Run animation only once
      }
    });
  },
  { threshold: 0.15 } // Trigger when 15% visible
);

revealElements.forEach((el) => revealObserver.observe(el));

/* =========================================
   PREMIUM MOBILE MENU
========================================= */

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".menu-overlay");
const closeBtn = document.querySelector(".close-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

/* Open Menu */

function openMenu() {

    mobileMenu.classList.add("open");
    overlay.classList.add("show");

    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";

}

/* Close Menu */

function closeMenu() {

    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");

    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";

}

/* Events */

if (hamburger) {

    hamburger.addEventListener("click", openMenu);

}

if (closeBtn) {

    closeBtn.addEventListener("click", closeMenu);

}

if (overlay) {

    overlay.addEventListener("click", closeMenu);

}

/* Close after clicking link */

mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        closeMenu();

    });

});

/* ESC key */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeMenu();

    }

});

