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