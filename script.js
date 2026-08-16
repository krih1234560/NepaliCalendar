import {
  bsFromDate,
  dateFromBs,
  todayBs
} from "@grahan/calendars";

const MIN_BS_YEAR = 1975;
const MAX_BS_YEAR = 2100;

const MONTHS = [
  { np: "बैशाख", en: "Baisakh" },
  { np: "जेठ", en: "Jestha" },
  { np: "असार", en: "Asar" },
  { np: "श्रावण", en: "Shrawan" },
  { np: "भदौ", en: "Bhadra" },
  { np: "आश्विन", en: "Ashwin" },
  { np: "कार्तिक", en: "Kartik" },
  { np: "मंसिर", en: "Mangsir" },
  { np: "पौष", en: "Poush" },
  { np: "माघ", en: "Magh" },
  { np: "फाल्गुण", en: "Falgun" },
  { np: "चैत्र", en: "Chaitra" }
];

const WEEKDAYS = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि"
];

const DEVANAGARI = [
  "०",
  "१",
  "२",
  "३",
  "४",
  "५",
  "६",
  "७",
  "८",
  "९"
];

let currentYear = 2083;
let currentMonth = 5;
let selectedDay = null;

let festivals = {};
let holidays = {};


/* =========================
   NUMBER / DATE FUNCTIONS
========================= */

function nepaliNumber(number) {
  return String(number)
    .split("")
    .map(digit => DEVANAGARI[Number(digit)] ?? digit)
    .join("");
}


function formatBsDate(year, month, day) {
  return `${nepaliNumber(day)} ${
    MONTHS[month - 1].np
  } ${nepaliNumber(year)}`;
}


function bsDateToAd(year, month, day) {
  return dateFromBs({
    year,
    month,
    day
  });
}


function adDateToBs(year, month, day) {
  return bsFromDate({
    year,
    month,
    day
  });
}


function getEvents(year, month, day) {
  const key =
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return [
    ...(festivals[key] || []),
    ...(holidays[key] || [])
  ];
}


/* =========================
   MOON PHASE
========================= */

function moonPhase(date) {
  const knownNewMoon = Date.UTC(
    2000,
    0,
    6,
    18,
    14
  );

  const lunarCycle = 29.530588853;

  const days =
    (date.getTime() - knownNewMoon) /
    86400000;

  const age =
    (
      (days % lunarCycle) +
      lunarCycle
    ) % lunarCycle;


  if (age < 1.85) {
    return {
      icon: "🌑",
      name: "New Moon",
      np: "औंसी"
    };
  }


  if (age < 7.38) {
    return {
      icon: "🌒",
      name: "Waxing Crescent",
      np: "शुक्ल पक्ष"
    };
  }


  if (age < 9.23) {
    return {
      icon: "🌓",
      name: "First Quarter",
      np: "अर्धचन्द्र"
    };
  }


  if (age < 14.77) {
    return {
      icon: "🌔",
      name: "Waxing Gibbous",
      np: "पूर्णिमा नजिक"
    };
  }


  if (age < 16.62) {
    return {
      icon: "🌕",
      name: "Full Moon",
      np: "पूर्णिमा"
    };
  }


  if (age < 22.15) {
    return {
      icon: "🌖",
      name: "Waning Gibbous",
      np: "कृष्ण पक्ष"
    };
  }


  if (age < 23.99) {
    return {
      icon: "🌗",
      name: "Last Quarter",
      np: "अर्धचन्द्र"
    };
  }


  return {
    icon: "🌘",
    name: "Waning Crescent",
    np: "औंसी नजिक"
  };
}


/* =========================
   CALENDAR HELPERS
========================= */

function getMonthLength(year, month) {
  let day = 1;

  while (true) {
    try {
      dateFromBs({
        year,
        month,
        day
      });

      day++;
    } catch {
      return day - 1;
    }
  }
}


function getFirstWeekday(year, month) {
  const ad = bsDateToAd(
    year,
    month,
    1
  );

  return ad.weekday.index;
}


function renderYearSelect() {
  const select =
    document.getElementById("yearSelect");

  if (!select) return;

  select.innerHTML = "";

  for (
    let year = MIN_BS_YEAR;
    year <= MAX_BS_YEAR;
    year++
  ) {
    const option =
      document.createElement("option");

    option.value = year;

    option.textContent =
      `${nepaliNumber(year)} BS (${year})`;

    if (year === currentYear) {
      option.selected = true;
    }

    select.appendChild(option);
  }
}


function renderMonthSelect() {
  const select =
    document.getElementById("monthSelect");

  if (!select) return;

  select.innerHTML = "";

  MONTHS.forEach(
    (month, index) => {
      const option =
        document.createElement("option");

      option.value = index + 1;

      option.textContent =
        `${month.np} (${month.en})`;

      if (
        index + 1 === currentMonth
      ) {
        option.selected = true;
      }

      select.appendChild(option);
    }
  );
}


function renderConverterMonths() {
  const select =
    document.getElementById("bsMonth");

  if (!select) return;

  select.innerHTML = "";

  MONTHS.forEach(
    (month, index) => {
      const option =
        document.createElement("option");

      option.value = index + 1;

      option.textContent =
        `${month.np} (${month.en})`;

      select.appendChild(option);
    }
  );

  select.value = currentMonth;
}


function renderWeekdays() {
  const container =
    document.getElementById("weekdays");

  if (!container) return;

  container.innerHTML =
    WEEKDAYS
      .map(day => `<div>${day}</div>`)
      .join("");
}


/* =========================
   TODAY
========================= */

function isToday(
  year,
  month,
  day
) {
  const now = new Date();

  try {
    const bs = adDateToBs(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );

    return (
      bs.year === year &&
      bs.month === month &&
      bs.day === day
    );
  } catch {
    return false;
  }
}


/* =========================
   RENDER CALENDAR
========================= */

function renderCalendar() {
  const grid =
    document.getElementById("calendarGrid");

  if (!grid) return;

  grid.innerHTML = "";

  let firstWeekday;

  try {
    firstWeekday =
      getFirstWeekday(
        currentYear,
        currentMonth
      );
  } catch (error) {
    grid.innerHTML =
      `<p>Calendar data unavailable.</p>`;

    console.error(error);
    return;
  }


  const days =
    getMonthLength(
      currentYear,
      currentMonth
    );


  /* Empty cells before first day */

  for (
    let i = 0;
    i < firstWeekday;
    i++
  ) {
    const blank =
      document.createElement("div");

    blank.className =
      "calendar-day empty";

    grid.appendChild(blank);
  }


  /* Calendar days */

  for (
    let day = 1;
    day <= days;
    day++
  ) {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "calendar-day";


    const events =
      getEvents(
        currentYear,
        currentMonth,
        day
      );


    /* Today */

    if (
      isToday(
        currentYear,
        currentMonth,
        day
      )
    ) {
      button.classList.add("today");
    }


    /* Selected */

    if (
      selectedDay === day
    ) {
      button.classList.add("selected");
    }


    /* Holiday */

    if (
      events.some(
        event =>
          event.type === "holiday"
      )
    ) {
      button.classList.add("holiday");
    }


    /* Festival */

    if (
      events.some(
        event =>
          event.type === "festival"
      )
    ) {
      button.classList.add("festival");
    }


    /* =========================
       SATURDAY = RED
       IMPORTANT:
       ONLY ONE "const ad"
    ========================= */

    const ad =
      bsDateToAd(
        currentYear,
        currentMonth,
        day
      );

    if (
      ad.weekday.index === 6
    ) {
      button.classList.add("saturday");
    }


    /* Day HTML */

    button.innerHTML = `
      <span class="bs-day">
        ${nepaliNumber(day)}
      </span>

      <small>
        ${ad.day}
      </small>

      ${
        events.length
          ? `<i>●</i>`
          : ""
      }
    `;


    /* Click day */

    button.addEventListener(
      "click",
      () => {
        selectedDay = day;

        renderCalendar();

        showSelectedDate();
      }
    );


    grid.appendChild(button);
  }


  /* Month title */

  const monthNepali =
    document.getElementById(
      "monthNepali"
    );

  if (monthNepali) {
    monthNepali.textContent =
      MONTHS[
        currentMonth - 1
      ].np;
  }


  const monthEnglish =
    document.getElementById(
      "monthEnglish"
    );

  if (monthEnglish) {
    monthEnglish.textContent =
      MONTHS[
        currentMonth - 1
      ].en;
  }


  const yearBadge =
    document.getElementById(
      "yearBadge"
    );

  if (yearBadge) {
    yearBadge.textContent =
      `${nepaliNumber(currentYear)} BS`;
  }


  const calendarTitle =
    document.getElementById(
      "calendarTitle"
    );

  if (calendarTitle) {
    calendarTitle.textContent =
      `Nepali Calendar ${nepaliNumber(currentYear)}`;
  }


  const calendarSubtitle =
    document.getElementById(
      "calendarSubtitle"
    );

  if (calendarSubtitle) {
    calendarSubtitle.textContent =
      `${MONTHS[currentMonth - 1].en} / ${
        MONTHS[currentMonth - 1].np
      } ${currentYear}`;
  }
}


/* =========================
   SELECTED DATE
========================= */

function showSelectedDate() {
  if (!selectedDay) {
    return;
  }


  const ad =
    bsDateToAd(
      currentYear,
      currentMonth,
      selectedDay
    );


  const events =
    getEvents(
      currentYear,
      currentMonth,
      selectedDay
    );


  const moon =
    moonPhase(
      new Date(
        Date.UTC(
          ad.year,
          ad.month - 1,
          ad.day
        )
      )
    );


  const selectedTitle =
    document.getElementById(
      "selectedTitle"
    );

  if (selectedTitle) {
    selectedTitle.textContent =
      formatBsDate(
        currentYear,
        currentMonth,
        selectedDay
      );
  }


  const selectedAd =
    document.getElementById(
      "selectedAd"
    );

  if (selectedAd) {
    selectedAd.textContent =
      `${ad.day}/${ad.month}/${ad.year} AD • ${
        ad.weekday.name
      }`;
  }


  const selectedEvents =
    document.getElementById(
      "selectedEvents"
    );

  if (selectedEvents) {
    selectedEvents.innerHTML =
      events.length
        ? events
            .map(
              event => `
                <div class="event-item">
                  <strong>
                    ${event.name}
                  </strong>

                  ${
                    event.nameEn
                      ? `<small>${event.nameEn}</small>`
                      : ""
                  }
                </div>
              `
            )
            .join("")
        : `<p>No festival or holiday listed.</p>`;
  }


  const selectedMoonIcon =
    document.getElementById(
      "selectedMoonIcon"
    );

  if (selectedMoonIcon) {
    selectedMoonIcon.textContent =
      moon.icon;
  }


  const selectedMoon =
    document.getElementById(
      "selectedMoon"
    );

  if (selectedMoon) {
    selectedMoon.textContent =
      moon.name;
  }


  const selectedMoonAge =
    document.getElementById(
      "selectedMoonAge"
    );

  if (selectedMoonAge) {
    selectedMoonAge.textContent =
      moon.np;
  }
}


/* =========================
   TODAY DISPLAY
========================= */

function updateToday() {
  try {
    const bs =
      todayBs({
        timezone:
          "Asia/Kathmandu"
      });

    const now =
      new Date();


    const todayNepali =
      document.getElementById(
        "todayNepali"
      );

    if (todayNepali) {
      todayNepali.textContent =
        formatBsDate(
          bs.year,
          bs.month,
          bs.day
        );
    }


    const todayEnglish =
      document.getElementById(
        "todayEnglish"
      );

    if (todayEnglish) {
      todayEnglish.textContent =
        now.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
        );
    }


    const todayWeekday =
      document.getElementById(
        "todayWeekday"
      );

    if (todayWeekday) {
      todayWeekday.textContent =
        bs.weekday.name;
    }


    const todayMoon =
      document.getElementById(
        "todayMoon"
      );

    if (todayMoon) {
      todayMoon.textContent =
        moonPhase(now).name;
    }

  } catch (error) {
    console.error(
      "Today's date error:",
      error
    );
  }
}


/* =========================
   NAVIGATION
========================= */

function setupNavigation() {

  const prevMonth =
    document.getElementById(
      "prevMonth"
    );

  if (prevMonth) {
    prevMonth.addEventListener(
      "click",
      () => {

        currentMonth--;

        if (
          currentMonth < 1
        ) {
          currentMonth = 12;
          currentYear--;
        }

        currentYear =
          Math.max(
            MIN_BS_YEAR,
            currentYear
          );

        selectedDay = null;

        renderCalendar();
      }
    );
  }


  const nextMonth =
    document.getElementById(
      "nextMonth"
    );

  if (nextMonth) {
    nextMonth.addEventListener(
      "click",
      () => {

        currentMonth++;

        if (
          currentMonth > 12
        ) {
          currentMonth = 1;
          currentYear++;
        }

        currentYear =
          Math.min(
            MAX_BS_YEAR,
            currentYear
          );

        selectedDay = null;

        renderCalendar();
      }
    );
  }


  const prevYear =
    document.getElementById(
      "prevYear"
    );

  if (prevYear) {
    prevYear.addEventListener(
      "click",
      () => {

        currentYear =
          Math.max(
            MIN_BS_YEAR,
            currentYear - 1
          );

        selectedDay = null;

        renderCalendar();
      }
    );
  }


  const nextYear =
    document.getElementById(
      "nextYear"
    );

  if (nextYear) {
    nextYear.addEventListener(
      "click",
      () => {

        currentYear =
          Math.min(
            MAX_BS_YEAR,
            currentYear + 1
          );

        selectedDay = null;

        renderCalendar();
      }
    );
  }


  const goToday =
    document.getElementById(
      "goToday"
    );

  if (goToday) {
    goToday.addEventListener(
      "click",
      () => {

        try {

          const bs =
            todayBs({
              timezone:
                "Asia/Kathmandu"
            });

          currentYear =
            bs.year;

          currentMonth =
            bs.month;

          selectedDay =
            bs.day;

          renderCalendar();

          showSelectedDate();

        } catch (error) {
          console.error(error);
        }
      }
    );
  }


  const yearSelect =
    document.getElementById(
      "yearSelect"
    );

  if (yearSelect) {
    yearSelect.addEventListener(
      "change",
      event => {

        currentYear =
          Number(
            event.target.value
          );

        selectedDay = null;

        renderCalendar();
      }
    );
  }


  const monthSelect =
    document.getElementById(
      "monthSelect"
    );

  if (monthSelect) {
    monthSelect.addEventListener(
      "change",
      event => {

        currentMonth =
          Number(
            event.target.value
          );

        selectedDay = null;

        renderCalendar();
      }
    );
  }
}


/* =========================
   CONVERTER
========================= */

function setupConverter() {

  const form =
    document.getElementById(
      "converterForm"
    );

  if (!form) return;


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const result =
        document.getElementById(
          "converterResult"
        );

      if (!result) return;


      const activeTab =
        document.querySelector(
          ".tab.active"
        );

      if (!activeTab) return;


      const mode =
        activeTab.dataset.mode;


      try {

        if (
          mode === "bs"
        ) {

          const year =
            Number(
              document.getElementById(
                "bsYear"
              ).value
            );


          const month =
            Number(
              document.getElementById(
                "bsMonth"
              ).value
            );


          const day =
            Number(
              document.getElementById(
                "bsDay"
              ).value
            );


          const ad =
            bsDateToAd(
              year,
              month,
              day
            );


          result.innerHTML = `
            <strong>
              ${formatBsDate(
                year,
                month,
                day
              )}
            </strong>

            →

            <strong>
              ${ad.day}
              ${new Date(
                Date.UTC(
                  2000,
                  ad.month - 1,
                  1
                )
              ).toLocaleString(
                "en-US",
                {
                  month: "long",
                  timeZone: "UTC"
                }
              )}
              ${ad.year} AD
            </strong>
          `;

        } else {

          const year =
            Number(
              document.getElementById(
                "adYear"
              ).value
            );


          const month =
            Number(
              document.getElementById(
                "adMonth"
              ).value
            );


          const day =
            Number(
              document.getElementById(
                "adDay"
              ).value
            );


          const bs =
            adDateToBs(
              year,
              month,
              day
            );


          result.innerHTML = `
            <strong>
              ${day}/${month}/${year} AD
            </strong>

            →

            <strong>
              ${formatBsDate(
                bs.year,
                bs.month,
                bs.day
              )}
            </strong>
          `;
        }

      } catch (error) {

        result.textContent =
          error.message ||
          "Invalid date.";
      }
    }
  );
}


/* =========================
   CONVERTER TABS
========================= */

function setupTabs() {

  document
    .querySelectorAll(".tab")
    .forEach(
      tab => {

        tab.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(".tab")
              .forEach(
                button =>
                  button.classList.remove(
                    "active"
                  )
              );


            tab.classList.add(
              "active"
            );


            const mode =
              tab.dataset.mode;


            const bsFields =
              document.getElementById(
                "bsFields"
              );

            if (bsFields) {
              bsFields.classList.toggle(
                "hidden",
                mode !== "bs"
              );
            }


            const adFields =
              document.getElementById(
                "adFields"
              );

            if (adFields) {
              adFields.classList.toggle(
                "hidden",
                mode !== "ad"
              );
            }
          }
        );
      }
    );
}


/* =========================
   LOAD FESTIVALS / HOLIDAYS
========================= */

async function loadEvents() {

  try {

    const [
      festivalResponse,
      holidayResponse
    ] = await Promise.all([
      fetch(
        "/data/festivals.json"
      ),
      fetch(
        "/data/holidays.json"
      )
    ]);


    if (
      festivalResponse.ok
    ) {
      festivals =
        await festivalResponse.json();
    }


    if (
      holidayResponse.ok
    ) {
      holidays =
        await holidayResponse.json();
    }

  } catch (error) {

    console.warn(
      "Event data could not be loaded.",
      error
    );
  }
}


/* =========================
   EVENT SEARCH
========================= */

function renderEvents() {

  const container =
    document.getElementById(
      "eventGrid"
    );

  const input =
    document.getElementById(
      "festivalSearch"
    );


  if (
    !container ||
    !input
  ) {
    return;
  }


  function render() {

    const query =
      input.value
        .trim()
        .toLowerCase();


    const all = [];


    Object.entries(
      festivals
    ).forEach(
      ([date, items]) => {

        items.forEach(
          item => {

            all.push({
              date,
              ...item
            });

          }
        );
      }
    );


    Object.entries(
      holidays
    ).forEach(
      ([date, items]) => {

        items.forEach(
          item => {

            all.push({
              date,
              ...item
            });

          }
        );
      }
    );


    const filtered =
      all.filter(
        item =>
          `${item.name} ${
            item.nameEn || ""
          }`
            .toLowerCase()
            .includes(query)
      );


    container.innerHTML =
      filtered
        .slice(0, 100)
        .map(
          item => {

            const [
              year,
              month,
              day
            ] =
              item.date
                .split("-")
                .map(Number);


            return `
              <article class="event-card">

                <div class="event-date">

                  <strong>
                    ${nepaliNumber(day)}
                  </strong>

                  <span>
                    ${MONTHS[
                      month - 1
                    ].np}
                  </span>

                </div>


                <div>

                  <h3>
                    ${item.name}
                  </h3>

                  <p>
                    ${item.nameEn || ""}
                  </p>

                  <small>
                    ${nepaliNumber(year)} BS
                  </small>

                </div>

              </article>
            `;
          }
        )
        .join("");


    if (
      !filtered.length
    ) {
      container.innerHTML =
        "<p>No matching events found.</p>";
    }
  }


  input.addEventListener(
    "input",
    render
  );


  render();
}


/* =========================
   DATE DIFFERENCE TOOL
========================= */

function setupTools() {

  const dateDiffTool =
    document.getElementById(
      "dateDiffTool"
    );


  if (!dateDiffTool) {
    return;
  }


  dateDiffTool.addEventListener(
    "click",
    () => {

      const start =
        prompt(
          "Start date YYYY-MM-DD"
        );


      const end =
        prompt(
          "End date YYYY-MM-DD"
        );


      if (
        !start ||
        !end
      ) {
        return;
      }


      const a =
        new Date(
          `${start}T00:00:00`
        );


      const b =
        new Date(
          `${end}T00:00:00`
        );


      if (
        Number.isNaN(a.getTime()) ||
        Number.isNaN(b.getTime())
      ) {

        alert(
          "Please enter valid dates."
        );

        return;
      }


      const days =
        Math.abs(
          b - a
        ) / 86400000;


      alert(
        `Difference: ${days} days`
      );
    }
  );
}


/* =========================
   AGE CALCULATOR
========================= */

function setupAgeCalculator() {

  const ageTool =
    document.getElementById(
      "age-tool"
    );


  const dobInput =
    document.getElementById(
      "ageDob"
    );


  const calculateButton =
    document.getElementById(
      "calculateAge"
    );


  const result =
    document.getElementById(
      "ageResult"
    );


  const error =
    document.getElementById(
      "ageError"
    );


  const years =
    document.getElementById(
      "ageYears"
    );


  const months =
    document.getElementById(
      "ageMonths"
    );


  const days =
    document.getElementById(
      "ageDays"
    );


  const totalDays =
    document.getElementById(
      "ageTotalDays"
    );


  const birthday =
    document.getElementById(
      "ageBirthday"
    );


  if (
    !dobInput ||
    !calculateButton ||
    !result ||
    !error ||
    !years ||
    !months ||
    !days ||
    !totalDays ||
    !birthday
  ) {
    return;
  }


  /* Scroll from tool card */

  if (ageTool) {

    ageTool.addEventListener(
      "click",
      () => {

        document
          .getElementById(
            "age-calculator"
          )
          ?.scrollIntoView({
            behavior: "smooth"
          });

      }
    );

  }


  /* Calculate */

  calculateButton.addEventListener(
    "click",
    () => {

      error.textContent = "";

      result.classList.add(
        "hidden"
      );


      if (!dobInput.value) {

        error.textContent =
          "Please select your date of birth.";

        return;
      }


      const [
        year,
        month,
        day
      ] =
        dobInput.value
          .split("-")
          .map(Number);


      const birthDate =
        new Date(
          year,
          month - 1,
          day
        );


      const today =
        new Date();


      today.setHours(
        0,
        0,
        0,
        0
      );


      birthDate.setHours(
        0,
        0,
        0,
        0
      );


      /* Invalid date */

      if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day
      ) {

        error.textContent =
          "Please enter a valid date.";

        return;
      }


      /* Future date */

      if (
        birthDate > today
      ) {

        error.textContent =
          "Date of birth cannot be in the future.";

        return;
      }


      let ageYears =
        today.getFullYear() -
        birthDate.getFullYear();


      let ageMonths =
        today.getMonth() -
        birthDate.getMonth();


      let ageDays =
        today.getDate() -
        birthDate.getDate();


      /* Borrow days */

      if (
        ageDays < 0
      ) {

        ageMonths--;


        const previousMonth =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            0
          );


        ageDays +=
          previousMonth.getDate();
      }


      /* Borrow months */

      if (
        ageMonths < 0
      ) {

        ageYears--;

        ageMonths += 12;
      }


      /* Total days */

      const millisecondsPerDay =
        1000 *
        60 *
        60 *
        24;


      const total =
        Math.floor(
          (
            today -
            birthDate
          ) /
          millisecondsPerDay
        );


      years.textContent =
        ageYears;


      months.textContent =
        ageMonths;


      days.textContent =
        ageDays;


      totalDays.textContent =
        total.toLocaleString();


      /* Birthday */

      let birthdayThisYear =
        new Date(
          today.getFullYear(),
          month - 1,
          day
        );


      /*
        Handle February 29 birthdays
      */

      if (
        month === 2 &&
        day === 29 &&
        birthdayThisYear.getMonth() !== 1
      ) {

        birthdayThisYear =
          new Date(
            today.getFullYear(),
            1,
            28
          );
      }


      if (
        birthdayThisYear.getTime() ===
        today.getTime()
      ) {

        birthday.textContent =
          "🎉 Happy Birthday!";

      } else {

        let nextBirthday =
          birthdayThisYear;


        if (
          nextBirthday < today
        ) {

          nextBirthday =
            new Date(
              today.getFullYear() + 1,
              month - 1,
              day
            );


          if (
            month === 2 &&
            day === 29 &&
            nextBirthday.getMonth() !== 1
          ) {

            nextBirthday =
              new Date(
                today.getFullYear() + 1,
                1,
                28
              );
          }
        }


        const daysUntil =
          Math.ceil(
            (
              nextBirthday -
              today
            ) /
            millisecondsPerDay
          );


        birthday.textContent =
          `Your next birthday is in ${daysUntil} days.`;
      }


      result.classList.remove(
        "hidden"
      );
    }
  );
}


/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {

  const menuToggle =
    document.getElementById(
      "menuToggle"
    );


  const mainNav =
    document.getElementById(
      "mainNav"
    );


  if (
    !menuToggle ||
    !mainNav
  ) {
    return;
  }


  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        mainNav.classList.toggle(
          "open"
        );


      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      menuToggle.textContent =
        isOpen
          ? "✕"
          : "☰";
    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            mainNav.classList.remove(
              "open"
            );


            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );


            menuToggle.textContent =
              "☰";
          }
        );
      }
    );
}


/* =========================
   TOOLS DROPDOWN
========================= */

function setupToolsDropdown() {

  const button =
    document.getElementById(
      "toolsButton"
    );


  const menu =
    document.getElementById(
      "toolsMenu"
    );


  if (
    !button ||
    !menu
  ) {
    return;
  }


  button.addEventListener(
    "click",
    event => {

      event.stopPropagation();


      const isOpen =
        menu.classList.toggle(
          "open"
        );


      button.classList.toggle(
        "active",
        isOpen
      );


      button.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    }
  );


  menu.addEventListener(
    "click",
    event => {
      event.stopPropagation();
    }
  );


  document.addEventListener(
    "click",
    () => {

      menu.classList.remove(
        "open"
      );


      button.classList.remove(
        "active"
      );


      button.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  );


  menu
    .querySelectorAll("a")
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            menu.classList.remove(
              "open"
            );


            button.classList.remove(
              "active"
            );


            button.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        );
      }
    );
}


/* =========================
   INITIALIZATION
========================= */

async function init() {

  await loadEvents();


  renderYearSelect();

  renderMonthSelect();

  renderConverterMonths();

  renderWeekdays();


  setupNavigation();

  setupConverter();

  setupTabs();

  renderEvents();

  setupTools();

  setupToolsDropdown();

  setupMobileMenu();

  setupAgeCalculator();


  updateToday();

  renderCalendar();


  const footerYear =
    document.getElementById(
      "footerYear"
    );


  if (footerYear) {
    footerYear.textContent =
      new Date().getFullYear();
  }
}


/* START APP */

init();

/* =====================================================
   NEPALI UNICODE CONVERTER
===================================================== */

const romanInput = document.getElementById("roman");
const unicodeOutput = document.getElementById("output");
const unicodeSuggestions =
  document.getElementById("suggestions");
const unicodeStatus =
  document.getElementById("status");

if (
  romanInput &&
  unicodeOutput &&
  unicodeSuggestions &&
  unicodeStatus
) {

  let unicodeTimer = null;
  let unicodeRequestNumber = 0;
  let activeSuggestion = -1;


  function getLastWord(text) {

    const match =
      text.match(/(^|\s)([^\s]+)$/);

    return match
      ? match[2]
      : "";

  }


  function replaceLastWord(
    text,
    replacement
  ) {

    return text.replace(
      /([^\s]+)$/,
      replacement
    );

  }


  async function getUnicodeSuggestions(word) {

    if (!word) {

      unicodeSuggestions.classList.remove(
        "show"
      );

      return;

    }


    const currentRequest =
      ++unicodeRequestNumber;


    unicodeStatus.textContent =
      "Getting suggestions...";


    try {

      const url =
        "https://inputtools.google.com/request" +
        "?text=" +
        encodeURIComponent(word) +
        "&itc=ne-t-i0-und" +
        "&num=10" +
        "&cp=0" +
        "&cs=1" +
        "&ie=utf-8" +
        "&oe=utf-8";


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          "Request failed"
        );

      }


      const data =
        await response.json();


      if (
        currentRequest !==
        unicodeRequestNumber
      ) {

        return;

      }


      let list = [];


      if (
        data &&
        data[1] &&
        data[1][0] &&
        data[1][0][1]
      ) {

        list =
          data[1][0][1];

      }


      showUnicodeSuggestions(list);


      unicodeStatus.textContent =
        list.length
          ? "Choose a suggestion or keep typing."
          : "";

    }

    catch (error) {

      unicodeSuggestions.classList.remove(
        "show"
      );

      unicodeStatus.textContent =
        "Suggestions unavailable. Check your internet connection.";

    }

  }


  function showUnicodeSuggestions(list) {

    unicodeSuggestions.innerHTML = "";

    activeSuggestion = -1;


    if (!list.length) {

      unicodeSuggestions.classList.remove(
        "show"
      );

      return;

    }


    list.forEach(function(item) {

      const button =
        document.createElement("button");


      button.type = "button";

      button.className =
        "unicode-suggestion";


      button.textContent = item;


      button.addEventListener(
        "mousedown",
        function(event) {

          event.preventDefault();

          selectUnicodeSuggestion(item);

        }
      );


      unicodeSuggestions.appendChild(
        button
      );

    });


    unicodeSuggestions.classList.add(
      "show"
    );

  }


  function selectUnicodeSuggestion(value) {

    romanInput.value =
      replaceLastWord(
        romanInput.value,
        value
      );


    unicodeOutput.value =
      romanInput.value;


    unicodeSuggestions.classList.remove(
      "show"
    );


    unicodeStatus.textContent = "";

    romanInput.focus();

  }


  romanInput.addEventListener(
    "input",
    function() {

      unicodeOutput.value =
        romanInput.value;


      clearTimeout(
        unicodeTimer
      );


      const word =
        getLastWord(
          romanInput.value
        );


      if (
        !word ||
        /[\u0900-\u097F]/.test(word)
      ) {

        unicodeSuggestions.classList.remove(
          "show"
        );

        return;

      }


      unicodeTimer =
        setTimeout(
          function() {

            getUnicodeSuggestions(
              word
            );

          },
          180
        );

    }
  );


  romanInput.addEventListener(
    "keydown",
    function(event) {

      const items =
        [
          ...unicodeSuggestions
            .querySelectorAll(
              ".unicode-suggestion"
            )
        ];


      if (
        !unicodeSuggestions.classList.contains(
          "show"
        ) ||
        !items.length
      ) {

        return;

      }


      if (
        event.key ===
        "ArrowDown"
      ) {

        event.preventDefault();

        activeSuggestion =
          (
            activeSuggestion + 1
          ) %
          items.length;


        items.forEach(
          function(item, index) {

            item.classList.toggle(
              "active",
              index ===
              activeSuggestion
            );

          }
        );

      }


      else if (
        event.key ===
        "ArrowUp"
      ) {

        event.preventDefault();

        activeSuggestion =
          (
            activeSuggestion -
            1 +
            items.length
          ) %
          items.length;


        items.forEach(
          function(item, index) {

            item.classList.toggle(
              "active",
              index ===
              activeSuggestion
            );

          }
        );

      }


      else if (
        event.key === "Enter" &&
        activeSuggestion >= 0
      ) {

        event.preventDefault();

        selectUnicodeSuggestion(
          items[
            activeSuggestion
          ].textContent
        );

      }


      else if (
        event.key === "Escape"
      ) {

        unicodeSuggestions.classList.remove(
          "show"
        );

      }

    }
  );


  document.addEventListener(
    "click",
    function(event) {

      if (
        !event.target.closest(
          ".unicode-editor"
        )
      ) {

        unicodeSuggestions.classList.remove(
          "show"
        );

      }

    }
  );


  document.getElementById(
    "copy"
  ).addEventListener(
    "click",
    async function() {

      if (!unicodeOutput.value) {

        return;

      }


      try {

        await navigator.clipboard.writeText(
          unicodeOutput.value
        );


        unicodeStatus.textContent =
          "Copied to clipboard.";

      }

      catch (error) {

        unicodeOutput.select();

        document.execCommand(
          "copy"
        );


        unicodeStatus.textContent =
          "Copied to clipboard.";

      }

    }
  );


  document.getElementById(
    "clear"
  ).addEventListener(
    "click",
    function() {

      romanInput.value = "";

      unicodeOutput.value = "";

      unicodeSuggestions.classList.remove(
        "show"
      );

      unicodeStatus.textContent = "";

      romanInput.focus();

    }
  );

}
