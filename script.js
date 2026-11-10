const courses = [
  ["NSG 3405", "Healthcare Policy and Finance", "16D01", "lecture"],
  ["NSG 3405", "Healthcare Policy and Finance LAB", "16D01", "lab"],
  ["NSG 3450", "Nursing Practice - Mental Health", "16D01", "lecture"],
  ["NSG 3450", "Nursing Practice - Mental Health (CL)", "16D02", "clinical"],
  ["NSG 3480", "Nursing Practice - Community Health", "16D01", "lecture"],
  ["NSG 3480", "Nursing Practice - Community Health (CL)", "16D02", "clinical"]
];

const sampleGrades = {
  0: [87, 86],
  2: [84, 82],
  4: [85, 88]
};

let page = "dashboard";
let selected = 0;
let whatIf = false;
let gradedOnly = true;
let selectedDay = 10;

const app = document.getElementById("app");

function header(title) {
  return `
    <div class="header">
      <button class="back" onclick="goBack()">‹</button>
      <h2>${title}</h2>
    </div>
  `;
}

function nav() {
  const names = [
    "Dashboard", "Calendar", "To-do",
    "Notifications", "Inbox"
  ];
  const icons = ["◉", "▦", "☷", "♧", "✉"];

  return `
    <div class="bottom">
      ${names.map((name, i) => `
        <div class="nav ${i === 0 ? "active" : ""}"
             onclick="showDashboard()">
          <b>${icons[i]}</b>
          ${name}
        </div>
      `).join("")}
    </div>
  `;
}

function getExamScores(courseIndex) {
  const firstTwo = sampleGrades[courseIndex] || [];
  return [
    firstTwo[0] ?? null,
    firstTwo[1] ?? null,
    null,
    null
  ];
}

function assignment(name, max, value, isExam = false) {
  const hasGrade = value !== null &&
    value !== undefined && value !== "";

  return `
    <div class="assignment" style="
      padding:18px 20px;
      border-bottom:1px solid #e6e8eb;
    ">
      <div style="
        display:flex;
        align-items:flex-start;
        gap:13px;
      ">
        <div style="
          width:38px;height:38px;flex-shrink:0;
          background:#eef4f8;color:#28769b;
          border-radius:11px;display:grid;
          place-items:center;font-size:20px;
        ">▤</div>

        <div style="flex:1;min-width:0">
          <div class="assignment-title"
               style="margin-bottom:5px">
            ${name}
          </div>

          <div class="muted small">No Due Date</div>

          <div style="
            display:flex;align-items:center;
            justify-content:space-between;
            gap:10px;margin-top:13px;
          ">
            <span class="small" style="
              color:${hasGrade ? "#16824b" : "#78828c"};
            ">
              ${hasGrade ? "✓ Graded" : "○ Not Submitted"}
            </span>

            <span style="font-weight:600">
              ${hasGrade ? value : "—"}
              <span class="muted">/ ${max}</span>
            </span>
          </div>

          ${isExam
            ? `<div class="muted small"
                    style="margin-top:8px">
                 Weight: 25% of exam average
               </div>`
            : ""}
        </div>
      </div>
    </div>
  `;
}

function courseMenuItem(item) {
  const icons = {
    "Home": "⌂",
    "Announcements": "◉",
    "Modules": "▤",
    "Collaborations": "♧",
    "Grades": "▥",
    "Syllabus": "▧",
    "Office 365": "▦",
    "Exam Report": "◫",
    "Galen All Access": "◇",
    "My Advisor": "♙",
    "Student Survey (Qualtrics)": "☷",
    "Lucid (Whiteboard)": "✎",
    "ReadSpeaker TextAid": "◖",
    "Zoom": "▣",
    "Academic Writer": "▤"
  };

  const action =
    item === "Grades"
      ? "openGrades()"
      : item === "Modules" || item === "Home"
      ? "openModules()"
      : "";

  return `
    <div onclick="${action}" style="
      display:flex;align-items:center;gap:15px;
      padding:17px 19px;background:white;
      border-bottom:1px solid #edf0f2;
      cursor:${action ? "pointer" : "default"};
      min-height:69px;
    ">
      <div style="
        width:39px;height:39px;border-radius:11px;
        background:#edf3f7;color:#28769b;
        display:grid;place-items:center;
        flex-shrink:0;font-size:21px;
      ">${icons[item] || "▤"}</div>

      <span style="
        flex:1;font-size:15px;
        font-weight:500;line-height:1.4;
      ">${item}</span>

      <span style="color:#8c96a0;font-size:24px">›</span>
    </div>
  `;
}

function render() {
  let html = '<div class="demo">•</div>';

  if (page === "dashboard") {
    html += `
      <div class="dashboard-header">
        <button aria-label="Menu">☰</button>
        <div class="dashboard-logo"></div>
        <button aria-label="Settings">⚙</button>
      </div>

      <div class="content">
        <div class="dashboard-welcome">
          <h1>Good morning!</h1>
          <p>You belong here.</p>
        </div>

        <div class="dashboard-section">
          <h3>Courses (${courses.length})</h3>
        </div>
    `;

    courses.forEach((c, i) => {
      html += `
        <div class="dashboard-course"
             onclick="openCourse(${i})">
          <div class="dashboard-course-icon">
            ${c[0]}
          </div>
          <div class="dashboard-course-info">
            <strong>
              0725 ${c[0]} - ${c[2]} ${c[1]}
            </strong>
            <p>2026 Winter Quarter</p>
          </div>
          <div class="dashboard-arrow">›</div>
        </div>
      `;
    });

    html += `
        <div class="center">
          <button class="pink">All Courses ›</button>
        </div>

        <div class="dashboard-section">
          <h3>Weekly Summary</h3>
        </div>

        <div class="dashboard-summary">
          <div class="dashboard-summary-date">
            Nov 8 – Nov 14
          </div>
          <div class="dashboard-stats">
            <div><strong>0</strong><span>Missing</span></div>
            <div><strong>0</strong><span>Due</span></div>
            <div><strong>0</strong><span>New Grades</span></div>
          </div>
        </div>

        <div class="dashboard-section">
          <h3>Daily To-do</h3>
          <span class="muted">November 2026</span>
        </div>

        <div class="dashboard-calendar">
          ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
            .map((day, i) => {
              const date = 8 + i;
              return `
                <div class="calendar-day
                     ${selectedDay === date ? "selected" : ""}"
                     onclick="selectDay(${date})">
                  ${day}
                  <strong>${date}</strong>
                </div>
              `;
            }).join("")}
        </div>

        <div class="card center">
          <p class="muted">No tasks for this day</p>
        </div>
      </div>
    `;
  }

  if (page === "course") {
    const c = courses[selected];
    const isLecture = c[3] === "lecture";

    html += header(
      `0725-${c[0].replace(" ", "")}-${c[2]}`
    );

    html += `
      <div class="content" style="padding-bottom:0">
        <div style="
          height:200px;
          background:linear-gradient(135deg,#6a7e8e,#487b98);
          border-radius:19px;padding:23px;color:white;
          display:flex;flex-direction:column;
          justify-content:flex-end;
          box-shadow:0 5px 15px #00000012;
        ">
          <div style="
            font-size:12px;letter-spacing:1px;
            text-transform:uppercase;
            opacity:.9;margin-bottom:10px;
          ">
            ${isLecture
              ? "Lecture"
              : c[3] === "lab"
              ? "Laboratory"
              : "Clinical"}
          </div>

          <h2 style="
            font-size:20px;line-height:1.35;
            margin:0 0 10px;
          ">
            0725 ${c[0]} - ${c[2]} ${c[1]}
          </h2>

          <div style="font-size:13px;opacity:.9">
            2026 Winter Quarter
          </div>
        </div>

        <div style="
          margin:22px 0 15px;display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <h3 style="margin:0;font-size:18px">
            Course Navigation
          </h3>
          <span class="muted small">
            ${isLecture ? "Lecture" : "Course"}
          </span>
        </div>
      </div>
    `;

    const items = isLecture
      ? [
          "Home","Announcements","Modules",
          "Collaborations","Grades","Office 365",
          "Exam Report","Galen All Access",
          "My Advisor","Student Survey (Qualtrics)",
          "Lucid (Whiteboard)","ReadSpeaker TextAid",
          "Zoom","Academic Writer"
        ]
      : [
          "Home","Grades","Syllabus",
          "Collaborations","Office 365",
          "Exam Report","Galen All Access",
          "My Advisor","Student Survey (Qualtrics)",
          "Lucid (Whiteboard)","ReadSpeaker TextAid",
          "Zoom","Academic Writer"
        ];

    html += `
      <div style="
        margin:0 18px 25px;border-radius:18px;
        overflow:hidden;background:white;
        box-shadow:0 2px 12px #0000000a;
      ">
        ${items.map(courseMenuItem).join("")}
      </div>
    `;
  }

  if (page === "modules") {
    html += header("Modules");

    html += `
      <div class="content">
        <h3>Course Modules</h3>
    `;

    for (let w = 1; w <= 11; w++) {
      html += `
        <div class="card" onclick="toggleModule(${w})">
          <strong>Week ${w}</strong>
          <span style="float:right">⌄</span>
          <div id="module${w}"
               style="display:none;margin-top:15px">
            <div class="module">Week ${w} Overview</div>
            <div class="module">Learning Materials</div>
            <div class="module">Weekly Activities</div>
          </div>
        </div>
      `;
    }

    html += "</div>";
  }

  if (page === "grades") {
    const c = courses[selected];
    const isLabOrClinical = c[3] !== "lecture";
    const exams = ["Exam 1","Exam 2","Exam 3","Final"];
    const values = getExamScores(selected);

    const completed = values.filter(
      v => v !== null
    );

    const average = completed.length
      ? completed.reduce(
          (sum, value) => sum + value, 0
        ) / (gradedOnly ? completed.length : 4)
      : null;

    html += header("Grades");

    html += `
      <div class="content">
        <div class="card" style="
          border-radius:19px;padding:22px;margin-top:4px;
        ">
          <div class="total">
            <span class="muted">Total</span>
            <strong style="color:#263b4d">
              ${isLabOrClinical || average === null
                ? "N/A"
                : average.toFixed(1) + "%"}
            </strong>
          </div>

          ${!isLabOrClinical
            ? `
              <div class="muted small"
                   style="margin-top:9px">
                Sample exam average ·
                ${completed.length} of 4 graded
              </div>
            `
            : ""}
        </div>

        <div class="toggle">
          <span>Based on graded assignments</span>
          <input type="checkbox"
                 ${gradedOnly ? "checked" : ""}
                 onchange="gradedOnly=this.checked;render()">
        </div>

        <div class="toggle">
          <span>Show What-if Score</span>
          <input type="checkbox"
                 ${whatIf ? "checked" : ""}
                 onchange="whatIf=this.checked;render()">
        </div>
      </div>
    `;

    if (isLabOrClinical) {
      html += `
        <div class="empty">
          <div class="emoji">🚀</div>
          <h2>No Assignments</h2>
          <p class="muted">
            It looks like assignments haven't been
            created in this space yet.
          </p>
        </div>
      `;
    } else {
      html += `
        <div style="
          padding:18px 20px 12px;
          font-weight:650;font-size:18px;
        ">Exams</div>
        <div class="menu" style="margin-top:0">
      `;

      exams.forEach((name, i) => {
        html += assignment(
          name, 100, values[i], true
        );
      });

      html += "</div>";

      if (selected === 2 || selected === 4) {
        html += `
          <div style="
            padding:25px 20px 12px;
            font-weight:650;font-size:18px;
          ">Weekly Activities</div>
          <div class="menu" style="margin-top:0">
        `;

        for (let w = 1; w <= 11; w++) {
          html += assignment(
            `Beginning of Week ${w} Quiz`,
            10, null
          );
          html += assignment(
            `End of Week ${w} Quiz`,
            10, null
          );
          html += assignment(
            `Case Study - Week ${w}`,
            10, null
          );
        }

        html += "</div>";
      }
    }
  }

  app.innerHTML = `<div class="app">${html}${nav()}</div>`;
}

function selectDay(day) {
  selectedDay = day;
  render();
}

function toggleModule(w) {
  const el = document.getElementById("module" + w);

  if (el) {
    el.style.display =
      el.style.display === "none" ? "block" : "none";
  }
}

function openCourse(i) {
  selected = i;
  page = "course";
  render();
  window.scrollTo(0, 0);
}

function openGrades() {
  page = "grades";
  render();
  window.scrollTo(0, 0);
}

function openModules() {
  page = "modules";
  render();
  window.scrollTo(0, 0);
}

function showDashboard() {
  page = "dashboard";
  render();
  window.scrollTo(0, 0);
}

function goBack() {
  page = page === "course" ? "dashboard" : "course";
  render();
  window.scrollTo(0, 0);
}

render();
