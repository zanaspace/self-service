/**
 * CICOD Enterprise Self-Service Portal - Interactive Controller
 * Handles modal workflows, dynamic catalog rendering, search filters,
 * ticket generation, live tracking inspection, and personnel verification.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    activeCategory: 'all',
    searchQuery: '',
    selectedService: null
  };

  // DOM Elements
  const DOM = {
    // Modals
    modalServices: document.getElementById('modal-services'),
    modalRequestForm: document.getElementById('modal-request-form'),
    modalTrackResult: document.getElementById('modal-track-result'),
    modalVerifyResult: document.getElementById('modal-verify-result'),
    modalDirectory: document.getElementById('modal-directory'),
    
    // Service Catalog
    catPillGroup: document.getElementById('cat-pill-group'),
    serviceSearchInput: document.getElementById('service-search-input'),
    serviceListGrid: document.getElementById('service-list-grid'),
    
    // Quick Actions
    btnOpenCatalog: document.getElementById('btn-open-catalog'),
    btnOpenDirectory: document.getElementById('btn-open-directory'),
    
    // Tracking Form
    trackForm: document.getElementById('track-form'),
    trackEmailInput: document.getElementById('track-email'),
    trackIdInput: document.getElementById('track-id'),
    trackResultContainer: document.getElementById('track-result-container'),
    
    // Verify Form
    verifyForm: document.getElementById('verify-form'),
    verifySurnameInput: document.getElementById('verify-surname'),
    verifyIdInput: document.getElementById('verify-id'),
    verifyResultContainer: document.getElementById('verify-result-container'),
    
    // Directory
    directorySearchInput: document.getElementById('directory-search-input'),
    directoryTableBody: document.getElementById('directory-table-body'),
    
    // Request Form Elements
    formSelectedServiceName: document.getElementById('form-selected-service-name'),
    formSelectedServiceDept: document.getElementById('form-selected-service-dept'),
    requestSubmissionForm: document.getElementById('request-submission-form'),
    requestFormBody: document.getElementById('request-form-body'),
    requestSuccessBody: document.getElementById('request-success-body'),
    generatedTrackId: document.getElementById('generated-track-id')
  };

  // Helper: Open Modal
  function openModal(modal) {
    if (!modal) return;
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Helper: Close Modal
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind Universal Modal Close Listeners
  function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
      const closeBtn = overlay.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(overlay));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
      }
    });

    if (DOM.btnOpenCatalog) {
      DOM.btnOpenCatalog.addEventListener('click', () => openModal(DOM.modalServices));
    }

    if (DOM.btnOpenDirectory) {
      DOM.btnOpenDirectory.addEventListener('click', () => {
        renderDirectoryTable();
        openModal(DOM.modalDirectory);
      });
    }
  }

  // Render Category Filter Pills
  function renderCategoryPills() {
    if (!DOM.catPillGroup || !window.CICOD_PORTAL_DATA) return;
    const cats = window.CICOD_PORTAL_DATA.categories;
    DOM.catPillGroup.innerHTML = cats.map(cat => `
      <button type="button" class="cat-pill ${cat.id === state.activeCategory ? 'active' : ''}" data-cat="${cat.id}">
        ${cat.name} (${cat.count})
      </button>
    `).join('');

    DOM.catPillGroup.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.getAttribute('data-cat');
        DOM.catPillGroup.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderServiceList();
      });
    });
  }

  // Render Service List with Filters
  function renderServiceList() {
    if (!DOM.serviceListGrid || !window.CICOD_PORTAL_DATA) return;
    let services = window.CICOD_PORTAL_DATA.services;

    if (state.activeCategory !== 'all') {
      services = services.filter(s => s.catId === state.activeCategory);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      services = services.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.desc.toLowerCase().includes(q) || 
        s.dept.toLowerCase().includes(q)
      );
    }

    if (services.length === 0) {
      DOM.serviceListGrid.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <p style="font-weight: 600; font-size: 15px; margin-bottom: 6px;">No matching service queues found</p>
          <p style="font-size: 13px;">Try refining your search keyword or selecting a different category.</p>
        </div>
      `;
      return;
    }

    DOM.serviceListGrid.innerHTML = services.map(s => `
      <div class="service-item-card" data-service-id="${s.id}">
        <div class="service-item-info">
          <h4>${s.title}</h4>
          <p>${s.desc}</p>
          <div class="service-item-meta">
            <span class="badge-sla">${s.sla}</span>
            <span class="badge-dept">${s.dept}</span>
            <span class="badge-dept" style="background:#E2E8F0; color:#0B192C; font-weight:600;">${s.badge}</span>
          </div>
        </div>
        <button type="button" class="btn-open-form" data-service-id="${s.id}">
          Start Request &rarr;
        </button>
      </div>
    `).join('');

    // Attach click listeners to "Start Request" buttons
    DOM.serviceListGrid.querySelectorAll('.btn-open-form').forEach(btn => {
      btn.addEventListener('click', () => {
        const sId = btn.getAttribute('data-service-id');
        openRequestFormForService(sId);
      });
    });
  }

  // Open Request Submission Modal for Service
  function openRequestFormForService(serviceId) {
    const s = window.CICOD_PORTAL_DATA.services.find(item => item.id === serviceId);
    if (!s) return;
    state.selectedService = s;

    if (DOM.formSelectedServiceName) DOM.formSelectedServiceName.textContent = s.title;
    if (DOM.formSelectedServiceDept) DOM.formSelectedServiceDept.textContent = `${s.dept} · Guaranteed ${s.sla}`;

    // Reset Form view
    if (DOM.requestFormBody) DOM.requestFormBody.style.display = 'block';
    if (DOM.requestSuccessBody) DOM.requestSuccessBody.style.display = 'none';
    if (DOM.requestSubmissionForm) DOM.requestSubmissionForm.reset();

    closeModal(DOM.modalServices);
    openModal(DOM.modalRequestForm);
  }

  // Handle Request Submission
  function initRequestSubmission() {
    if (!DOM.requestSubmissionForm) return;

    DOM.requestSubmissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = DOM.requestSubmissionForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite;">&#9696;</span> Generating Ticket & Routing...`;
      btn.disabled = true;

      const applicantName = document.getElementById('applicant-name').value;
      const applicantEmail = document.getElementById('applicant-email').value;
      const applicantPhone = document.getElementById('applicant-phone').value;
      const applicantOrg = document.getElementById('applicant-org').value || 'Individual Client';
      const requestSubject = document.getElementById('request-subject').value;
      const requestDescription = document.getElementById('request-description').value;
      const requestPriority = document.getElementById('request-priority').value;

      setTimeout(() => {
        // Generate Unique Reference ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newTrackingId = `CICOD-SR-2026-${randomNum}`;
        const serviceTitle = state.selectedService ? state.selectedService.title : 'General Customer Request';
        const serviceDept = state.selectedService ? state.selectedService.dept : 'Customer Operations';
        const serviceSla = state.selectedService ? state.selectedService.sla : '24h SLA';

        // Register dynamic ticket into demo tracking store so user can track it immediately!
        window.CICOD_PORTAL_DATA.demoTracking[newTrackingId] = {
          id: newTrackingId,
          email: applicantEmail,
          service: serviceTitle,
          title: requestSubject,
          dept: serviceDept,
          officer: 'Automated Triaging Queue',
          status: 'PENDING TRIAGE',
          submittedDate: 'Just Now · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          slaTarget: `Target Resolution: ${serviceSla}`,
          timeline: [
            {
              title: 'Request Submitted Online',
              time: 'Just Now',
              status: 'done',
              note: `Submission received from ${applicantName} (${applicantOrg}). Dispatched to ${serviceDept}.`
            },
            {
              title: 'Automated Triaged & Department Assignment',
              time: 'In Queue',
              status: 'current',
              note: `Classified under Priority "${requestPriority}". Routing to senior workflow officer.`
            },
            {
              title: 'Technical Investigation & Resolution',
              time: 'Pending',
              status: 'pending',
              note: 'Workflow officer will assess provided details and execute required actions.'
            },
            {
              title: 'Resolution Notification & Closure',
              time: 'Pending',
              status: 'pending',
              note: `Formal completion update and audit report will be dispatched to ${applicantEmail}.`
            }
          ]
        };

        // Render success body
        if (DOM.generatedTrackId) DOM.generatedTrackId.textContent = newTrackingId;
        if (DOM.requestFormBody) DOM.requestFormBody.style.display = 'none';
        if (DOM.requestSuccessBody) DOM.requestSuccessBody.style.display = 'block';

        btn.innerHTML = originalText;
        btn.disabled = false;

        // Auto-fill tracking card inputs for user convenience
        if (DOM.trackEmailInput) DOM.trackEmailInput.value = applicantEmail;
        if (DOM.trackIdInput) DOM.trackIdInput.value = newTrackingId;

      }, 800);
    });

    // Success action: Track this ticket immediately
    const btnTrackSuccess = document.getElementById('btn-track-success');
    if (btnTrackSuccess) {
      btnTrackSuccess.addEventListener('click', () => {
        closeModal(DOM.modalRequestForm);
        const trackId = DOM.generatedTrackId.textContent;
        renderTrackingResult(trackId);
        openModal(DOM.modalTrackResult);
      });
    }

    // Success action: Copy Reference ID
    const btnCopyTrackId = document.getElementById('btn-copy-track-id');
    if (btnCopyTrackId) {
      btnCopyTrackId.addEventListener('click', () => {
        const text = DOM.generatedTrackId.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btnCopyTrackId.textContent = 'Copied to Clipboard!';
          setTimeout(() => { btnCopyTrackId.textContent = 'Copy Reference ID'; }, 2000);
        });
      });
    }
  }

  // Render Tracking Result Modal
  function renderTrackingResult(trackingId) {
    if (!DOM.trackResultContainer || !window.CICOD_PORTAL_DATA) return;
    const cleanId = (trackingId || '').trim();
    const data = window.CICOD_PORTAL_DATA.demoTracking[cleanId] ||
                 Object.values(window.CICOD_PORTAL_DATA.demoTracking).find(item => item.id.toLowerCase() === cleanId.toLowerCase());

    if (!data) {
      DOM.trackResultContainer.innerHTML = `
        <div style="text-align: center; padding: 32px 16px;">
          <div style="font-size: 32px; color: #D97706; margin-bottom: 12px;">&#9888;</div>
          <h4 style="font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px;">No Record Found for "${cleanId}"</h4>
          <p style="font-size: 13px; color: var(--text-muted); max-width: 420px; margin: 0 auto 16px;">
            Please ensure you typed the exact reference format (e.g., <strong>CICOD-SR-2026-8812</strong>) along with your registered email address.
          </p>
          <button type="button" class="btn-primary btn-gold" id="btn-fill-demo-track" style="margin: 0 auto; display: inline-flex;">
            Load Live Demo Ticket (CICOD-SR-2026-8812)
          </button>
        </div>
      `;
      const btnFill = document.getElementById('btn-fill-demo-track');
      if (btnFill) {
        btnFill.addEventListener('click', () => {
          renderTrackingResult('CICOD-SR-2026-8812');
          if (DOM.trackEmailInput) DOM.trackEmailInput.value = 'oladeji.toriola@crowninteractive.com';
          if (DOM.trackIdInput) DOM.trackIdInput.value = 'CICOD-SR-2026-8812';
        });
      }
      return;
    }

    const stepsHtml = data.timeline.map((st, idx) => `
      <div class="step-node ${st.status}">
        <div class="node-dot">${idx + 1}</div>
        <div class="node-title">${st.title}</div>
        <div class="node-time">${st.time}</div>
        <div class="node-note">${st.note}</div>
      </div>
    `).join('');

    DOM.trackResultContainer.innerHTML = `
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--gold); letter-spacing: 0.5px;">Reference ID</span>
            <h3 style="font-size: 18px; font-weight: 800; color: var(--navy);">${data.id}</h3>
          </div>
          <span class="timeline-badge-in-progress">${data.status}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12.5px; margin-bottom: 12px;">
          <div><strong style="color:var(--navy);">Service Queue:</strong> <br>${data.service}</div>
          <div><strong style="color:var(--navy);">Department:</strong> <br>${data.dept}</div>
          <div><strong style="color:var(--navy);">Assigned Lead:</strong> <br>${data.officer}</div>
          <div><strong style="color:var(--navy);">SLA Performance:</strong> <br><span style="color:#B45309; font-weight:600;">${data.slaTarget}</span></div>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); border-top: 1px dashed var(--border); padding-top: 8px;">
          <strong>Request Subject:</strong> "${data.title}"
        </div>
      </div>

      <h4 style="font-size: 14px; font-weight: 700; color: var(--navy); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        <span>Progress Milestone Stepper</span>
        <span style="font-size: 11px; font-weight: 500; color: var(--text-muted);">(Real-Time Automated Synced)</span>
      </h4>

      <div class="stepper-wrap">
        ${stepsHtml}
      </div>
    `;
  }

  // Handle Tracking Form Submission from Card
  function initTrackingForm() {
    if (!DOM.trackForm) return;

    DOM.trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const trackId = DOM.trackIdInput.value.trim();
      renderTrackingResult(trackId);
      openModal(DOM.modalTrackResult);
    });

    // Demo auto-fill chip
    const chipTrackDemo = document.getElementById('chip-track-demo');
    if (chipTrackDemo) {
      chipTrackDemo.addEventListener('click', () => {
        if (DOM.trackEmailInput) DOM.trackEmailInput.value = 'oladeji.toriola@crowninteractive.com';
        if (DOM.trackIdInput) DOM.trackIdInput.value = 'CICOD-SR-2026-8812';
        renderTrackingResult('CICOD-SR-2026-8812');
        openModal(DOM.modalTrackResult);
      });
    }
  }

  // Render Staff Verification Result Modal
  function renderVerifyResult(surname, staffId) {
    if (!DOM.verifyResultContainer || !window.CICOD_PORTAL_DATA) return;
    const key = `${(surname || '').toLowerCase().trim()}_${(staffId || '').trim()}`;
    const staff = window.CICOD_PORTAL_DATA.demoStaff[key] ||
                  Object.values(window.CICOD_PORTAL_DATA.demoStaff).find(s => 
                    s.surname.toLowerCase() === (surname || '').toLowerCase().trim() && 
                    s.staffId.trim() === (staffId || '').trim()
                  );

    if (!staff) {
      DOM.verifyResultContainer.innerHTML = `
        <div style="text-align: center; padding: 32px 16px;">
          <div style="font-size: 32px; color: #DC2626; margin-bottom: 12px;">&#10060;</div>
          <h4 style="font-size: 16px; font-weight: 700; color: #DC2626; margin-bottom: 8px;">Staff Verification Failed</h4>
          <p style="font-size: 13px; color: var(--text-muted); max-width: 440px; margin: 0 auto 16px;">
            No accredited personnel matches Surname <strong>"${surname}"</strong> with ID <strong>"${staffId}"</strong>.
            Please verify the exact spellings or alert security if you suspect unauthorized misrepresentation.
          </p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn-primary" id="btn-fill-staff-1" style="font-size: 12px; height: 36px; padding: 0 12px;">
              Try Toriola / 8842
            </button>
            <button type="button" class="btn-primary" id="btn-fill-staff-2" style="font-size: 12px; height: 36px; padding: 0 12px;">
              Try Okon / 4456
            </button>
          </div>
        </div>
      `;
      const btnStaff1 = document.getElementById('btn-fill-staff-1');
      if (btnStaff1) {
        btnStaff1.addEventListener('click', () => {
          if (DOM.verifySurnameInput) DOM.verifySurnameInput.value = 'Toriola';
          if (DOM.verifyIdInput) DOM.verifyIdInput.value = '8842';
          renderVerifyResult('Toriola', '8842');
        });
      }
      const btnStaff2 = document.getElementById('btn-fill-staff-2');
      if (btnStaff2) {
        btnStaff2.addEventListener('click', () => {
          if (DOM.verifySurnameInput) DOM.verifySurnameInput.value = 'Okon';
          if (DOM.verifyIdInput) DOM.verifyIdInput.value = '4456';
          renderVerifyResult('Okon', '4456');
        });
      }
      return;
    }

    const initials = staff.fullName.split(' ').map(n => n[0]).join('').substring(0, 2);

    DOM.verifyResultContainer.innerHTML = `
      <div class="staff-card">
        <div class="staff-avatar-box">${initials}</div>
        <div class="staff-info-col" style="flex:1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <h3>${staff.fullName}</h3>
            <span class="badge-connected" style="display:flex; align-items:center; gap:4px;">
              <span>&#10003;</span> ${staff.status}
            </span>
          </div>
          <div class="staff-role">${staff.designation}</div>
          <div style="font-size: 13px; color: var(--navy); font-weight: 500;">
            <strong>Department:</strong> ${staff.dept}
          </div>
          
          <div class="staff-meta-row">
            <div><strong>Staff ID:</strong> ${staff.staffId}</div>
            <div><strong>Email:</strong> ${staff.email}</div>
            <div><strong>Location:</strong> ${staff.location}</div>
          </div>

          <div style="margin-top: 12px; padding: 8px 12px; background: rgba(34,197,94,0.08); border-radius: var(--radius-sm); border: 1px solid rgba(34,197,94,0.25); font-size: 11.5px; color: #166534;">
            Official Digital Identification valid for enterprise representation, procurement verification, and customer engagements.
          </div>
        </div>
      </div>
    `;
  }

  // Handle Verify Form Submission from Card
  function initVerifyForm() {
    if (!DOM.verifyForm) return;

    DOM.verifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const surname = DOM.verifySurnameInput.value.trim();
      const staffId = DOM.verifyIdInput.value.trim();
      renderVerifyResult(surname, staffId);
      openModal(DOM.modalVerifyResult);
    });

    // Demo auto-fill chip 1
    const chipVerifyDemo1 = document.getElementById('chip-verify-demo-1');
    if (chipVerifyDemo1) {
      chipVerifyDemo1.addEventListener('click', () => {
        if (DOM.verifySurnameInput) DOM.verifySurnameInput.value = 'Toriola';
        if (DOM.verifyIdInput) DOM.verifyIdInput.value = '8842';
        renderVerifyResult('Toriola', '8842');
        openModal(DOM.modalVerifyResult);
      });
    }

    // Demo auto-fill chip 2
    const chipVerifyDemo2 = document.getElementById('chip-verify-demo-2');
    if (chipVerifyDemo2) {
      chipVerifyDemo2.addEventListener('click', () => {
        if (DOM.verifySurnameInput) DOM.verifySurnameInput.value = 'Okon';
        if (DOM.verifyIdInput) DOM.verifyIdInput.value = '4456';
        renderVerifyResult('Okon', '4456');
        openModal(DOM.modalVerifyResult);
      });
    }
  }

  // Render Connected Organizations Directory Table
  function renderDirectoryTable() {
    if (!DOM.directoryTableBody || !window.CICOD_PORTAL_DATA) return;
    let orgs = window.CICOD_PORTAL_DATA.b2bOrganizations;

    if (DOM.directorySearchInput && DOM.directorySearchInput.value.trim()) {
      const q = DOM.directorySearchInput.value.toLowerCase().trim();
      orgs = orgs.filter(o => 
        o.name.toLowerCase().includes(q) || 
        o.industry.toLowerCase().includes(q) || 
        o.location.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q)
      );
    }

    DOM.directoryTableBody.innerHTML = orgs.map(org => {
      let badgeClass = 'badge-available';
      if (org.status === 'Connected') badgeClass = 'badge-connected';
      if (org.status === 'Connect Pending') badgeClass = 'badge-pending';

      return `
        <tr>
          <td>
            <strong style="color:var(--navy); font-size:13.5px;">${org.name}</strong><br>
            <span style="font-size:11px; color:var(--text-muted); font-family:monospace;">${org.code}</span>
          </td>
          <td>${org.industry}</td>
          <td>${org.location}</td>
          <td><span class="${badgeClass}">${org.status}</span></td>
          <td style="text-align: right;">
            <button type="button" class="btn-primary" style="height: 30px; font-size: 11.5px; padding: 0 12px; display:inline-flex;" onclick="window.initiateInterOrgRequest('${org.name}')">
              Connect &rarr;
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Inter-Org Initiation from directory
  window.initiateInterOrgRequest = function (orgName) {
    closeModal(DOM.modalDirectory);
    openRequestFormForService('srv-1'); // Default to Customer Inquiry & Service Request
    const subjInput = document.getElementById('request-subject');
    if (subjInput) subjInput.value = `Inter-Org Collaboration: Request to ${orgName}`;
    const orgInput = document.getElementById('applicant-org');
    if (orgInput) orgInput.value = orgName;
  };

  // Search input listeners
  function initSearchInputs() {
    if (DOM.serviceSearchInput) {
      DOM.serviceSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderServiceList();
      });
    }

    if (DOM.directorySearchInput) {
      DOM.directorySearchInput.addEventListener('input', () => {
        renderDirectoryTable();
      });
    }
  }

  // Initialize Whole Application on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initModals();
    renderCategoryPills();
    renderServiceList();
    initRequestSubmission();
    initTrackingForm();
    initVerifyForm();
    initSearchInputs();
  });

})();

