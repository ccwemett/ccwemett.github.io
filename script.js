/* Cloe Wemett — site scripts (no dependencies) */
(function () {
    'use strict';
    document.documentElement.classList.remove('no-js');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Mobile menu ---------- */
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    function setMenu(open) {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.toggle('active', open);
        mobileMenu.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
    }
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('active')); });
        mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
        window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
    }

    /* ---------- Reveal on scroll ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Puzzle pieces: assemble, float, parallax, drag ---------- */
    var pieces = Array.prototype.slice.call(document.querySelectorAll('.piece.fly'));
    pieces.forEach(function (p) {
        if (reduceMotion) { p.classList.add('settled'); p.style.animation = 'none'; return; }
        p.addEventListener('animationend', function onEnd(e) {
            if (e.animationName === 'assemble') { p.classList.add('settled'); p.removeEventListener('animationend', onEnd); }
        });
    });

    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
    var mouse = { x: 0, y: 0 }, scrollY = 0, ticking = false;
    function applyParallax() {
        ticking = false;
        parallaxEls.forEach(function (el) {
            if (el.classList.contains('is-dragging')) return;
            var d = parseFloat(el.dataset.depth) || 0;
            var ox = parseFloat(el.dataset.ox || 0), oy = parseFloat(el.dataset.oy || 0);
            el.style.setProperty('--px', (ox + mouse.x * d * 22) + 'px');
            el.style.setProperty('--py', (oy + mouse.y * d * 22 - scrollY * d * 0.06) + 'px');
        });
    }
    function queue() { if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); } }
    if (parallaxEls.length && !reduceMotion) {
        if (window.matchMedia('(hover: hover)').matches) {
            window.addEventListener('mousemove', function (e) {
                mouse.x = e.clientX / window.innerWidth - 0.5;
                mouse.y = e.clientY / window.innerHeight - 0.5;
                queue();
            }, { passive: true });
        }
        window.addEventListener('scroll', function () { scrollY = window.scrollY; queue(); }, { passive: true });
    }

    /* Draggable pieces (hero): grab one and move it around */
    document.querySelectorAll('.piece.is-drag').forEach(function (p) {
        var startX, startY, baseX, baseY, id = null;
        p.addEventListener('pointerdown', function (e) {
            id = e.pointerId; p.setPointerCapture(id);
            p.classList.add('is-dragging');
            startX = e.clientX; startY = e.clientY;
            baseX = parseFloat(p.style.getPropertyValue('--px')) || 0;
            baseY = parseFloat(p.style.getPropertyValue('--py')) || 0;
            p.style.animationPlayState = 'paused';
            e.preventDefault();
        });
        p.addEventListener('pointermove', function (e) {
            if (id === null) return;
            var x = baseX + e.clientX - startX, y = baseY + e.clientY - startY;
            p.style.setProperty('--px', x + 'px'); p.style.setProperty('--py', y + 'px');
            p.dataset.ox = x; p.dataset.oy = y;
        });
        function end() {
            if (id === null) return;
            id = null; p.classList.remove('is-dragging'); p.style.animationPlayState = '';
        }
        p.addEventListener('pointerup', end);
        p.addEventListener('pointercancel', end);
    });

    /* ---------- Contact form (opens the visitor's mail app with details filled in) ---------- */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var f = new FormData(form);
            var subject = 'Inquiry: ' + (f.get('service') || 'Hello');
            var body = 'Name: ' + f.get('name') + '\nEmail: ' + f.get('email') + '\nInterested in: ' + f.get('service') + '\n\n' + f.get('message');
            window.location.href = 'mailto:cloe@ccwemett.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
    }

    /* ---------- Pre-select a service when linked from elsewhere (?service=Photography) ---------- */
    var svcSelect = document.getElementById('service');
    var wanted = new URLSearchParams(window.location.search).get('service');
    if (svcSelect && wanted) { svcSelect.value = wanted; }

    /* ---------- Photography: build the portfolio from shoots.js ---------- */
    var covers = document.getElementById('covers');
    var filterBar = document.getElementById('filters');
    var filters = [], cards = [];

    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    function renderPortfolio(shoots) {
        var html = '';
        shoots.forEach(function (s) {
            var base = 'images/shoots/' + s.slug + '/';
            var items = s.photos.map(function (p) { return typeof p === 'string' ? { file: p } : p; });
            var cover = s.cover || items[0].file;
            var ordered = [cover].concat(items.map(function (p) { return p.file; }).filter(function (f) { return f !== cover; }));
            var altFor = {};
            items.forEach(function (p, i) { altFor[p.file] = p.alt || (s.altBase || s.title) + ' ' + (i + 1); });
            var cls = s.layout === 'wide' ? ' is-wide' : (s.layout === 'wide-mobile' ? ' m-wide' : '');
            var tag = cap(s.category) + (s.year ? ' &middot; ' + esc(s.year) : '');
            var links = ordered.slice(1).map(function (f) {
                return '<a href="' + base + f + '.jpg" data-alt="' + esc(altFor[f]) + '" tabindex="-1">' + esc(altFor[f]) + '</a>';
            }).join('');
            html += '<article class="cover-card' + cls + '" data-cat="' + esc(s.category) + '" data-title="' + esc(s.title) + '" style="--pos:' + (s.coverPosition || '50% 50%') + ';--c:var(--' + (s.accent || 'rose') + ')">' +
                '<a class="cover" href="' + base + cover + '.jpg" data-alt="' + esc(s.title) + ' cover photo" aria-label="View ' + items.length + ' photos from ' + esc(s.title) + '">' +
                '<img src="' + base + cover + '.jpg" alt="' + esc(s.title) + '" loading="lazy">' +
                '<span class="cover-shade"></span><span class="cover-meta"><span class="cover-tag">' + tag + '</span>' +
                '<span class="cover-title">' + esc(s.title) + '</span>' +
                '<span class="cover-cta">View ' + items.length + ' photos <span aria-hidden="true">&rarr;</span></span></span></a>' +
                '<span class="sr-links">' + links + '</span></article>';
        });
        covers.innerHTML = html;
        cards = document.querySelectorAll('.cover-card');

        /* filter buttons come from the categories used in shoots.json */
        var cats = [];
        shoots.forEach(function (s) { if (cats.indexOf(s.category) < 0) cats.push(s.category); });
        filterBar.innerHTML = '<button class="filter" type="button" data-filter="all" aria-pressed="true">All</button>' +
            cats.map(function (c) { return '<button class="filter" type="button" data-filter="' + esc(c) + '" aria-pressed="false">' + esc(cap(c)) + '</button>'; }).join('');
        filters = document.querySelectorAll('.filter');
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cat = btn.dataset.filter;
                filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
                cards.forEach(function (c) { c.classList.toggle('hidden', !(cat === 'all' || c.dataset.cat === cat)); });
                covers.classList.toggle('is-filtered', cat !== 'all');
            });
        });
        initViewer();
    }

    if (covers && filterBar) {
        if (Array.isArray(window.SHOOTS)) {
            renderPortfolio(window.SHOOTS);
        } else {
            covers.innerHTML = '<p class="portfolio-error">The portfolio could not be loaded. Check shoots.js for a missing comma or quote.</p>';
        }
    }

    function initViewer() {
    /* Shoot gallery (all photos at once) + large viewer */
    var lb = document.getElementById('lightbox');
    var gm = document.getElementById('gallery');
    if (lb && gm) {
        var lbImg = document.getElementById('lbImage'), lbCount = document.getElementById('lbCount'), lbTitle = document.getElementById('lbTitle');
        var gmGrid = document.getElementById('gmGrid'), gmTitle = document.getElementById('gmTitle'), gmCount = document.getElementById('gmCount');
        var list = [], idx = 0, currentTitle = '', gmFocus = null, lbFocus = null;
        function lock() { document.body.style.overflow = (lb.classList.contains('open') || gm.classList.contains('open')) ? 'hidden' : ''; }

        /* viewer */
        function show(i) {
            idx = (i + list.length) % list.length;
            var a = list[idx];
            lbImg.src = a.getAttribute('href');
            lbImg.alt = a.dataset.alt || '';
            lbCount.textContent = (idx + 1) + ' of ' + list.length;
            var next = list[(idx + 1) % list.length]; if (next) { new Image().src = next.getAttribute('href'); }
        }
        function openViewer(i) {
            lbFocus = document.activeElement;
            lbTitle.textContent = currentTitle;
            lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); lock();
            show(i); lb.querySelector('.lb-close').focus();
        }
        function closeViewer() {
            lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; lock();
            if (lbFocus) lbFocus.focus();
        }

        /* gallery */
        function openGallery(card) {
            list = Array.prototype.slice.call(card.querySelectorAll('a'));
            currentTitle = card.dataset.title || '';
            gmTitle.textContent = currentTitle;
            gmCount.textContent = list.length + ' photos';
            gmGrid.innerHTML = '';
            list.forEach(function (a, i) {
                var b = document.createElement('button');
                b.type = 'button'; b.className = 'gm-item';
                b.setAttribute('aria-label', 'View photo ' + (i + 1) + ' larger');
                var im = document.createElement('img');
                im.src = a.getAttribute('href').replace(/([^\/]+)$/, 'thumbs/$1');
                im.alt = a.dataset.alt || '';
                b.appendChild(im);
                b.addEventListener('click', function () { openViewer(i); });
                gmGrid.appendChild(b);
            });
            gmFocus = document.activeElement;
            gm.classList.add('open'); gm.setAttribute('aria-hidden', 'false'); gm.querySelector('.gm-panel').scrollTop = 0; lock();
            gm.querySelector('.gm-close').focus();
        }
        function closeGallery() {
            gm.classList.remove('open'); gm.setAttribute('aria-hidden', 'true'); lock();
            if (gmFocus) gmFocus.focus();
        }

        cards.forEach(function (card) {
            card.querySelector('.cover').addEventListener('click', function (e) { e.preventDefault(); openGallery(card); });
        });
        gm.querySelector('.gm-close').addEventListener('click', closeGallery);
        gm.addEventListener('click', function (e) { if (e.target === gm) closeGallery(); });
        lb.querySelector('.lb-close').addEventListener('click', closeViewer);
        lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
        lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeViewer(); });
        document.addEventListener('keydown', function (e) {
            if (lb.classList.contains('open')) {
                if (e.key === 'Escape') closeViewer();
                if (e.key === 'ArrowLeft') show(idx - 1);
                if (e.key === 'ArrowRight') show(idx + 1);
            } else if (gm.classList.contains('open') && e.key === 'Escape') { closeGallery(); }
        });
        var tx = null;
        lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (tx === null) return;
            var dx = e.changedTouches[0].clientX - tx; tx = null;
            if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
        }, { passive: true });
    }
    }
})();
