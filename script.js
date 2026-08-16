import {
  bsFromDate,
  dateFromBs,
  todayBs
} from "@grahan/calendars";

const MIN_BS_YEAR = 1975;
const MAX_BS_YEAR = 2100;

const MONTHS = [
  {
    np: "बैशाख",
    en: "Baisakh"
  },
  {
    np: "जेठ",
    en: "Jestha"
  },
  {
    np: "असार",
    en: "Asar"
  },
  {
    np: "श्रावण",
    en: "Shrawan"
  },
  {
    np: "भदौ",
    en: "Bhadra"
  },
  {
    np: "आश्विन",
    en: "Ashwin"
  },
  {
    np: "कार्तिक",
    en: "Kartik"
  },
  {
    np: "मंसिर",
    en: "Mangsir"
  },
  {
    np: "पौष",
    en: "Poush"
  },
  {
    np: "माघ",
    en: "Magh"
  },
  {
    np: "फाल्गुण",
    en: "Falgun"
  },
  {
    np: "चैत्र",
    en: "Chaitra"
  }
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


function nepaliNumber(number) {

  return String(number)
    .split("")
    .map(
      digit => DEVANAGARI[Number(digit)] ?? digit
    )
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


function moonPhase(date) {

  const knownNewMoon =
    Date.UTC(
      2000,
      0,
      6,
      18,
      14
    );

  const lunarCycle =
    29.530588853;

  const days =
    (
      date.getTime() -
      knownNewMoon
    ) / 86400000;

  const age =
    (
      (
        days %
        lunarCycle
      ) +
      lunarCycle
    ) %
    lunarCycle;


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

  const ad =
    bsDateToAd(
      year,
      month,
      1
    );

  return ad.weekday.index;

}


function renderYearSelect() {

  const select =
    document.getElementById(
      "yearSelect"
    );

  select.innerHTML = "";

  for (
    let year = MIN_BS_YEAR;
    year <= MAX_BS_YEAR;
    year++
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.value = year;

    option.textContent =
      `${nepaliNumber(year)} BS (${year})`;

    if (
      year === currentYear
    ) {
      option.selected = true;
    }

    select.appendChild(option);

  }

}


function renderMonthSelect() {

  const select =
    document.getElementById(
      "monthSelect"
    );

  select.innerHTML = "";

  MONTHS.forEach(
    (month, index) => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        index + 1;

      option.textContent =
        `${month.np} (${month.en})`;

      if (
        index + 1 === currentMonth
      ) {
        option.selected = true;
      }

      select.appendChild(
        option
      );

    }
  );

}


function renderConverterMonths() {

  const select =
    document.getElementById(
      "bsMonth"
    );

  select.innerHTML = "";

  MONTHS.forEach(
    (month, index) => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        index + 1;

      option.textContent =
        `${month.np} (${month.en})`;

      select.appendChild(
        option
      );

    }
  );

  select.value =
    currentMonth;

}


function renderWeekdays() {

  const container =
    document.getElementById(
      "weekdays"
    );

  container.innerHTML =
    WEEKDAYS
      .map(
        day => `<div>${day}</div>`
      )
      .join("");

}


function isToday(
  year,
  month,
  day
) {

  const now =
    new Date();

  try {

    const bs =
      adDateToBs(
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


function renderCalendar() {

  const grid =
    document.getElementById(
      "calendarGrid"
    );

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


  for (
    let i = 0;
    i < firstWeekday;
    i++
  ) {

    const blank =
      document.createElement(
        "div"
      );

    blank.className =
      "calendar-day empty";

    grid.appendChild(
      blank
    );

  }


  for (
    let day = 1;
    day <= days;
    day++
  ) {

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "calendar-day";


    const events =
      getEvents(
        currentYear,
        currentMonth,
        day
      );


    if (
      isToday(
        currentYear,
        currentMonth,
        day
      )
    ) {

      button.classList.add(
        "today"
      );

    }


    if (
      selectedDay === day
    ) {

      button.classList.add(
        "selected"
      );

    }


    if (
      events.some(
        event =>
          event.type === "holiday"
      )
    ) {

      button.classList.add(
        "holiday"
      );

    }


    if (
      events.some(
        event =>
          event.type === "festival"
      )
    ) {

      button.classList.add(
        "festival"
      );

    }
// Saturday = red
const ad = bsDateToAd(
  currentYear,
  currentMonth,
  day
);

if (ad.weekday.index === 6) {
  button.classList.add("saturday");
}

const ad = bsDateToAd(
  currentYear,
  currentMonth,
  day
);

// Saturday = red
if (ad.weekday.index === 6) {
  button.classList.add("saturday");
}

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


    button.addEventListener(
      "click",
      () => {

        selectedDay =
          day;

        renderCalendar();

        showSelectedDate();

      }
    );


    grid.appendChild(
      button
    );

  }


  document.getElementById(
    "monthNepali"
  ).textContent =
    MONTHS[
      currentMonth - 1
    ].np;


  document.getElementById(
    "monthEnglish"
  ).textContent =
    MONTHS[
      currentMonth - 1
    ].en;


  document.getElementById(
    "yearBadge"
  ).textContent =
    `${nepaliNumber(currentYear)} BS`;


  document.getElementById(
    "calendarTitle"
  ).textContent =
    `Nepali Calendar ${nepaliNumber(currentYear)}`;


  document.getElementById(
    "calendarSubtitle"
  ).textContent =
    `${MONTHS[currentMonth - 1].en} / ${
      MONTHS[currentMonth - 1].np
    } ${currentYear}`;

}


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


  document.getElementById(
    "selectedTitle"
  ).textContent =
    formatBsDate(
      currentYear,
      currentMonth,
      selectedDay
    );


  document.getElementById(
    "selectedAd"
  ).textContent =
    `${ad.day}/${ad.month}/${ad.year} AD • ${
      ad.weekday.name
    }`;


  document.getElementById(
    "selectedEvents"
  ).innerHTML =

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


  document.getElementById(
    "selectedMoonIcon"
  ).textContent =
    moon.icon;


  document.getElementById(
    "selectedMoon"
  ).textContent =
    moon.name;


  document.getElementById(
    "selectedMoonAge"
  ).textContent =
    moon.np;

}


function updateToday() {

  try {

    const bs =
      todayBs({
        timezone:
          "Asia/Kathmandu"
      });


    const now =
      new Date();


    document.getElementById(
      "todayNepali"
    ).textContent =
      formatBsDate(
        bs.year,
        bs.month,
        bs.day
      );


    document.getElementById(
      "todayEnglish"
    ).textContent =
      now.toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );


    document.getElementById(
      "todayWeekday"
    ).textContent =
      bs.weekday.name;


    document.getElementById(
      "todayMoon"
    ).textContent =
      moonPhase(
        now
      ).name;

  } catch (error) {

    console.error(
      "Today's date error:",
      error
    );

  }

}


function setupNavigation() {

  document
    .getElementById(
      "prevMonth"
    )
    .addEventListener(
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

        selectedDay =
          null;

        renderCalendar();

      }
    );


  document
    .getElementById(
      "nextMonth"
    )
    .addEventListener(
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

        selectedDay =
          null;

        renderCalendar();

      }
    );


  document
    .getElementById(
      "prevYear"
    )
    .addEventListener(
      "click",
      () => {

        currentYear =
          Math.max(
            MIN_BS_YEAR,
            currentYear - 1
          );

        selectedDay =
          null;

        renderCalendar();

      }
    );


  document
    .getElementById(
      "nextYear"
    )
    .addEventListener(
      "click",
      () => {

        currentYear =
          Math.min(
            MAX_BS_YEAR,
            currentYear + 1
          );

        selectedDay =
          null;

        renderCalendar();

      }
    );


  document
    .getElementById(
      "goToday"
    )
    .addEventListener(
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

          console.error(
            error
          );

        }

      }
    );


  document
    .getElementById(
      "yearSelect"
    )
    .addEventListener(
      "change",
      event => {

        currentYear =
          Number(
            event.target.value
          );

        selectedDay =
          null;

        renderCalendar();

      }
    );


  document
    .getElementById(
      "monthSelect"
    )
    .addEventListener(
      "change",
      event => {

        currentMonth =
          Number(
            event.target.value
          );

        selectedDay =
          null;

        renderCalendar();

      }
    );

}


function setupConverter() {

  const form =
    document.getElementById(
      "converterForm"
    );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const result =
        document.getElementById(
          "converterResult"
        );


      const mode =
        document.querySelector(
          ".tab.active"
        ).dataset.mode;


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


function setupTabs() {

  document
    .querySelectorAll(
      ".tab"
    )
    .forEach(
      tab => {

        tab.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".tab"
              )
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


            document
              .getElementById(
                "bsFields"
              )
              .classList.toggle(
                "hidden",
                mode !== "bs"
              );


            document
              .getElementById(
                "adFields"
              )
              .classList.toggle(
                "hidden",
                mode !== "ad"
              );

          }
        );

      }
    );

}


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


function renderEvents() {

  const container =
    document.getElementById(
      "eventGrid"
    );

  const input =
    document.getElementById(
      "festivalSearch"
    );


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


function setupTools() {

  document
    .getElementById(
      "dateDiffTool"
    )
    .addEventListener(
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
        ) return;


        const a =
          new Date(
            `${start}T00:00:00`
          );

        const b =
          new Date(
            `${end}T00:00:00`
          );


        const days =
          Math.abs(
            b - a
          ) / 86400000;


        alert(
          `Difference: ${days} days`
        );

      }
    );


  document
    .getElementById(
      "age-tool"
    )
    .addEventListener(
      "click",
      () => {

        const dob =
          prompt(
            "Date of birth YYYY-MM-DD"
          );

        if (!dob) return;


        const birth =
          new Date(
            `${dob}T00:00:00`
          );

        const now =
          new Date();


        let age =
          now.getFullYear() -
          birth.getFullYear();


        if (
          now.getMonth() <
            birth.getMonth() ||

          (
            now.getMonth() ===
            birth.getMonth() &&

            now.getDate() <
            birth.getDate()
          )
        ) {

          age--;

        }


        alert(
          `Age: ${age} years`
        );

      }
    );

}


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

  updateToday();

  renderCalendar();


  document.getElementById(
    "footerYear"
  ).textContent =
    new Date().getFullYear();

}


init();
