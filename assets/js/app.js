/**
 * SiRI-Hub — Research. Innovate. Impact.
 * Core Application Logic, SPA Routing & Interactive Modules
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State & Data Store
  const state = {
    currentRoute: 'home',
    theme: localStorage.getItem('siri-theme') || 'light',
    activeDropdown: null,
    searchQuery: '',
    selectedCategory: 'all',
    selectedPhase: 1,
    setupPreferences: {
      platform: 'wordpress',
      hosting: 'guidance',
      logo: 'official',
      photos: 'have-some'
    }
  };

  // Publications Mock Data (Searchable & Filterable)
  const publications = [
    {
      id: 'PUB-2026-01',
      title: 'Digital Pedagogies in Sub-Saharan Classrooms: Evidence from Tech4Teachers Pilot',
      category: 'policy-briefs',
      categoryName: 'Policy Brief',
      date: 'October 2026',
      authors: 'Dr. Adebayo O., Dr. N. Mwangi, SiRI-Hub EdTech Unit',
      abstract: 'An evaluation of classroom technology adoption across 120 secondary schools in East and West Africa, detailing pedagogical shifts, student engagement indices, and policy recommendations for national curriculum integration.',
      downloadUrl: '#download-pub-1',
      pages: '28 Pages',
      citations: 34
    },
    {
      id: 'PUB-2026-02',
      title: 'Youth Digital Tech Clubs: Catalyzing Grassroots Coding and Robotics Innovation',
      category: 'technical-reports',
      categoryName: 'Technical Report',
      date: 'August 2026',
      authors: 'K. Mensah, A. Diallo, Youth Innovation Labs',
      abstract: 'Examines peer-led digital maker spaces and coding clubs among adolescent boys and girls, highlighting creative problem-solving, local hardware prototyping, and digital inclusion outcomes.',
      downloadUrl: '#download-pub-2',
      pages: '44 Pages',
      citations: 19
    },
    {
      id: 'PUB-2026-03',
      title: 'Adolescent Sexual & Reproductive Health Rights: Community Baseline Survey',
      category: 'baseline-surveys',
      categoryName: 'Baseline Survey',
      date: 'June 2026',
      authors: 'Health & Wellbeing Directorate in collaboration with Community Health Forum',
      abstract: 'A comprehensive study documenting knowledge gaps, cultural perceptions, and digital health access barriers among 3,500 adolescents in rural and peri-urban hubs.',
      downloadUrl: '#download-pub-3',
      pages: '62 Pages',
      citations: 28
    },
    {
      id: 'PUB-2026-04',
      title: 'Theory of Change & Systemic Impact Architecture for African Innovation Hubs',
      category: 'working-papers',
      categoryName: 'Working Paper',
      date: 'April 2026',
      authors: 'SiRI-Hub Strategic Research Council',
      abstract: 'Framework outlining five-tier systemic interventions linking primary research, grassroots youth capacity, institutional governance, and cross-sectoral policy impact.',
      downloadUrl: '#download-pub-4',
      pages: '36 Pages',
      citations: 45
    },
    {
      id: 'PUB-2026-05',
      title: 'Annual Research & Impact Comprehensive Review 2025/2026',
      category: 'technical-reports',
      categoryName: 'Annual Report',
      date: 'January 2026',
      authors: 'Executive Directorate & Monitoring & Evaluation Department',
      abstract: 'Full institutional report detailing verified milestones across the Big Five Pillars, financial accountability, partner contributions, and future strategic horizons.',
      downloadUrl: '#download-pub-5',
      pages: '88 Pages',
      citations: 52
    }
  ];

  // 2. Theme Management
  const applyTheme = (theme) => {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('siri-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark' 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  };

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      showToast(`Switched to ${state.theme} mode`);
    });
  }
  applyTheme(state.theme);

  // 3. Navigation Dropdowns (Desktop & Accessible Keyboard Support)
  const navItems = document.querySelectorAll('.nav-desktop .nav-item.has-dropdown');
  
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    
    // Toggle dropdown on click
    link.addEventListener('click', (e) => {
      // If mobile or click requested
      const isOpen = item.classList.contains('dropdown-open');
      closeAllDropdowns();
      if (!isOpen) {
        item.classList.add('dropdown-open');
        link.setAttribute('aria-expanded', 'true');
      }
    });

    // Hover handling with small delay for usability
    let hoverTimeout;
    item.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      closeAllDropdowns();
      item.classList.add('dropdown-open');
      link.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        item.classList.remove('dropdown-open');
        link.setAttribute('aria-expanded', 'false');
      }, 150);
    });

    // Keyboard support: Escape closes dropdown
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('dropdown-open');
        link.setAttribute('aria-expanded', 'false');
        link.focus();
      }
    });
  });

  function closeAllDropdowns() {
    navItems.forEach(item => {
      item.classList.remove('dropdown-open');
      const link = item.querySelector('.nav-link');
      if (link) link.setAttribute('aria-expanded', 'false');
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-desktop') && !e.target.closest('.dropdown-preview-bar')) {
      closeAllDropdowns();
    }
  });

  // 4. "SELECT A MENU ITEM TO PREVIEW ITS DROPDOWN" Interactive Bar
  const previewPills = document.querySelectorAll('.preview-pill-btn');
  previewPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetMenu = pill.getAttribute('data-target-menu');
      previewPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      closeAllDropdowns();

      // Find corresponding nav item
      const matchedNavItem = document.querySelector(`.nav-desktop .nav-item[data-menu="${targetMenu}"]`);
      if (matchedNavItem) {
        matchedNavItem.classList.add('dropdown-open');
        const link = matchedNavItem.querySelector('.nav-link');
        if (link) link.setAttribute('aria-expanded', 'true');
        matchedNavItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Route to view if applicable
      if (targetMenu === 'home') {
        navigateTo('home');
      } else if (targetMenu === 'about') {
        navigateTo('about');
      } else if (targetMenu === 'focus') {
        navigateTo('focus-areas');
      } else if (targetMenu === 'programmes') {
        navigateTo('programmes');
      } else if (targetMenu === 'research') {
        navigateTo('research');
      } else if (targetMenu === 'impact') {
        navigateTo('impact');
      } else if (targetMenu === 'partnerships') {
        navigateTo('partnerships');
      } else if (targetMenu === 'news') {
        navigateTo('news');
      } else if (targetMenu === 'contact') {
        navigateTo('contact');
      }

      showToast(`Inspecting dropdown: ${pill.textContent.trim()}`);
    });
  });

  // 5. Mobile Drawer & Accordion Menus
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openMobileNav() {
    mobileNavBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNavBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileNav);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', (e) => {
      if (e.target === mobileNavBackdrop) closeMobileNav();
    });
  }

  // Mobile Accordion items
  const mobileAccordions = document.querySelectorAll('.mobile-nav-accordion-item');
  mobileAccordions.forEach(acc => {
    const header = acc.querySelector('.mobile-accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = acc.classList.contains('open');
        mobileAccordions.forEach(a => a.classList.remove('open'));
        if (!isOpen) acc.classList.add('open');
      });
    }
  });

  // Mobile sub-links navigate and close drawer
  document.querySelectorAll('.mobile-sub-link, .mobile-direct-link').forEach(link => {
    link.addEventListener('click', (e) => {
      closeMobileNav();
    });
  });

  // 6. View Router (SPA Multi-Page Simulation)
  const views = document.querySelectorAll('.page-view');
  
  function navigateTo(routeId) {
    views.forEach(v => {
      v.classList.remove('active-view');
      v.style.display = 'none';
    });

    const targetView = document.getElementById(`view-${routeId}`) || document.getElementById('view-home');
    if (targetView) {
      targetView.style.display = 'block';
      setTimeout(() => targetView.classList.add('active-view'), 10);
      state.currentRoute = routeId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active state in desktop nav
    document.querySelectorAll('.nav-desktop .nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-menu') === routeId) {
        item.classList.add('active');
      }
    });

    // Update preview pill if matched
    previewPills.forEach(p => {
      if (p.getAttribute('data-target-menu') === routeId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    closeAllDropdowns();
  }

  // Hash change router listener
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash.startsWith('project-')) {
      // Navigate to project detail anchor or view
      const projectId = hash;
      const el = document.getElementById(projectId);
      if (el) {
        navigateTo('home');
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
      }
    }
    navigateTo(hash);
  });

  // Initial Route Check
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash);

  // Intercept all router links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetHash = this.getAttribute('href').replace('#', '');
      if (targetHash && !targetHash.startsWith('download') && !targetHash.startsWith('modal')) {
        // Let hashchange fire or trigger directly
        window.location.hash = targetHash;
      }
    });
  });

  // 7. Searchable Research & Publications Library Renderer
  const pubContainer = document.getElementById('publications-list-container');
  const pubSearchInput = document.getElementById('pub-search-input');
  const catPillBtns = document.querySelectorAll('.cat-pill-btn');

  function renderPublications() {
    if (!pubContainer) return;

    const filtered = publications.filter(pub => {
      const matchesCategory = state.selectedCategory === 'all' || pub.category === state.selectedCategory;
      const q = state.searchQuery.toLowerCase();
      const matchesQuery = !q || 
        pub.title.toLowerCase().includes(q) || 
        pub.abstract.toLowerCase().includes(q) || 
        pub.authors.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    if (filtered.length === 0) {
      pubContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--gold-500);">🔍</div>
          <h4 style="margin-bottom: 0.5rem;">No publications matched your search criteria</h4>
          <p style="font-size: 0.88rem;">Try clearing your query or switching categories (e.g. Policy Briefs, Technical Reports).</p>
          <button id="reset-pub-filter-btn" class="btn btn-outline" style="margin-top: 1rem;">Reset Search Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-pub-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.searchQuery = '';
          state.selectedCategory = 'all';
          if (pubSearchInput) pubSearchInput.value = '';
          catPillBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-cat') === 'all'));
          renderPublications();
        });
      }
      return;
    }

    pubContainer.innerHTML = filtered.map(pub => `
      <div class="pub-card">
        <div class="pub-doc-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div class="pub-info">
          <div class="pub-meta-info">
            <span class="pub-type-badge">${pub.categoryName}</span>
            <span class="pub-date">• ${pub.date}</span>
            <span class="pub-date">• ${pub.pages}</span>
            <span class="pub-date" style="color: var(--green-600); font-weight: 600;">• ${pub.citations} Citations</span>
          </div>
          <h3 class="pub-title">${pub.title}</h3>
          <p class="pub-authors">By: ${pub.authors}</p>
          <p class="pub-abstract">${pub.abstract}</p>
        </div>
        <div class="pub-actions">
          <button class="btn btn-primary btn-sm view-pub-btn" data-id="${pub.id}" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
            Read Brief
          </button>
          <button class="btn btn-outline btn-sm download-pub-btn" data-id="${pub.id}" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
            Download PDF
          </button>
        </div>
      </div>
    `).join('');

    // Attach listeners
    document.querySelectorAll('.view-pub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pub = publications.find(p => p.id === id);
        if (pub) openPubModal(pub);
      });
    });

    document.querySelectorAll('.download-pub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pub = publications.find(p => p.id === id);
        if (pub) {
          showToast(`Downloading: "${pub.title.substring(0, 36)}..."`);
          setTimeout(() => {
            showToast(`Download completed: ${pub.id}.pdf`);
          }, 1200);
        }
      });
    });
  }

  if (pubSearchInput) {
    pubSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderPublications();
    });
  }

  catPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedCategory = btn.getAttribute('data-cat');
      renderPublications();
    });
  });

  renderPublications();

  // 8. Publication Detail Modal
  const pubModal = document.getElementById('pub-modal');
  const pubModalClose = document.getElementById('pub-modal-close');
  const pubModalContent = document.getElementById('pub-modal-details');

  function openPubModal(pub) {
    if (!pubModal || !pubModalContent) return;
    pubModalContent.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span class="pub-type-badge">${pub.categoryName}</span>
        <span style="font-size: 0.8rem; color: var(--text-subtle); margin-left: 0.5rem;">Document Ref: ${pub.id}</span>
      </div>
      <h3 style="font-size: 1.4rem; margin-bottom: 0.75rem;">${pub.title}</h3>
      <p style="font-size: 0.88rem; color: var(--text-subtle); margin-bottom: 1.25rem;">Lead Researchers: <strong>${pub.authors}</strong> | Published: ${pub.date}</p>
      
      <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--green-600); margin-bottom: 1.5rem;">
        <h5 style="font-size: 0.85rem; text-transform: uppercase; color: var(--green-600); margin-bottom: 0.4rem;">Executive Abstract & Methodology</h5>
        <p style="font-size: 0.92rem; color: var(--text-main);">${pub.abstract}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="font-size: 0.95rem; margin-bottom: 0.6rem;">Key Research Findings & Policy Recommendations</h5>
        <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.45rem;">
          <li>Institutional adoption of blended EdTech tools increased teacher confidence by 74% across target districts.</li>
          <li>Peer-facilitated digital literacy clubs achieved parity in female enrollment when paired with localized mentorship.</li>
          <li>Recommends ministry-level integration of low-bandwidth offline digital curriculum repositories.</li>
        </ul>
      </div>

      <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--text-subtle);">Citation (APA)</span>
          <p style="font-size: 0.82rem; margin: 0; color: var(--text-main);">Sierra Research &amp; Innovation Hub (SiRI-Hub). (${pub.date.split(' ')[1]}). <em>${pub.title}</em>. Freetown &amp; Regional Research Repositories.</p>
        </div>
        <button id="copy-citation-btn" class="btn btn-outline btn-sm" style="flex-shrink: 0; font-size: 0.75rem;">Copy Citation</button>
      </div>
    `;

    const copyBtn = document.getElementById('copy-citation-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(`SiRI-Hub. (${pub.date.split(' ')[1]}). ${pub.title}. Regional Repositories.`);
        showToast('Citation copied to clipboard!');
      });
    }

    pubModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (pubModalClose) {
    pubModalClose.addEventListener('click', () => {
      pubModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 9. Interactive Application Form Modal (Programmes & Opportunities)
  const appModal = document.getElementById('application-modal');
  const appModalClose = document.getElementById('app-modal-close');
  const openAppBtns = document.querySelectorAll('.open-application-btn');
  const appForm = document.getElementById('programme-application-form');
  const appSuccessBox = document.getElementById('application-success-view');

  openAppBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const progTitle = btn.getAttribute('data-programme') || 'General Opportunity';
      const progSelect = document.getElementById('app-track-select');
      if (progSelect) {
        // Match or set value
        progSelect.value = progTitle;
      }
      if (appSuccessBox) appSuccessBox.style.display = 'none';
      if (appForm) appForm.style.display = 'block';
      if (appModal) {
        appModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (appModalClose) {
    appModalClose.addEventListener('click', () => {
      if (appModal) appModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('app-name').value;
      const applicantEmail = document.getElementById('app-email').value;
      const track = document.getElementById('app-track-select').value;
      const refNumber = `SIRI-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      if (appForm) appForm.style.display = 'none';
      if (appSuccessBox) {
        appSuccessBox.style.display = 'block';
        appSuccessBox.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 64px; height: 64px; background: var(--green-100); color: var(--green-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 2rem;">
              ✓
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Application Successfully Submitted!</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
              Thank you, <strong>${applicantName}</strong>. Your application for <strong>${track}</strong> has been registered.
            </p>

            <div style="background: var(--bg-secondary); border: 1.5px dashed var(--green-500); padding: 1.25rem; border-radius: var(--radius-md); display: inline-block; text-align: left; margin-bottom: 1.75rem;">
              <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--text-subtle);">Application Reference Number</div>
              <div style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--navy-800);">${refNumber}</div>
              <div style="font-size: 0.8rem; color: var(--green-600); margin-top: 0.25rem;">A confirmation has been logged for: ${applicantEmail}</div>
            </div>

            <div style="display: flex; justify-content: center; gap: 0.75rem;">
              <button class="btn btn-primary" onclick="window.print()">Print Submission Slip</button>
              <button class="btn btn-outline" id="finish-app-btn">Done</button>
            </div>
          </div>
        `;

        document.getElementById('finish-app-btn')?.addEventListener('click', () => {
          appModal.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      showToast(`Application submitted! Ref: ${refNumber}`);
    });
  }

  // 10. Interactive Contact & Strategic Partnership Form
  const contactForm = document.getElementById('contact-form');
  const formTabBtns = document.querySelectorAll('.form-tab-btn');
  const formInquiryType = document.getElementById('form-inquiry-type');

  formTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      formTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-mode');
      if (formInquiryType) {
        formInquiryType.value = mode === 'partnership' ? 'Strategic Partnership Proposal' : 'General Enquiry';
      }
      showToast(`Form mode: ${tab.textContent.trim()}`);
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const ref = `SIRI-PART-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      showToast(`Thank you, ${name}! Your inquiry has been logged (Ref: ${ref})`);
      contactForm.reset();

      // Show receipt alert
      const alertBox = document.getElementById('contact-form-feedback');
      if (alertBox) {
        alertBox.innerHTML = `
          <div style="background: var(--green-50); border: 1px solid var(--green-400); color: var(--green-600); padding: 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-top: 1rem;">
            <strong>✓ Enquiry Received:</strong> Reference <strong>${ref}</strong>. Our Partnerships and Institutional Secretariat will review your message and reply within 48 business hours.
          </div>
        `;
      }
    });
  }

  // 11. Partner Enquiry Tracking Tool
  const trackBtn = document.getElementById('track-enquiry-btn');
  const trackInput = document.getElementById('track-enquiry-input');
  const trackResult = document.getElementById('track-enquiry-result');

  if (trackBtn && trackInput && trackResult) {
    trackBtn.addEventListener('click', () => {
      const code = trackInput.value.trim() || 'SIRI-PART-2026-8849';
      trackResult.style.display = 'block';
      trackResult.innerHTML = `
        <div style="background: var(--bg-primary); border: 1.5px solid var(--green-500); padding: 1.25rem; border-radius: var(--radius-md); margin-top: 1rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 800; font-family: 'Outfit'; color: var(--navy-800);">${code.toUpperCase()}</span>
            <span class="pub-type-badge" style="background: var(--green-100); color: var(--green-600);">Status: Under Review</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            Strategic Directorate: Technology Education & Youth Capacity Interventions
          </p>
          <div style="height: 6px; background: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 0.5rem;">
            <div style="width: 65%; height: 100%; background: var(--green-500);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-subtle);">
            <span>Submitted</span>
            <span style="font-weight: 700; color: var(--green-600);">Institutional Review (In Progress)</span>
            <span>MoA Execution</span>
          </div>
        </div>
      `;
    });
  }

  // 12. Animated Impact Counter (Intersection Observer)
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counterElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 2000;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current).toLocaleString();
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const impactSection = document.getElementById('impact-counter-strip');
  if (impactSection) {
    countObserver.observe(impactSection);
  }

  // 13. About Us Tabs Navigator
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutPanes = document.querySelectorAll('.about-tab-pane');

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      aboutTabs.forEach(t => t.classList.remove('active'));
      aboutPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 14. Section 7: SiRI-Hub Setup & Launch Readiness Checklist Modal
  const setupModal = document.getElementById('setup-readiness-modal');
  const setupModalClose = document.getElementById('setup-modal-close');
  const setupLauncherBtns = document.querySelectorAll('.setup-launcher-btn');
  const exportPlanBtn = document.getElementById('export-plan-btn');

  setupLauncherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (setupModal) {
        setupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (setupModalClose) {
    setupModalClose.addEventListener('click', () => {
      if (setupModal) {
        setupModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Listen to preference changes
  document.querySelectorAll('input[name="pref-platform"]').forEach(radio => {
    radio.addEventListener('change', (e) => state.setupPreferences.platform = e.target.value);
  });
  document.querySelectorAll('input[name="pref-hosting"]').forEach(radio => {
    radio.addEventListener('change', (e) => state.setupPreferences.hosting = e.target.value);
  });
  document.querySelectorAll('input[name="pref-logo"]').forEach(radio => {
    radio.addEventListener('change', (e) => state.setupPreferences.logo = e.target.value);
  });
  document.querySelectorAll('input[name="pref-photos"]').forEach(radio => {
    radio.addEventListener('change', (e) => state.setupPreferences.photos = e.target.value);
  });

  if (exportPlanBtn) {
    exportPlanBtn.addEventListener('click', () => {
      const summaryText = `
SiRI-Hub Implementation Plan & Preferences Summary:
--------------------------------------------------
1. Platform Preference: ${state.setupPreferences.platform.toUpperCase()}
   - Recommendation: Launch MVP first with clean responsive architecture, all 9 navigation categories, complete dropdowns, the Big Five Pillars, and 4 key project pages.
2. Domain & Hosting: ${state.setupPreferences.hosting.toUpperCase()}
3. Official Logo: ${state.setupPreferences.logo.toUpperCase()}
4. Organisational Photography: ${state.setupPreferences.photos.toUpperCase()}
5. Phased Rollout:
   - Phase 1 (Essential Website): Active & Verified
   - Phase 2 (Programmes & Application Platform): Prepared
   - Phase 3 (Research & Impact Portal): Configured
--------------------------------------------------
Generated on: ${new Date().toLocaleDateString()}
      `.trim();

      navigator.clipboard.writeText(summaryText);
      showToast('Implementation summary copied to clipboard!');
    });
  }

  // 15. Toast System
  const toastContainer = document.getElementById('toast-container');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-400)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Close modals on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pubModal && pubModal.classList.contains('active')) {
        pubModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (appModal && appModal.classList.contains('active')) {
        appModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (setupModal && setupModal.classList.contains('active')) {
        setupModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});
