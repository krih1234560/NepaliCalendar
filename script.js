
```javascript
/*
 * Nepali Calendar MVP
 *
 * IMPORTANT:
 * This starter version contains demonstration calendar data.
 * For production use, replace the sample data with a verified
 * BS calendar dataset covering the years you want to support.
 */

const nepaliMonths = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भदौ",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुण",
  "चैत्र"
];

const nepaliMonthsEnglish = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra"
];


/*
 * Sample month lengths.
 *
 * DO NOT use these values as the authoritative Nepali calendar.
 * A production website needs a verified BS calendar dataset.
 */

const sampleMonthLengths = [
  31,
  32,
  31,
  32,
  31,
  30,
  30,
  30,
  29,
  30,
  29,
  30
];


/*
 * Sample festivals.
 */

const festivals = {
  5: {
    15: "जनै पूर्णिमा",
    20: "हरितालिका तीज"
  },

  7: {
    4: "बडा दशैं"
  },

  7: {
    18: "तिहार"
  }
};


/*
 * Application state.
 */

let currentYear = 2083;
let currentMonth = 5;


/*
 * DOM elements.
 */

const calendarGrid =
  document.getElementById("calendarGrid");

const currentMonthElement =
  document.getElementById("currentMonth");

const currentMonthADElement =
  document.getElementById("currentMonthAD");

const yearSelect =
  document.getElementById("yearSelect");

const previousMonthButton =
  document.getElementById("previousMonth");

const nextMonthButton =
  document.getElementById("nextMonth");

const todayButton =
  document.getElementById("todayButton");

const themeToggle =
  document.getElementById("themeToggle");

const copyrightYear =
  document.getElementById("copyrightYear");

const festivalSearch =
  document.getElementById("festivalSearch");


/*
 * Render calendar.
 */

function renderCalendar() {

  calendarGrid.innerHTML = "";

  const monthLength =
    sampleMonthLengths[currentMonth - 1];

  /*
   * Demo weekday calculation.
   *
   * A production implementation should calculate the
   * actual weekday using the verified BS/AD conversion engine.
   */

  const firstDay = 0;

  for (let i = 0; i < firstDay; i++) {

    const empty =
      document.createElement("div");

    empty.className = "calendar-day empty";

    calendarGrid.appendChild(empty);
  }


  for (
    let day = 1;
    day <= monthLength;
    day++
  ) {

    const cell =
      document.createElement("div");

    cell.className = "calendar-day";


    /*
     * Demonstration "today".
     */

    if (
      currentYear === 2083 &&
      currentMonth === 5 &&
      day === 15
    ) {

      cell.classList.add("today");
    }


    const number =
      document.createElement("span");

    number.className = "day-number";

    number.textContent =
      nepaliNumber(day);


    const adDate =
      document.createElement("span");

    adDate.className = "ad-date";

    adDate.textContent =
      `2026-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    cell.appendChild(number);
    cell.appendChild(adDate);


    /*
     * Festival label.
     */

    const festival =
      getFestival(currentMonth, day);

    if (festival) {

      const festivalElement =
        document.createElement("span");

      festivalElement.className =
        "festival-name";

      festivalElement.textContent =
        festival;

      cell.appendChild(festivalElement);
    }


    calendarGrid.appendChild(cell);
  }


  currentMonthElement.textContent =
    `${nepaliMonths[currentMonth - 1]} ${nepaliNumber(currentYear)}`;

  currentMonthADElement.textContent =
    `${nepaliMonthsEnglish[currentMonth - 1]} 2026`;
}


/*
 * Get festival.
 */

function getFestival(month, day) {

  if (!festivals[month]) {
    return null;
  }

  return festivals[month][day] || null;
}


/*
 * Nepali number converter.
 */

function nepaliNumber(number) {

  const digits = [
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

  return String(number)
    .split("")
    .map(
      digit => digits[Number(digit)]
    )
    .join("");
}


/*
 * Month navigation.
 */

previousMonthButton.addEventListener(
  "click",
  () => {

    currentMonth--;

    if (currentMonth < 1) {

      currentMonth = 12;

      currentYear--;
    }

    yearSelect.value =
      String(currentYear);

    renderCalendar();
  }
);


nextMonthButton.addEventListener(
  "click",
  () => {

    currentMonth++;

    if (currentMonth > 12) {

      currentMonth = 1;

      currentYear++;
    }

    yearSelect.value =
      String(currentYear);

    renderCalendar();
  }
);


/*
 * Today button.
 */

todayButton.addEventListener(
  "click",
  () => {

    /*
     * Demo date.
     *
     * Replace with a real BS date conversion
     * when the production calendar engine is added.
     */

    currentYear = 2083;
    currentMonth = 5;

    yearSelect.value =
      String(currentYear);

    renderCalendar();
  }
);


/*
 * Year selector.
 */

yearSelect.addEventListener(
  "change",
  event => {

    currentYear =
      Number(event.target.value);

    renderCalendar();
  }
);


/*
 * Dark mode.
 */

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle("dark");

    const isDark =
      document.body.classList.contains("dark");

    themeToggle.textContent =
      isDark ? "☀️" : "🌙";

    localStorage.setItem(
      "nepaliCalendarTheme",
      isDark ? "dark" : "light"
    );
  }
);


/*
 * Restore theme.
 */

const savedTheme =
  localStorage.getItem(
    "nepaliCalendarTheme"
  );

if (savedTheme === "dark") {

  document.body.classList.add("dark");

  themeToggle.textContent = "☀️";
}


/*
 * Converter tabs.
 */

const converterTabs =
  document.querySelectorAll(
    ".converter-tab"
  );

const bsForm =
  document.getElementById("bsForm");

const adForm =
  document.getElementById("adForm");

converterTabs.forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      converterTabs.forEach(
        item =>
          item.classList.remove("active")
      );

      tab.classList.add("active");

      const mode =
        tab.dataset.mode;

      if (mode === "bs-ad") {

        bsForm.classList.remove("hidden");

        adForm.classList.add("hidden");

      } else {

        bsForm.classList.add("hidden");

        adForm.classList.remove("hidden");
      }

    }
  );

});


/*
 * Converter.
 */

const convertButton =
  document.getElementById(
    "convertButton"
  );

const conversionResult =
  document.getElementById(
    "conversionResult"
  );

convertButton.addEventListener(
  "click",
  () => {

    const activeTab =
      document.querySelector(
        ".converter-tab.active"
      );

    const mode =
      activeTab.dataset.mode;


    if (mode === "bs-ad") {

      const year =
        document.getElementById(
          "bsYear"
        ).value;

      const month =
        document.getElementById(
          "bsMonth"
        ).value;

      const day =
        document.getElementById(
          "bsDay"
        ).value;


      /*
       * Demo result.
       *
       * Replace this section with a verified
       * BS ↔ AD conversion algorithm/dataset.
       */

      conversionResult.innerHTML = `
        <span>Conversion result</span>
        <strong>
          ${year} BS, month ${month}, day ${day}
        </strong>
        <small>
          Production conversion engine will be connected here.
        </small>
      `;

    } else {

      const date =
        document.getElementById(
          "adDate"
        ).value;

      conversionResult.innerHTML = `
        <span>Conversion result</span>
        <strong>
          ${date}
        </strong>
        <small>
          Production conversion engine will be connected here.
        </small>
      `;
    }

  }
);


/*
 * Festival search.
 */

festivalSearch.addEventListener(
  "input",
  event => {

    const search =
      event.target.value
        .trim()
        .toLowerCase();

    const cards =
      document.querySelectorAll(
        ".festival-card"
      );

    cards.forEach(card => {

      const name =
        card.dataset.name || "";

      card.style.display =
        name.includes(search)
          ? ""
          : "none";
    });

  }
);


/*
 * Nepali clock.
 */

function updateNepaliClock() {

  const now = new Date();

  /*
   * Nepal Standard Time = UTC+5:45.
   */

  const utc =
    now.getTime() +
    now.getTimezoneOffset() * 60000;

  const nepalTime =
    new Date(
      utc + 5.75 * 60 * 60 * 1000
    );


  const hours =
    String(
      nepalTime.getHours()
    ).padStart(2, "0");

  const minutes =
    String(
      nepalTime.getMinutes()
    ).padStart(2, "0");

  const seconds =
    String(
      nepalTime.getSeconds()
    ).padStart(2, "0");


  document.getElementById(
    "nepaliTime"
  ).textContent =
    `${hours}:${minutes}:${seconds}`;
}


setInterval(
  updateNepaliClock,
  1000
);

updateNepaliClock();


/*
 * Footer year.
 */

copyrightYear.textContent =
  new Date().getFullYear();


/*
 * Initial render.
 */

renderCalendar();
```
