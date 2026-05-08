(function() {
    const heroBlock = document.getElementById('heroAnimation');
    const animatedContainer = document.getElementById('animatedContainer');
    const orlovContainer = document.getElementById('orlovContainer');
    const aPlaceholder = document.getElementById('aPlaceholder');
    const letterAnchor = document.getElementById('letterAnchor');
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    
    let animationId = null;
    let trailPoints = [];
    let currentX = 0;
    let currentY = 0;
    let prevX = 0;
    let prevY = 0;
    let starInterval = null;
    let isMoving = true;
    
    const word = ['O', 'r', 'l', 'o', 'v'];
    
    function buildOrlovLetters() {
        orlovContainer.innerHTML = '';
        word.forEach((letter) => {
            const span = document.createElement('span');
            span.className = 'letter-item';
            span.textContent = letter;
            orlovContainer.appendChild(span);
        });
    }
    
    function resizeAndPositionCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
    
    function drawStar(x, y, size, opacity) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        let rotation = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        for (let i = 0; i < spikes; i++) {
            const x1 = x + Math.cos(rotation) * outerRadius;
            const y1 = y + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x1, y1);
            rotation += step;
            
            const x2 = x + Math.cos(rotation) * innerRadius;
            const y2 = y + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x2, y2);
            rotation += step;
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    function drawTrail() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < trailPoints.length - 1; i++) {
            const p1 = trailPoints[i];
            const p2 = trailPoints[i + 1];
            const alpha = Math.pow(p1.life, 0.8) * 0.4;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            p1.life -= 0.025;
        }
        
        trailPoints = trailPoints.filter(point => point.life > 0);
        
        if (isMoving && currentX && currentY) {
            const glowOpacity = 0.7 + Math.sin(Date.now() * 0.015) * 0.2;
            drawStar(currentX, currentY, 10, glowOpacity);
            
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
            drawStar(currentX, currentY, 10, 0.9);
            ctx.shadowBlur = 0;
        }
        
        animationId = requestAnimationFrame(drawTrail);
    }
    
    function startStarTrail(centerX, centerY) {
        let currentAngle = 0;
        const starRadius = 180;
        isMoving = true;
        trailPoints = [];
        
        const duration = 2000;
        const start = Date.now();
        
        starInterval = setInterval(() => {
            if (!isMoving) return;
            
            const elapsed = Date.now() - start;
            currentAngle = (elapsed / duration) * Math.PI * 2;
            
            currentX = centerX + Math.cos(currentAngle) * starRadius;
            currentY = centerY + Math.sin(currentAngle) * starRadius;
            
            if (prevX && prevY) {
                trailPoints.push({
                    x: currentX,
                    y: currentY,
                    life: 0.6
                });
            }
            
            prevX = currentX;
            prevY = currentY;
            
            if (currentAngle >= Math.PI * 2) {
                isMoving = false;
                clearInterval(starInterval);
                starInterval = null;
            }
        }, 16);
    }
    
    function revealOrlovSequentially() {
      const letterItems = document.querySelectorAll('.letter-item');
      letterItems.forEach((item, index) => {
          setTimeout(() => {
              item.classList.add('visible');
          }, index * 80);
      });
      
      setTimeout(() => {
          const headerLine = document.getElementById('headerLine');
          if (headerLine) {
              headerLine.classList.add('visible');
          }
          
          setTimeout(() => {
              const scrollIndicator = document.getElementById('scrollIndicator');
              const siteContent = document.getElementById('siteContent');
              
              if (scrollIndicator) {
                  scrollIndicator.style.display = 'block';
                  setTimeout(() => {
                      scrollIndicator.classList.add('visible');
                  }, 10);
              }
              
              let animationTriggered = false;
              
              const startAnimation = () => {
                  if (animationTriggered) return;
                  animationTriggered = true;
                  
                  const scrollIndicator = document.getElementById('scrollIndicator');
                  const headerLine = document.getElementById('headerLine');
                  const siteContent = document.getElementById('siteContent');
                  
                  if (scrollIndicator) {
                      scrollIndicator.style.transition = 'transform 0.6s ease-out, opacity 0.4s ease-out';
                      scrollIndicator.style.transform = 'translateX(-50%) translateY(-800px)';
                      scrollIndicator.style.opacity = '0';
                      setTimeout(() => {
                          scrollIndicator.style.display = 'none';
                      }, 600);
                  }
                  
                  if (headerLine) {
                      headerLine.style.transition = 'transform 0.6s ease-out, opacity 0.4s ease-out';
                      headerLine.style.transform = 'translateY(-200px)';
                      headerLine.style.opacity = '0';
                  }
                  
                  if (siteContent) {
                      siteContent.classList.add('visible');
                  }
                  
                  window.removeEventListener('wheel', startAnimation);
                  window.removeEventListener('touchstart', startAnimation);
                  window.removeEventListener('keydown', startAnimation);
              };
              
              window.addEventListener('wheel', startAnimation);
              window.addEventListener('touchstart', startAnimation);
              window.addEventListener('keydown', startAnimation);
              
          }, 800);
      }, (letterItems.length - 1) * 80 + 100);
    }
    
    buildOrlovLetters();
    resizeAndPositionCanvas();
    window.addEventListener('resize', resizeAndPositionCanvas);
    drawTrail();
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const bigA = document.querySelector('.big-a');
    
    bigA.style.transformOrigin = 'center center';
    bigA.style.animation = 'appearAndGrow 1.5s ease-out forwards';
    startStarTrail(centerX, centerY);
    
    setTimeout(() => {
        const anchorRect = letterAnchor.getBoundingClientRect();
        const bigARect = bigA.getBoundingClientRect();
        
        const deltaX = anchorRect.left + anchorRect.width / 2 - (bigARect.left + bigARect.width / 2);
        const deltaY = anchorRect.top + anchorRect.height / 2 - (bigARect.top + bigARect.height / 2);
        
        setTimeout(() => {
            bigA.style.animation = `flyToPlaceholder 1.5s cubic-bezier(0.4, 0.2, 0.2, 1) forwards`;
            bigA.style.setProperty('--delta-x', `${deltaX}px`);
            bigA.style.setProperty('--delta-y', `${deltaY}px`);
            
            setTimeout(() => {
                heroBlock.style.display = 'none';
                aPlaceholder.innerHTML = '<div class="big-a-fixed">A</div>';
                revealOrlovSequentially();
            }, 1500);
        }, 500);
    }, 1500);
})();

window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

let currentSlide = 1;
let isArrowAnimationDone = false;
const siteContent = document.getElementById('siteContent');
const scrollIndicator = document.getElementById('scrollIndicator');
const headerLine = document.getElementById('headerLine');

siteContent.classList.add('slide-1');

function hideArrowAndLine() {
    if (isArrowAnimationDone) return;
    isArrowAnimationDone = true;
    
    if (scrollIndicator) {
        scrollIndicator.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(-800px)';
        scrollIndicator.style.opacity = '0';
        setTimeout(() => {
            scrollIndicator.style.display = 'none';
        }, 500);
    }
    
    if (headerLine) {
        headerLine.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
        headerLine.style.transform = 'translateY(-200px)';
        headerLine.style.opacity = '0';
    }
}

function goToNextSlide() {
    if (currentSlide === 1) {
        siteContent.classList.remove('slide-1');
        siteContent.classList.add('slide-2');
        currentSlide = 2;
    } else if (currentSlide === 2) {
        siteContent.classList.remove('slide-2');
        siteContent.classList.add('slide-3');
        currentSlide = 3;
    }
}

function goToPrevSlide() {
    if (currentSlide === 3) {
        siteContent.classList.remove('slide-3');
        siteContent.classList.add('slide-2');
        currentSlide = 2;
    } else if (currentSlide === 2) {
        siteContent.classList.remove('slide-2');
        siteContent.classList.add('slide-1');
        currentSlide = 1;
    }
}

let scrollLock = false;
let firstScrollDone = false;

window.addEventListener('wheel', (e) => {
    if (scrollLock) return;
    
    if (!firstScrollDone) {
        firstScrollDone = true;
        hideArrowAndLine();
        setTimeout(() => {
            siteContent.classList.add('visible');
        }, 100);
        return;
    }
    
    if (e.deltaY > 0 && currentSlide < 3) {
        scrollLock = true;
        goToNextSlide();
        setTimeout(() => { scrollLock = false; }, 600);
    } else if (e.deltaY < 0 && currentSlide > 1) {
        scrollLock = true;
        goToPrevSlide();
        setTimeout(() => { scrollLock = false; }, 600);
    }
});

let fullpageApi = null;

function initFullpage() {
    if (fullpageApi) {
        fullpageApi.destroy('all');
    }
    
    fullpageApi = new fullpage('#fullpage', {
        anchors: ['about', 'skills', 'work', 'contacts'],
        navigationTooltips: ['Обо мне', 'Навыки', 'Работы', 'Контакты'],
        navigation: true,
        slidesNavigation: true,
        controlArrows: true,
        licenseKey: 'YOUR_KEY_HERE'
    });
}

function updateFullpage() {
    if (fullpageApi) {
        fullpageApi.reBuild();
        setTimeout(() => {
            if (fullpageApi) fullpageApi.reBuild();
        }, 100);
    }
}

document.getElementById('waveBtn').onclick = function() {
    const wave = document.getElementById('wave1');
    const body = document.body;
    
    wave.classList.remove('play');
    void wave.offsetWidth;
    wave.classList.add('play');
    
    body.classList.add('wave-active');
    
    const siteContentElem = document.getElementById('siteContent');
    if (siteContentElem) {
        siteContentElem.style.transition = 'opacity 0.4s ease';
        siteContentElem.style.opacity = '0';
        setTimeout(() => {
            siteContentElem.style.display = 'none';
        }, 400);
    }
    
    const aPlaceholderElem = document.getElementById('aPlaceholder');
    const orlovContainerElem = document.getElementById('orlovContainer');
    
    if (aPlaceholderElem) {
        const aElement = aPlaceholderElem.querySelector('.big-a-fixed');
        if (aElement) {
            aElement.style.color = '#4285f4';
        }
    }
    
    if (orlovContainerElem) {
        const letters = orlovContainerElem.querySelectorAll('.letter-item');
        letters.forEach((letter) => {
            letter.style.color = '#4285f4';
        });
    }
    
    const headerMenu = document.querySelector('.header__menu');
    if (headerMenu) {
        headerMenu.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        headerMenu.style.transform = 'translateY(0)';
    }
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
        
        setTimeout(() => {
            initFullpage();
            setTimeout(() => {
                mainContent.classList.add('visible');
                setTimeout(() => {
                    updateFullpage();
                }, 100);
            }, 50);
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.header__item');
    const sectionsMap = {
        'Обо мне': 0,
        'Навыки': 1,
        'Работы': 2,
        'Контакты': 3
    };
    
    menuItems.forEach((item) => {
        item.addEventListener('click', () => {
            const text = item.textContent.trim();
            const sectionIndex = sectionsMap[text];
            
            if (sectionIndex !== undefined && fullpageApi) {
                fullpageApi.moveTo(sectionIndex + 1);
            }
        });
    });
});

window.addEventListener('resize', () => {
    if (fullpageApi && document.querySelector('.main-content').style.display !== 'none') {
        setTimeout(() => {
            updateFullpage();
        }, 200);
    }
});