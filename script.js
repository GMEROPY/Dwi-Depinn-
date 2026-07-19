/* =========================================================
   PORTFOLIO — script.js
   Logic: typing animation, filter kategori, render grid (link ke
   halaman detail statis project/*.html), lightbox testimoni,
   lazy load, scroll reveal, dan handler tombol Order per project.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================
     0. CACHE-BUSTING GAMBAR/VIDEO
     Browser sering menyimpan cache gambar lama, jadi kalau kamu
     ganti file foto/video dengan nama yang SAMA tapi isinya beda,
     kadang yang tampil masih versi lama.
     -> KALAU INI TERJADI: cukup naikkan angka ASSET_VERSION di
        bawah ini (misal dari '2' ke '3'), lalu save. Itu saja,
        tidak perlu ubah kode lain.
     Catatan: kalau yang kamu edit itu file style.css atau script.js
     sendiri (bukan cuma foto/video), naikkan juga angka "?v=" di
     tag <link> dan <script> pada index.html DAN semua file di
     folder project/*.html (contoh: style.css?v=2 -> style.css?v=3).
     ======================================================= */
  const ASSET_VERSION = '2';
  function withVersion(url) {
    if (!url) return url;
    return url + (url.includes('?') ? '&' : '?') + 'v=' + ASSET_VERSION;
  }

  // Terapkan ke poster & source video di halaman detail project (jika ada)
  document.querySelectorAll('.detail-media video').forEach((video) => {
    if (video.poster) video.poster = withVersion(video.poster);
    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.dataset.src = withVersion(source.dataset.src);
    });
  });

  // Terapkan ke gambar detail project (bukan portfolio grid)
  document.querySelectorAll('.detail-media img').forEach((img) => {
    img.src = withVersion(img.src);
  });

  // Terapkan ke foto profil di hero
  const profilePhoto = document.querySelector('.profile-photo');
  if (profilePhoto) profilePhoto.src = withVersion(profilePhoto.src);

  /* =======================================================
     0b. HERO STARS — generate partikel bintang random
     ======================================================= */
  const starsContainer = document.getElementById('hero-stars');
  if (starsContainer) {
    const totalStars = 45;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement('span');
      star.className = 'hero-star';
      const size = (Math.random() * 2 + 1).toFixed(1);
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.top = (Math.random() * 100).toFixed(2) + '%';
      star.style.left = (Math.random() * 100).toFixed(2) + '%';
      star.style.setProperty('--min-o', (Math.random() * 0.2 + 0.1).toFixed(2));
      star.style.setProperty('--max-o', (Math.random() * 0.4 + 0.6).toFixed(2));
      star.style.animationDuration = (Math.random() * 2.5 + 2).toFixed(2) + 's';
      star.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment);
  }

  /* =======================================================
     1. DATA PORTFOLIO (preview di homepage)
     -> Untuk tambah/edit project baru, tambahkan object di sini
        DAN buat file HTML baru di folder project/ (copy salah satu
        file yang sudah ada sebagai template).
     ======================================================= */
  const portfolioData = [
    {
        "slug": "poster-001",
        "code": "PS-001",
        "category": "design",
        "title": "Poster Konser",
        "thumbnail": "assets/images/design1.jpg",
        "type": "image",
        "detail": "project/poster-001.html"
    },
    {
        "slug": "feed-001",
        "code": "FD-001",
        "category": "design",
        "title": "Feed Instagram",
        "thumbnail": "assets/images/design2.jpg",
        "type": "image",
        "detail": "project/feed-001.html"
    },
    {
        "slug": "logo-001",
        "code": "LG-001",
        "category": "design",
        "title": "GFX Poster Anime",
        "thumbnail": "assets/images/design3.jpg",
        "type": "image",
        "detail": "project/logo-001.html"
    },
    {
        "slug": "banner-001",
        "code": "BN-001",
        "category": "design",
        "title": "Banner Promo",
        "thumbnail": "assets/images/design4.jpg",
        "type": "image",
        "detail": "project/banner-001.html"
    },
    {
        "slug": "cover-001",
        "code": "CV-001",
        "category": "design",
        "title": "Cover Album",
        "thumbnail": "assets/images/design5.jpg",
        "type": "image",
        "detail": "project/cover-001.html"
    },
    {
        "slug": "ui-001",
        "code": "UI-001",
        "category": "design",
        "title": "UI Mobile App",
        "thumbnail": "assets/images/design6.jpg",
        "type": "image",
        "detail": "project/ui-001.html"
    },
    {
        "slug": "video-001",
        "code": "VD-001",
        "category": "editing",
        "title": "Cinematic Edit",
        "thumbnail": "assets/images/edit1.jpg",
        "type": "video",
        "detail": "project/video-001.html"
    },
    {
        "slug": "video-002",
        "code": "VD-002",
        "category": "editing",
        "title": "Reels Promo",
        "thumbnail": "assets/images/edit2.jpg",
        "type": "video",
        "detail": "project/video-002.html"
    },
    {
        "slug": "video-003",
        "code": "VD-003",
        "category": "editing",
        "title": "Wedding Highlight",
        "thumbnail": "assets/images/edit3.jpg",
        "type": "video",
        "detail": "project/video-003.html"
    },
    {
        "slug": "video-004",
        "code": "VD-004",
        "category": "editing",
        "title": "Motion Graphic",
        "thumbnail": "assets/images/edit4.jpg",
        "type": "video",
        "detail": "project/video-004.html"
    }
];

  /* Data testimoni — tinggal tambah/ubah object di sini kalau mau ganti isi pesan */
  const testimonialData = [
    {
        "id": "t1",
        "name": "Kak Rina",
        "message": "Hasil desainnya rapi banget dan sesuai request, revisinya juga cepat. Puas banget order di sini!",
        "time": "09.41"
    },
    {
        "id": "t2",
        "name": "Bang Yoga",
        "message": "Editing videonya smooth, transisinya enak dilihat. Recommended buat yang butuh editor cepat & niat.",
        "time": "14.02"
    },
    {
        "id": "t3",
        "name": "Sarah W.",
        "message": "Komunikasinya enak, hasil akhirnya melebihi ekspektasi. Pasti order lagi kalau butuh desain.",
        "time": "20.15"
    },
    {
        "id": "t4",
        "name": "Kevin S.",
        "message": "Harga bersahabat tapi kualitas gak main-main. Sat set, cepat selesai. Makasih banyak!",
        "time": "11.30"
    }
];

  /* =======================================================
     2. TYPING ANIMATION (Design / Editor)
     ======================================================= */
  const typingWords = ['Design', 'Editor'];
  const typingEl = document.getElementById('typing-text');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentWord = typingWords[wordIndex];
    if (isDeleting) { charIndex--; } else { charIndex++; }
    typingEl.textContent = currentWord.substring(0, charIndex);

    let speed = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      speed = 300;
    }

    setTimeout(typeLoop, speed);
  }

  if (typingEl) typeLoop();

  /* =======================================================
     3. RENDER PORTFOLIO GRID (preview only, link ke halaman detail)
     ======================================================= */
  const portfolioGrid = document.getElementById('portfolio-grid');

  function createPortfolioCard(item, index) {
    const card = document.createElement('a');
    card.className = 'portfolio-card loading reveal';
    card.style.transitionDelay = Math.min(index * 0.08, 0.48) + 's';
    card.dataset.category = item.category;
    card.href = item.detail; // buka halaman baru, BUKAN modal
    card.setAttribute('aria-label', item.title);

    const img = document.createElement('img');
    img.dataset.src = withVersion(item.thumbnail); // lazy load pakai data-src
    img.alt = item.title;
    img.loading = 'lazy';
    img.decoding = 'async';
    card.appendChild(img);

    if (item.type === 'video') {
      const playIcon = document.createElement('div');
      playIcon.className = 'card-play-icon';
      playIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>`;
      card.appendChild(playIcon);
    }

    return card;
  }

  function renderPortfolio() {
    const fragment = document.createDocumentFragment();
    portfolioData.forEach((item, index) => fragment.appendChild(createPortfolioCard(item, index)));
    portfolioGrid.appendChild(fragment);
    initLazyLoad();
  }

  if (portfolioGrid) renderPortfolio();

  /* =======================================================
     4. CATEGORY FILTER (pill button + fade animation)
     ======================================================= */
  const pillButtons = document.querySelectorAll('.pill-btn');

  let isFiltering = false; // cegah klik bertumpuk saat animasi masih berjalan

  pillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isFiltering) return;
      const filter = btn.dataset.filter;

      pillButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      isFiltering = true;
      const cards = Array.from(portfolioGrid.querySelectorAll('.portfolio-card'));

      // Tahap 1: fade + scale-out semua kartu yang tidak cocok dulu
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (!match && !card.classList.contains('card-hidden')) {
          card.classList.add('card-fade-out');
        }
      });

      // Tahap 2: setelah fade-out selesai, keluarkan dari grid lalu
      // fade + scale-in kartu yang cocok secara bertahap (stagger)
      setTimeout(() => {
        let visibleIndex = 0;
        cards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            const wasHidden = card.classList.contains('card-hidden');
            card.classList.remove('card-hidden', 'card-fade-out');
            if (wasHidden) {
              card.style.animationDelay = `${visibleIndex * 45}ms`;
              card.classList.remove('card-fade-in');
              void card.offsetWidth; // reset animasi supaya bisa diputar ulang
              card.classList.add('card-fade-in');
            }
            visibleIndex++;
          } else {
            card.classList.add('card-hidden');
            card.classList.remove('card-fade-out', 'card-fade-in');
          }
        });
        isFiltering = false;
      }, 320);
    });
  });

  /* =======================================================
     5. TESTIMONIAL GRID + LIGHTBOX
     ======================================================= */
  const testimonialGrid = document.getElementById('testimonial-grid');

  function renderTestimonials() {
    const fragment = document.createDocumentFragment();

    testimonialData.forEach((t, index) => {
      const item = document.createElement('div');
      item.className = 'testimonial-item reveal';
      item.style.transitionDelay = Math.min(index * 0.12, 0.48) + 's';

      const name = document.createElement('p');
      name.className = 'testimonial-name';
      name.textContent = t.name;

      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble';

      const msg = document.createElement('p');
      msg.className = 'chat-bubble-text';
      msg.textContent = t.message;
      bubble.appendChild(msg);

      const meta = document.createElement('span');
      meta.className = 'chat-bubble-meta';
      meta.innerHTML = `${t.time} <svg viewBox="0 0 16 15" width="15" height="15" fill="#53bdeb"><path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.202-7.995a.36.36 0 00-.064-.51zm-4.1 0l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.202-7.995a.36.36 0 00-.064-.51z"/></svg>`;
      bubble.appendChild(meta);

      item.appendChild(name);
      item.appendChild(bubble);
      fragment.appendChild(item);
    });

    testimonialGrid.appendChild(fragment);
  }

  if (testimonialGrid) renderTestimonials();

  /* =======================================================
     6. LAZY LOAD IMAGES (IntersectionObserver)
     ======================================================= */
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => {
            const card = img.closest('.portfolio-card');
            if (card) card.classList.remove('loading');
          });
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.01 });

    lazyImages.forEach((img) => observer.observe(img));
  }

  /* =======================================================
     7. LAZY LOAD VIDEO (halaman detail project)
     Video baru dimuat saat elemen masuk viewport, supaya
     halaman tetap ringan saat pertama dibuka.
     ======================================================= */
  const lazyVideos = document.querySelectorAll('video[data-src]');
  if (lazyVideos.length) {
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            const source = video.querySelector('source[data-src]');
            if (source) {
              source.src = source.dataset.src;
              source.removeAttribute('data-src');
              video.load();
            }
            obs.unobserve(video);
          }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      lazyVideos.forEach((v) => videoObserver.observe(v));
    } else {
      lazyVideos.forEach((video) => {
        const source = video.querySelector('source[data-src]');
        if (source) {
          source.src = source.dataset.src;
          video.load();
        }
      });
    }
  }

  /* =======================================================
     8. SCROLL REVEAL ANIMATION (fade + slide up saat scroll)
     ======================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* =======================================================
     9. SMOOTH SCROLL UNTUK LINK INTERNAL (anchor #id)
     ======================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* =======================================================
     10. TOMBOL "ORDER SEKARANG" DI HALAMAN DETAIL PROJECT
     Membuka WhatsApp otomatis dengan pesan berisi kode project,
     nama project, dan link project (URL halaman saat ini).
     ======================================================= */
  const orderBtn = document.getElementById('detail-order-btn');
  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = orderBtn.dataset.code;
      const name = orderBtn.dataset.name;
      const category = orderBtn.dataset.category || 'Design';
      const price = orderBtn.dataset.price || '-';
      const link = window.location.href;

      const message =
        'Halo Kak Dwi 👋\n\n' +
        'Saya tertarik untuk order karya *' + name + '* (' + category + ').\n\n' +
        '📌 Kode Project : ' + code + '\n' +
        '💰 Harga : ' + price + '\n\n' +
        'Saya lihat contoh karyanya di sini:\n' + link + '\n\n' +
        'Mohon info lebih lanjut untuk proses pemesanannya ya, Kak. Terima kasih banyak sebelumnya 🙏😊';

      const waNumber = orderBtn.dataset.wa;
      const waUrl = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* =======================================================
     11. TOMBOL "ORDER SEKARANG" UMUM DI HOMEPAGE (section CTA)
     Pesan ini berbeda dari tombol order di halaman detail,
     karena belum tentu terkait 1 karya spesifik.
     ======================================================= */
  const generalOrderBtn = document.getElementById('general-order-btn');
  if (generalOrderBtn) {
    generalOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const message =
        'Halo Kak Dwi 👋\n\n' +
        'Saya tertarik untuk order jasa Design atau Vidio di Portfolio kakak.\n\n' +
        'Boleh dibantu info lebih lanjut mengenai layanan dan harganya? ' +
        'Terima kasih banyak sebelumnya 🙏😊';

      const waNumber = generalOrderBtn.dataset.wa;
      const waUrl = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

});
