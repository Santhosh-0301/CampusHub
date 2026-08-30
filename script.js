/* ==========================================================
   CampusHub – script.js
   Vanilla JS for login, tab switching, data rendering,
   filtering, theme toggle, and localStorage persistence.
   ========================================================== */

// ===================== DATA =====================

/** Courses array – used on the Courses and other tabs */
const courses = [
  { name: 'Full Stack Web Development', faculty: 'Dr. P. Hariharan', credits: 4, status: 'Active' },
  { name: 'Database Management Systems', faculty: 'Prof. S. Kumar', credits: 3, status: 'Active' },
  { name: 'Data Structures', faculty: 'Dr. P. Latha', credits: 3, status: 'Active' },
  { name: 'Computer Networks', faculty: 'Prof. K. Rajan', credits: 4, status: 'Active' },
  { name: 'Operating Systems', faculty: 'Dr. V. Priya', credits: 3, status: 'Active' },
  { name: 'Software Engineering', faculty: 'Prof. M. Anand', credits: 3, status: 'Active' }
];

/** Subject-wise attendance data */
const attendanceData = [
  { subject: 'Full Stack Web Development', percent: 90 },
  { subject: 'Database Management Systems', percent: 84 },
  { subject: 'Data Structures', percent: 88 },
  { subject: 'Computer Networks', percent: 79 },
  { subject: 'Operating Systems', percent: 86 }
];

/** All assignments */
const assignments = [
  { name: 'Mini Project – Student Dashboard', subject: 'Full Stack Web Development', due: '30 Aug 2026', status: 'Pending' },
  { name: 'ER Diagram Design', subject: 'Database Management Systems', due: '02 Sep 2026', status: 'Pending' },
  { name: 'Socket Programming Lab', subject: 'Computer Networks', due: '05 Sep 2026', status: 'Pending' },
  { name: 'Linked List Implementation', subject: 'Data Structures', due: '20 Aug 2026', status: 'Completed' },
  { name: 'Normalization Exercise', subject: 'Database Management Systems', due: '15 Aug 2026', status: 'Completed' },
  { name: 'TCP/IP Model Report', subject: 'Computer Networks', due: '10 Aug 2026', status: 'Completed' },
  { name: 'Process Scheduling Simulation', subject: 'Operating Systems', due: '08 Aug 2026', status: 'Completed' },
  { name: 'SRS Document', subject: 'Software Engineering', due: '05 Aug 2026', status: 'Completed' },
  { name: 'Stack using Array', subject: 'Data Structures', due: '01 Aug 2026', status: 'Completed' },
  { name: 'Relational Algebra Worksheet', subject: 'Database Management Systems', due: '28 Jul 2026', status: 'Completed' },
  { name: 'Subnetting Practice', subject: 'Computer Networks', due: '25 Jul 2026', status: 'Completed' },
  { name: 'Page Replacement Algorithms', subject: 'Operating Systems', due: '22 Jul 2026', status: 'Completed' },
  { name: 'Agile Methodology Essay', subject: 'Software Engineering', due: '18 Jul 2026', status: 'Completed' },
  { name: 'Binary Tree Traversal', subject: 'Data Structures', due: '15 Jul 2026', status: 'Completed' },
  { name: 'SQL Queries Assignment', subject: 'Database Management Systems', due: '10 Jul 2026', status: 'Completed' }
];

/** Recent assignments shown on the Dashboard tab (top 3) */
const recentAssignments = [
  { name: 'Full Stack Web Development', due: 'Due: 30 Aug 2026', status: 'Pending' },
  { name: 'Database Management Systems', due: 'Due: 02 Sep 2026', status: 'Pending' },
  { name: 'Computer Networks', due: 'Completed', status: 'Completed' }
];

/** Recent activity feed */
const recentActivity = [
  'Submitted DBMS assignment',
  'Attended Full Stack class',
  'Updated profile',
  'Completed Data Structures lab',
  'Enrolled in Software Engineering'
];


// ===================== DOM REFERENCES =====================

const loginPage = document.getElementById('login-page');
const app = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const loginNameInput = document.getElementById('login-name');
const loginRegInput = document.getElementById('login-reg');
const nameError = document.getElementById('name-error');
const regError = document.getElementById('reg-error');

const sidebar = document.getElementById('sidebar');
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const tabContents = document.querySelectorAll('.tab-content');

const welcomeText = document.getElementById('welcome-text');
const badgeName = document.getElementById('badge-name');
const badgeReg = document.getElementById('badge-reg');

// Theme toggles (three locations)
const themeToggleSidebar = document.getElementById('theme-toggle-sidebar');
const themeToggleTopbar = document.getElementById('theme-toggle-topbar');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

// Logout
const logoutBtn = document.getElementById('logout-sidebar');

// Mobile
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-nav-overlay');

// Profile
const profileName = document.getElementById('profile-name');
const profileReg = document.getElementById('profile-reg');
const profileAvatar = document.getElementById('profile-avatar');
const profileEmail = document.getElementById('profile-email');
const editProfileBtn = document.getElementById('edit-profile-btn');
const editModal = document.getElementById('edit-modal-overlay');
const editForm = document.getElementById('edit-profile-form');
const editNameInput = document.getElementById('edit-name');
const editCancelBtn = document.getElementById('edit-cancel');

// Dashboard counts
const avgAttendance = document.getElementById('avg-attendance');
const totalCourses = document.getElementById('total-courses');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

// Assignment filter
const filterGroup = document.getElementById('filter-group');


// ===================== THEME =====================

/**
 * Apply the saved theme from localStorage or default to light.
 */
function applySavedTheme() {
  const theme = localStorage.getItem('campushub-theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
}

/** Toggle between light and dark theme */
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('campushub-theme', isDark ? 'dark' : 'light');
}

// Attach theme toggle to all three buttons
themeToggleSidebar.addEventListener('click', toggleTheme);
themeToggleTopbar.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);


// ===================== LOGIN =====================

/**
 * Check if the user is already logged in via localStorage.
 * If so, go straight to the dashboard.
 */
function checkLogin() {
  const name = localStorage.getItem('campushub-name');
  const reg = localStorage.getItem('campushub-reg');
  if (name && reg) {
    showDashboard(name, reg);
  }
}

/**
 * Handle login form submission.
 * Validates that both fields are filled, stores values in
 * localStorage, and opens the dashboard.
 */
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Reset errors
  nameError.textContent = '';
  regError.textContent = '';

  const name = loginNameInput.value.trim();
  const reg = loginRegInput.value.trim();
  let valid = true;

  if (!name) {
    nameError.textContent = 'Please enter your name.';
    valid = false;
  }
  if (!reg) {
    regError.textContent = 'Please enter your register number.';
    valid = false;
  }

  if (!valid) return;

  // Store login info
  localStorage.setItem('campushub-name', name);
  localStorage.setItem('campushub-reg', reg);

  showDashboard(name, reg);
});


// ===================== SHOW / HIDE DASHBOARD =====================

/**
 * Transition from the login page to the dashboard.
 * Populates user-specific fields with the student's name and
 * register number.
 */
function showDashboard(name, reg) {
  loginPage.classList.add('hidden');
  app.classList.remove('hidden');

  // Populate user info throughout the dashboard
  welcomeText.textContent = `Welcome back, ${name}`;
  badgeName.textContent = name;
  badgeReg.textContent = reg;
  profileName.textContent = name;
  profileReg.textContent = reg;
  profileAvatar.textContent = name.charAt(0).toUpperCase();

  // Build a realistic email from the register number
  profileEmail.textContent = `${reg.toLowerCase()}@university.edu`;

  // Render all dynamic sections
  renderDashboardStats();
  renderRecentAssignments();
  renderRecentActivity();
  renderCourses();
  renderAttendance();
  renderAssignments('all');
}


// ===================== TAB SWITCHING =====================

/**
 * Handle sidebar navigation clicks.
 * Hides all tab sections and shows the one matching
 * the clicked item's data-tab attribute.
 */
navItems.forEach(function (item) {
  item.addEventListener('click', function () {
    const tab = this.getAttribute('data-tab');
    switchTab(tab);

    // Close mobile sidebar if open
    closeMobileSidebar();
  });
});

/**
 * Switch the active tab.
 * @param {string} tabName – must match a data-tab value and tab-* id
 */
function switchTab(tabName) {
  // Update active nav item
  navItems.forEach(function (item) {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabName);
  });

  // Show the matching tab content, hide the rest
  tabContents.forEach(function (tc) {
    if (tc.id === 'tab-' + tabName) {
      tc.classList.add('active');
      // Re-trigger the fade-in animation
      tc.style.animation = 'none';
      // Force reflow so the animation restarts
      void tc.offsetWidth;
      tc.style.animation = '';
    } else {
      tc.classList.remove('active');
    }
  });

  // Re-animate attendance bars when switching to Attendance tab
  if (tabName === 'attendance') {
    animateAttendanceBars();
  }
}


// ===================== MOBILE SIDEBAR =====================

/** Open the sidebar on mobile devices */
hamburger.addEventListener('click', function () {
  sidebar.classList.add('open');
  mobileOverlay.classList.remove('hidden');
});

/** Close the sidebar when tapping the overlay */
mobileOverlay.addEventListener('click', closeMobileSidebar);

function closeMobileSidebar() {
  sidebar.classList.remove('open');
  mobileOverlay.classList.add('hidden');
}


// ===================== RENDER: DASHBOARD STATS =====================

/**
 * Calculate and display the four summary cards on the
 * Dashboard tab based on the data arrays.
 */
function renderDashboardStats() {
  // Average attendance
  const total = attendanceData.reduce(function (sum, a) { return sum + a.percent; }, 0);
  const avg = Math.round(total / attendanceData.length);
  avgAttendance.textContent = avg + '%';

  // Total courses
  totalCourses.textContent = courses.length;

  // Pending & completed assignments
  const pending = assignments.filter(function (a) { return a.status === 'Pending'; }).length;
  const completed = assignments.filter(function (a) { return a.status === 'Completed'; }).length;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}


// ===================== RENDER: RECENT ASSIGNMENTS =====================

/**
 * Render the "Recent Assignments" list on the Dashboard tab.
 * Uses the recentAssignments array to build list items.
 */
function renderRecentAssignments() {
  const list = document.getElementById('recent-assignments');
  list.innerHTML = '';

  recentAssignments.forEach(function (item) {
    const li = document.createElement('li');

    const infoDiv = document.createElement('div');
    infoDiv.className = 'recent-item-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'recent-item-name';
    nameSpan.textContent = item.name;

    const dueSpan = document.createElement('span');
    dueSpan.className = 'recent-item-due';
    dueSpan.textContent = item.due;

    infoDiv.appendChild(nameSpan);
    infoDiv.appendChild(dueSpan);

    const badge = document.createElement('span');
    badge.className = 'status-badge ' +
      (item.status === 'Completed' ? 'status-completed' : 'status-pending');
    badge.textContent = item.status;

    li.appendChild(infoDiv);
    li.appendChild(badge);
    list.appendChild(li);
  });
}


// ===================== RENDER: RECENT ACTIVITY =====================

/**
 * Render the "Recent Activity" timeline on the Dashboard tab.
 */
function renderRecentActivity() {
  const list = document.getElementById('recent-activity');
  list.innerHTML = '';

  recentActivity.forEach(function (text) {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}


// ===================== RENDER: COURSES TABLE =====================

/**
 * Populate the courses table body from the courses array.
 */
function renderCourses() {
  const tbody = document.getElementById('courses-tbody');
  tbody.innerHTML = '';

  courses.forEach(function (course, index) {
    const tr = document.createElement('tr');

    const tdNum = document.createElement('td');
    tdNum.textContent = index + 1;

    const tdName = document.createElement('td');
    tdName.textContent = course.name;

    const tdFaculty = document.createElement('td');
    tdFaculty.textContent = course.faculty;

    const tdCredits = document.createElement('td');
    tdCredits.textContent = course.credits;

    const tdStatus = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'status-badge status-completed';
    badge.textContent = course.status;
    tdStatus.appendChild(badge);

    tr.appendChild(tdNum);
    tr.appendChild(tdName);
    tr.appendChild(tdFaculty);
    tr.appendChild(tdCredits);
    tr.appendChild(tdStatus);
    tbody.appendChild(tr);
  });
}


// ===================== RENDER: ATTENDANCE =====================

/**
 * Generate the attendance progress bars from attendanceData.
 */
function renderAttendance() {
  const container = document.getElementById('attendance-list');
  container.innerHTML = '';

  attendanceData.forEach(function (item) {
    const div = document.createElement('div');
    div.className = 'attendance-item';

    const header = document.createElement('div');
    header.className = 'attendance-subject';

    const subjectSpan = document.createElement('span');
    subjectSpan.textContent = item.subject;

    const percentSpan = document.createElement('span');
    percentSpan.className = 'attendance-percent';
    percentSpan.textContent = item.percent + '%';

    header.appendChild(subjectSpan);
    header.appendChild(percentSpan);

    const track = document.createElement('div');
    track.className = 'bar-track';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.setAttribute('data-percent', item.percent);
    // Width starts at 0 and is animated in animateAttendanceBars()
    fill.style.width = '0%';

    track.appendChild(fill);
    div.appendChild(header);
    div.appendChild(track);
    container.appendChild(div);
  });
}

/**
 * Animate the attendance bars so they fill to their
 * target width with a smooth transition.
 */
function animateAttendanceBars() {
  const fills = document.querySelectorAll('.bar-fill');
  // Small delay so the transition is visible
  setTimeout(function () {
    fills.forEach(function (fill) {
      fill.style.width = fill.getAttribute('data-percent') + '%';
    });
  }, 50);
}


// ===================== RENDER: ASSIGNMENTS =====================

/**
 * Render assignment cards, optionally filtered by status.
 * @param {string} filter – 'all', 'Pending', or 'Completed'
 */
function renderAssignments(filter) {
  const container = document.getElementById('assignments-list');
  container.innerHTML = '';

  const filtered = (filter === 'all')
    ? assignments
    : assignments.filter(function (a) { return a.status === filter; });

  filtered.forEach(function (item) {
    const card = document.createElement('div');
    card.className = 'assignment-card';

    // Left side info
    const info = document.createElement('div');
    info.className = 'assignment-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'assignment-name';
    nameSpan.textContent = item.name;

    const subjectSpan = document.createElement('span');
    subjectSpan.className = 'assignment-subject';
    subjectSpan.textContent = item.subject;

    info.appendChild(nameSpan);
    info.appendChild(subjectSpan);

    // Right side: due date + badge
    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.style.alignItems = 'center';
    rightDiv.style.gap = '0.75rem';

    const dueSpan = document.createElement('span');
    dueSpan.className = 'assignment-due';
    dueSpan.textContent = 'Due: ' + item.due;

    const badge = document.createElement('span');
    badge.className = 'status-badge ' +
      (item.status === 'Completed' ? 'status-completed' : 'status-pending');
    badge.textContent = item.status;

    rightDiv.appendChild(dueSpan);
    rightDiv.appendChild(badge);

    card.appendChild(info);
    card.appendChild(rightDiv);
    container.appendChild(card);
  });
}

/** Assignment filter button clicks */
filterGroup.addEventListener('click', function (e) {
  if (!e.target.classList.contains('filter-btn')) return;

  // Update active filter button
  filterGroup.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');

  // Re-render assignments with the selected filter
  const filter = e.target.getAttribute('data-filter');
  renderAssignments(filter);
});


// ===================== PROFILE: EDIT =====================

/** Open the Edit Profile modal */
editProfileBtn.addEventListener('click', function () {
  editNameInput.value = localStorage.getItem('campushub-name') || '';
  editModal.classList.remove('hidden');
});

/** Close modal on Cancel */
editCancelBtn.addEventListener('click', function () {
  editModal.classList.add('hidden');
});

/** Close modal when clicking outside */
editModal.addEventListener('click', function (e) {
  if (e.target === editModal) {
    editModal.classList.add('hidden');
  }
});

/** Save edited profile name */
editForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const newName = editNameInput.value.trim();
  if (!newName) return;

  // Update localStorage
  localStorage.setItem('campushub-name', newName);

  // Update all places displaying the name
  const reg = localStorage.getItem('campushub-reg');
  welcomeText.textContent = `Welcome back, ${newName}`;
  badgeName.textContent = newName;
  profileName.textContent = newName;
  profileAvatar.textContent = newName.charAt(0).toUpperCase();

  editModal.classList.add('hidden');
});


// ===================== LOGOUT =====================

logoutBtn.addEventListener('click', function () {
  if (confirm('Are you sure you want to logout?')) {
    // Clear login data
    localStorage.removeItem('campushub-name');
    localStorage.removeItem('campushub-reg');

    // Return to login screen
    app.classList.add('hidden');
    loginPage.classList.remove('hidden');

    // Reset form
    loginForm.reset();
    nameError.textContent = '';
    regError.textContent = '';

    // Reset to dashboard tab for next login
    switchTab('dashboard');
  }
});


// ===================== INITIALISE =====================

// Apply theme preference before anything renders
applySavedTheme();

// Check if user is already logged in
checkLogin();
