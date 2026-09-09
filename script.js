// SCRIPT LOGIC FOR ROMANTIC PROPOSAL WEB APP

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initDodgingButton();
    initCelebrationModal();
    initMusicPlayer();
    initVideoCheck();
    initReasonsCards();
    initPhotoLightbox();
    initVideoSwitcher();
});

/* ==========================================
   1. CANVAS FLOATING HEARTS & PARTICLES
   ========================================== */
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    class HeartParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 14 + 8;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.color = Math.random() > 0.4 ? '#ff2a85' : '#ff758c';
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            // Draw Heart Shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
            ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new HeartParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================
   2. PLAYFUL DODGING "NO" BUTTON MECHANIC
   ========================================== */
function initDodgingButton() {
    const noBtn = document.getElementById('noBtn');
    const buttonArea = document.getElementById('buttonArea');
    if (!noBtn || !buttonArea) return;

    const phrases = [
        "Nice try! 😜",
        "You can't say no to me! 💖",
        "Wrong button! Try YES ✨",
        "No isn't an option! 😉",
        "Are you sure? Try again! 💕",
        "Oops, missed me! 😂"
    ];

    let dodgeCount = 0;

    function moveNoButton() {
        const areaRect = buttonArea.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        // Calculate max allowed offsets within window boundaries
        const maxX = window.innerWidth - btnRect.width - 40;
        const maxY = window.innerHeight - btnRect.height - 40;

        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.zIndex = '999';

        // Spawn a funny toast message
        showDodgeToast(randomX, randomY, phrases[dodgeCount % phrases.length]);
        dodgeCount++;
    }

    // Move on mouseover / hover
    noBtn.addEventListener('mouseover', moveNoButton);
    // Move on touch start for mobile users
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    function showDodgeToast(x, y, text) {
        const toast = document.createElement('div');
        toast.className = 'dodge-toast';
        toast.innerText = text;
        toast.style.left = `${x}px`;
        toast.style.top = `${y - 35}px`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 1000);
    }
}

/* ==========================================
   3. CELEBRATION MODAL & FIREWORKS ON YES
   ========================================== */
function initCelebrationModal() {
    const yesBtn = document.getElementById('yesBtn');
    const modal = document.getElementById('celebrationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const replayBtn = document.getElementById('replayEffectsBtn');
    const certDateText = document.getElementById('certDateText');

    // Real Coded Love.css & Flower elements
    const compilerBox = document.getElementById('compilerBox');
    const compilerFill = document.getElementById('compilerFill');
    const compilerStatus = document.getElementById('compilerStatus');
    const bloomTriggerBtn = document.getElementById('bloomTriggerBtn');
    const flowerBloomStage = document.getElementById('flowerBloomStage');
    const reBloomBtn = document.getElementById('reBloomBtn');

    let bloomTimeout = null;

    if (!yesBtn || !modal) return;

    function startDigitalBloom() {
        if (!compilerBox || !flowerBloomStage) return;

        // Reset to compiler state
        clearTimeout(bloomTimeout);
        flowerBloomStage.classList.remove('active');
        compilerBox.style.display = 'flex';
        compilerBox.style.opacity = '1';
        compilerBox.style.transform = 'scale(1)';
        if (compilerFill) compilerFill.style.width = '0%';
        if (compilerStatus) compilerStatus.innerText = 'Growing digital petals...';

        // Animate compiler progress bar
        setTimeout(() => {
            if (compilerFill) compilerFill.style.width = '100%';
        }, 100);

        setTimeout(() => {
            if (compilerStatus) compilerStatus.innerText = 'Petals compiled! Ready to bloom ✨';
        }, 1300);

        // Auto bloom after progress
        bloomTimeout = setTimeout(() => {
            executeBloom();
        }, 1800);
    }

    function executeBloom() {
        clearTimeout(bloomTimeout);
        if (!compilerBox || !flowerBloomStage) return;

        compilerBox.style.opacity = '0';
        compilerBox.style.transform = 'scale(0.85)';

        setTimeout(() => {
            compilerBox.style.display = 'none';
            flowerBloomStage.classList.add('active');
            spawnHeartBurst();
        }, 400);
    }

    if (bloomTriggerBtn) {
        bloomTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            executeBloom();
        });
    }

    if (reBloomBtn) {
        reBloomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            flowerBloomStage.classList.remove('active');
            setTimeout(() => {
                flowerBloomStage.classList.add('active');
                spawnHeartBurst();
            }, 100);
        });
    }

    yesBtn.addEventListener('click', () => {
        // Set date string
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (certDateText) {
            certDateText.innerText = `Granted on: ${new Date().toLocaleDateString(undefined, options)}`;
        }

        // Show Modal
        modal.classList.add('active');

        // Start Coded Flower Animation
        startDigitalBloom();

        // Launch Fireworks & Confetti & Hearts
        launchFireworks();
    });

    function closeModal() {
        modal.classList.remove('active');
        clearTimeout(bloomTimeout);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close when clicking modal backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            launchFireworks();
            if (flowerBloomStage && flowerBloomStage.classList.contains('active')) {
                flowerBloomStage.classList.remove('active');
                setTimeout(() => {
                    flowerBloomStage.classList.add('active');
                }, 100);
            }
        });
    }
}

// Confetti, Hearts & Fireworks FX
function launchFireworks() {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        spawnConfettiBurst();
        spawnHeartBurst();
    }, 220);
}

function spawnHeartBurst() {
    const emojis = ['💖', '💕', '✨', '💍', '🥰', '💐'];
    for (let i = 0; i < 4; i++) {
        const heart = document.createElement('div');
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.position = 'fixed';
        heart.style.left = `${Math.random() * 90 + 5}vw`;
        heart.style.bottom = `-20px`;
        heart.style.fontSize = `${Math.random() * 18 + 18}px`;
        heart.style.zIndex = '10001';
        heart.style.pointerEvents = 'none';
        heart.style.filter = 'drop-shadow(0 0 8px rgba(255, 42, 133, 0.8))';

        const duration = Math.random() * 2 + 2;
        heart.style.transition = `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}s ease-out`;

        document.body.appendChild(heart);

        const driftX = (Math.random() - 0.5) * 120;
        setTimeout(() => {
            heart.style.transform = `translate(${driftX}px, -105vh) scale(${Math.random() * 0.5 + 0.8})`;
            heart.style.opacity = '0';
        }, 20);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }
}

function spawnConfettiBurst() {
    const colors = ['#ff2a85', '#ffd700', '#00f3ff', '#a855f7', '#ffffff', '#ff758c'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `-20px`;
        confetti.style.width = `${Math.random() * 10 + 6}px`;
        confetti.style.height = `${Math.random() * 14 + 8}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '3px';
        confetti.style.zIndex = '10000';
        confetti.style.pointerEvents = 'none';

        const fallDuration = Math.random() * 2.5 + 2;
        confetti.style.transition = `transform ${fallDuration}s linear, opacity ${fallDuration}s ease-out`;

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.transform = `translateY(105vh) rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 20);

        setTimeout(() => {
            confetti.remove();
        }, fallDuration * 1000);
    }
}

/* ==========================================
   4. BACKGROUND MUSIC / AUDIO SYNTHESIZER
   ========================================== */
function initMusicPlayer() {
    const musicBtn = document.getElementById('musicToggleBtn');
    const statusText = document.getElementById('musicStatusText');
    const bgAudio = document.getElementById('bgAudio');

    let isPlaying = false;
    let audioCtx = null;
    let synthInterval = null;

    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            // Try playing HTML5 Audio element
            bgAudio.play().then(() => {
                isPlaying = true;
                if (statusText) statusText.innerText = 'Pause "Saajna" 🎶';
            }).catch(() => {
                // Fallback to synthesized ambient music via Web Audio API if file isn't uploaded yet
                playSynthMusic();
                isPlaying = true;
                if (statusText) statusText.innerText = 'Pause "Saajna" 🎶';
            });
        } else {
            bgAudio.pause();
            if (audioCtx) {
                audioCtx.close();
                clearInterval(synthInterval);
                audioCtx = null;
            }
            isPlaying = false;
            if (statusText) statusText.innerText = 'Play "Saajna" by Darshan Raval';
        }
    });

    // Web Audio API Synthesizer Fallback
    function playSynthMusic() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23]; // Soft romantic arpeggios (C, E, G, C, A, F)
        let index = 0;

        synthInterval = setInterval(() => {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(notes[index % notes.length], audioCtx.currentTime);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 1.8);

            index++;
        }, 800);
    }
}

/* ==========================================
   5. VIDEO PLACEHOLDER CHECK
   ========================================== */
function initVideoCheck() {
    const video = document.getElementById('proposalVideo');
    const placeholder = document.getElementById('videoPlaceholder');

    if (!video || !placeholder) return;

    video.addEventListener('loadeddata', () => {
        placeholder.style.display = 'none';
    });

    video.addEventListener('play', () => {
        placeholder.style.display = 'none';
    });
}

/* ==========================================
   6. REASONS CARD FLIP FOR MOBILE TOUCH
   ========================================== */
function initReasonsCards() {
    const cards = document.querySelectorAll('.reason-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

/* ==========================================
   7. PHOTO GALLERY LIGHTBOX
   ========================================== */
function initPhotoLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('closeLightboxBtn');
    const prevBtn = document.getElementById('prevLightboxBtn');
    const nextBtn = document.getElementById('nextLightboxBtn');
    const cards = Array.from(document.querySelectorAll('.memory-card'));

    if (!lightbox || !lightboxImg || cards.length === 0) return;

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = (index + cards.length) % cards.length;
        const card = cards[currentIndex];
        const img = card.querySelector('img');
        const caption = card.getAttribute('data-caption') || 'Our Memory 💖';

        lightboxImg.src = img.src;
        lightboxImg.alt = caption;
        if (lightboxCaption) lightboxCaption.innerText = caption;
        if (lightboxCounter) lightboxCounter.innerText = `${currentIndex + 1} / ${cards.length}`;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            openLightbox(idx);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => openLightbox(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => openLightbox(currentIndex + 1));

    // Backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });
}

/* ==========================================
   8. VIDEO SWITCHER
   ========================================== */
function initVideoSwitcher() {
    const video = document.getElementById('proposalVideo');
    const pills = document.querySelectorAll('.video-pill');

    if (!video || pills.length === 0) return;

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const src = pill.getAttribute('data-src');
            if (src) {
                video.src = src;
                video.load();
                video.play().catch(() => {});
            }
        });
    });
}
