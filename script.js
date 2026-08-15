import { bsToAd, adToBs, getTotalDaysInMonth, getNepaliMonthName, getCalendarData } from "https://cdn.jsdelivr.net/npm/@sonill/nepali-dates@1.0.7/+esm";

const MONTHS = [
  ["बैशाख","Baisakh"],["जेठ","Jestha"],["असार","Ashar"],["श्रावण","Shrawan"],
  ["भाद्र","Bhadra"],["आश्विन","Ashwin"],["कार्तिक","Kartik"],["मंसिर","Mangsir"],
  ["पौष","Poush"],["माघ","Magh"],["फाल्गुन","Falgun"],["चैत्र","Chaitra"]
];
const WEEKDAYS = ["आइत","सोम","मंगल","बुध","बिहि","शुक्र","शनि"];
const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const NP_DIGITS = "०१२३४५६७८९";
const MIN_YEAR = 2000, MAX_YEAR = 2100;

// Verified/curated entries should be expanded year by year.
// Government holiday schedules are published separately by Nepal's Ministry of Home Affairs.
const EVENTS = [
  {y:2083,m:5,d:15,ne:"जनै पूर्णिमा",en:"Janai Purnima",type:"festival"},
  {y:2083,m:5,d:20,ne:"हरितालिका तीज",en:"Haritalika Teej",type:"festival"},
  {y:2083,m:6,d:3,ne:"घटस्थापना",en:"Ghatasthapana",type:"festival"},
  {y:2083,m:6,d:10,ne:"फूलपाती",en:"Phulpati",type:"festival"},
  {y:2083,m:6,d:11,ne:"महाअष्टमी",en:"Maha Ashtami",type:"festival"},
  {y:2083,m:6,d:12,ne:"महानवमी",en:"Maha Navami",type:"festival"},
  {y:2083,m:6,d:13,ne:"विजया दशमी",en:"Vijaya Dashami / Dashain",type:"holiday"},
  {y:2083,m:7,d:3,ne:"काग तिहार",en:"Kag Tihar",type:"festival"},
  {y:2083,m:7,d:4,ne:"कुकुर तिहार / लक्ष्मी पूजा",en:"Kukur Tihar / Laxmi Puja",type:"holiday"},
  {y:2083,m:7,d:5,ne:"गाई तिहार / गोवर्धन पूजा",en:"Gai Tihar / Govardhan Puja",type:"festival"},
  {y:2083,m:7,d:6,ne:"भाइटीका",en:"Bhai Tika",type:"holiday"}
];

let state = { year: 2083, month: 5, selectedDay: null, mode:"bs" };

const $ = id => document.getElementById(id);
const toNp = n => String(n).replace(/\d/g, d => NP_DIGITS[d]);
const dateKey = (y,m,d) => `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const eventFor = (y,m,d) => EVENTS.filter(e => e.y===y && e.m===m && e.d===d);
const eventForYear = y => EVENTS.filter(e=>e.y===y);

function safeDate(y,m,d){ return new Date(Date.UTC(y,m-1,d)); }

function moonPhase(adDate){
  // Approximate synodic phase for display; not a Panchang/tithi calculation.
  const knownNewMoon = Date.UTC(2000,0,6,18,14);
  const synodic = 29.530588853;
  const age = ((adDate.getTime() - knownNewMoon) / 86400000) % synodic;
  const a = (age + synodic) % synodic;
  let name, icon;
  if(a < 1.84566){name="New Moon / औंसी";icon="●";}
  else if(a < 7.38265){name="Waxing Crescent";icon="◔";}
  else if(a < 9.22311){name="First Quarter";icon="◑";}
  else if(a < 14.76529){name="Waxing Gibbous";icon="◕";}
  else if(a < 16.61045){name="Full Moon / पूर्णिमा";icon="○";}
  else if(a < 22.14794){name="Waning Gibbous";icon="◕";}
  else if(a < 23.99335){name="Last Quarter";icon="◑";}
  else {name="Waning Crescent";icon="◔";}
  return {name,icon,age:Math.round(a*10)/10};
}

function fillSelects(){
  $("yearSelect").innerHTML = Array.from({length:MAX_YEAR-MIN_YEAR+1},(_,i)=>{
    const y=MIN_YEAR+i; return `<option value="${y}">${y} / ${toNp(y)}</option>`;
  }).join("");
  $("monthSelect").innerHTML = MONTHS.map((m,i)=>`<option value="${i+1}">${m[0]} / ${m[1]}</option>`).join("");
  $("bsMonth").innerHTML = MONTHS.map((m,i)=>`<option value="${i+1}">${m[0]} / ${m[1]}</option>`).join("");
  $("weekdays").innerHTML = WEEKDAYS.map(d=>`<div>${d}</div>`).join("");
}

function monthInfo(y,m){
  const first = bsToAd(y,m,1);
  const days = getTotalDaysInMonth(y,m);
  const firstDate = safeDate(first.year,first.month,first.day);
  return {first,days,firstDate};
}

function renderCalendar(){
  const info = monthInfo(state.year,state.month);
  const firstDow = info.firstDate.getUTCDay();
  const days = info.days;
  $("calendarTitle").textContent = `Nepali Calendar ${state.year}`;
  $("calendarSubtitle").textContent = `${MONTHS[state.month-1][1]} / ${MONTHS[state.month-1][0]} ${state.year} BS`;
  $("monthNepali").textContent = MONTHS[state.month-1][0];
  $("monthEnglish").textContent = MONTHS[state.month-1][1];
  $("yearBadge").textContent = `${state.year} BS`;
  $("yearSelect").value = state.year;
  $("monthSelect").value = state.month;

  let html = "";
  for(let i=0;i<firstDow;i++) html += `<div class="day empty"></div>`;
  for(let d=1;d<=days;d++){
    const ad=bsToAd(state.year,state.month,d);
    const dt=safeDate(ad.year,ad.month,ad.day);
    const ev=eventFor(state.year,state.month,d);
    const isToday = sameBsAsToday(state.year,state.month,d);
    const isSelected = state.selectedDay===d;
    html += `<button class="day ${dt.getUTCDay()===6?"saturday":""} ${isToday?"today":""} ${isSelected?"selected":""}" data-day="${d}" aria-label="${MONTHS[state.month-1][1]} ${d}, ${state.year} BS">
      ${ev.length?'<span class="event-dot"></span>':''}
      <span class="bs-num">${toNp(d)}</span>
      <span class="ad-num">${ad.month}/${ad.day}</span>
      ${ev[0]?`<span class="holiday-label">${ev[0].ne}</span>`:""}
    </button>`;
  }
  $("calendarGrid").innerHTML = html;
  $("calendarGrid").querySelectorAll(".day:not(.empty)").forEach(btn=>btn.addEventListener("click",()=>selectDay(Number(btn.dataset.day))));
}

function sameBsAsToday(y,m,d){
  const now=new Date();
  try { const b=adToBs(now.getUTCFullYear(),now.getUTCMonth()+1,now.getUTCDate()); return b.year===y&&b.month===m&&b.day===d; }
  catch { return false; }
}

function selectDay(d){
  state.selectedDay=d;
  renderCalendar();
  const ad=bsToAd(state.year,state.month,d);
  const dt=safeDate(ad.year,ad.month,ad.day);
  const ev=eventFor(state.year,state.month,d);
  const moon=moonPhase(dt);
  $("selectedTitle").textContent=`${MONTHS[state.month-1][0]} ${toNp(d)}, ${toNp(state.year)}`;
  $("selectedAd").textContent=`${ad.year}-${String(ad.month).padStart(2,"0")}-${String(ad.day).padStart(2,"0")} • ${WEEKDAYS_EN[dt.getUTCDay()]}`;
  $("selectedEvents").innerHTML=ev.length?ev.map(e=>`<div class="event-chip"><strong>${e.ne}</strong><small>${e.en} • ${e.type==="holiday"?"Holiday":"Festival"}</small></div>`).join(""):`<div class="event-chip"><strong>No listed event</strong><small>Check the official holiday notice for this year.</small></div>`;
  $("selectedMoonIcon").textContent=moon.icon;
  $("selectedMoon").textContent=moon.name;
  $("selectedMoonAge").textContent=`Approx. lunar age ${moon.age} days`;
}

function renderToday(){
  const now=new Date();
  const b=adToBs(now.getUTCFullYear(),now.getUTCMonth()+1,now.getUTCDate());
  $("todayNepali").textContent=`${toNp(b.day)} ${MONTHS[b.month-1][0]} ${toNp(b.year)}`;
  $("todayEnglish").textContent=now.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"});
  $("todayWeekday").textContent=WEEKDAYS_EN[now.getUTCDay()];
  $("todayMoon").textContent=moonPhase(new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()))).name;
  $("footerYear").textContent=new Date().getFullYear();
}

function setMode(mode){
  state.mode=mode;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  $("bsFields").classList.toggle("hidden",mode!=="bs");
  $("adFields").classList.toggle("hidden",mode!=="ad");
}

function convertForm(e){
  e.preventDefault();
  try{
    let text="";
    if(state.mode==="bs"){
      const y=Number($("bsYear").value),m=Number($("bsMonth").value),d=Number($("bsDay").value);
      const a=bsToAd(y,m,d);
      text=`${toNp(d)} ${MONTHS[m-1][0]} ${toNp(y)} BS  →  ${a.day} ${new Date(Date.UTC(a.year,a.month-1,a.day)).toLocaleString("en-US",{month:"long"})} ${a.year} AD`;
    }else{
      const y=Number($("adYear").value),m=Number($("adMonth").value),d=Number($("adDay").value);
      const b=adToBs(y,m,d);
      text=`${d} ${new Date(Date.UTC(y,m-1,d)).toLocaleString("en-US",{month:"long"})} ${y} AD  →  ${toNp(b.day)} ${MONTHS[b.month-1][0]} ${toNp(b.year)} BS`;
    }
    $("converterResult").textContent=text;
  }catch(err){$("converterResult").textContent="Invalid or unsupported date. Supported BS range: 2000–2100.";}
}

function renderEvents(){
  const q=($("festivalSearch").value||"").trim().toLowerCase();
  const rows=eventForYear(state.year).filter(e=>`${e.ne} ${e.en}`.toLowerCase().includes(q));
  $("eventGrid").innerHTML=rows.length?rows.map(e=>`<article class="event-card"><div class="event-date">${toNp(e.d)} ${MONTHS[e.m-1][0]} ${toNp(e.y)} BS</div><h3>${e.ne}</h3><p>${e.en}</p><span class="event-type">${e.type==="holiday"?"PUBLIC HOLIDAY":"FESTIVAL"}</span></article>`).join(""):`<div class="event-card"><h3>No curated events for ${state.year} yet</h3><p>Add verified yearly entries to data/events.js. Do not invent government holidays.</p></div>`;
}

function moveMonth(delta){
  state.month+=delta;
  if(state.month<1){state.month=12;state.year--}
  if(state.month>12){state.month=1;state.year++}
  state.year=Math.max(MIN_YEAR,Math.min(MAX_YEAR,state.year));
  state.selectedDay=null; renderCalendar(); renderEvents();
}
function moveYear(delta){state.year=Math.max(MIN_YEAR,Math.min(MAX_YEAR,state.year+delta));state.selectedDay=null;renderCalendar();renderEvents();}

fillSelects(); renderToday(); renderCalendar(); renderEvents();
$("bsMonth").value=5;
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
$("converterForm").addEventListener("submit",convertForm);
$("prevMonth").addEventListener("click",()=>moveMonth(-1)); $("nextMonth").addEventListener("click",()=>moveMonth(1));
$("prevYear").addEventListener("click",()=>moveYear(-1)); $("nextYear").addEventListener("click",()=>moveYear(1));
$("goToday").addEventListener("click",()=>{const n=new Date(),b=adToBs(n.getUTCFullYear(),n.getUTCMonth()+1,n.getUTCDate());state.year=b.year;state.month=b.month;state.selectedDay=b.day;renderCalendar();renderEvents();selectDay(b.day)});
$("yearSelect").addEventListener("change",e=>{state.year=Number(e.target.value);state.selectedDay=null;renderCalendar();renderEvents()});
$("monthSelect").addEventListener("change",e=>{state.month=Number(e.target.value);state.selectedDay=null;renderCalendar();renderEvents()});
$("festivalSearch").addEventListener("input",renderEvents);
$("menuToggle").addEventListener("click",()=>{document.querySelector(".nav").classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",document.querySelector(".nav").classList.contains("open"))});

$("dateDiffTool").addEventListener("click",()=>{
  const a=prompt("Start date (YYYY-MM-DD)", "2026-01-01"), b=prompt("End date (YYYY-MM-DD)","2026-12-31");
  if(!a||!b)return;
  const da=new Date(a+"T00:00:00Z"), db=new Date(b+"T00:00:00Z");
  if(isNaN(da)||isNaN(db)) return alert("Invalid date");
  alert(`Difference: ${Math.abs(Math.round((db-da)/86400000))} days`);
});
$("age-tool").addEventListener("click",()=>{
  const dob=prompt("Date of birth (YYYY-MM-DD)");
  if(!dob)return;
  const d=new Date(dob+"T00:00:00Z"), n=new Date();
  if(isNaN(d)) return alert("Invalid date");
  let age=n.getUTCFullYear()-d.getUTCFullYear();
  const before=(n.getUTCMonth()<d.getUTCMonth())||(n.getUTCMonth()===d.getUTCMonth()&&n.getUTCDate()<d.getUTCDate());
  if(before)age--;
  alert(`Approximate age: ${age} years`);
});
