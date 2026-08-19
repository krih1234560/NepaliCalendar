import calendarData from "./calendar-2083.json";

const MONTHS = calendarData.months;
const NP_WEEKDAYS = ["आइतवार","सोमवार","मंगलवार","बुधवार","बिहिवार","शुक्रवार","शनिवार"];
const NP_DIGITS = "०१२३४५६७८९";

let monthIndex = MONTHS.findIndex(m => m.name === "भदौ");
if (monthIndex < 0) monthIndex = 0;
let selectedDay = null;
let activeTab = "festivals";

const np = value => String(value).split("").map(x => NP_DIGITS[Number(x)] ?? x).join("");

function monthData(){ return MONTHS[monthIndex]; }

function adDateForMonthDay(month, day){
  // The existing project already depends on @grahan/calendars. Reuse it
  // through the globally imported module in script.js is not reliable, so
  // use the AD start date in the JSON and offset by the BS day.
  const start = new Date(`${month.start}-01T00:00:00Z`);
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + (day - 1));
  return d;
}

function formatAd(d){
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"});
}

function render(){
  const m = monthData();
  const name = document.getElementById("np83-month-name");
  const en = document.getElementById("np83-month-en");
  const sub = document.getElementById("np83-month-subtitle");
  if(name) name.textContent = `${m.name} ${calendarData.yearNepali}`;
  if(en) en.textContent = m.eng;
  if(sub) sub.textContent = m.eng;

  const select=document.getElementById("np83-month");
  if(select){
    select.innerHTML = MONTHS.map((x,i)=>`<option value="${i}" ${i===monthIndex?"selected":""}>${x.name} · ${x.eng}</option>`).join("");
  }

  const weekdays=document.getElementById("np83-weekdays");
  weekdays.innerHTML=NP_WEEKDAYS.map(x=>`<div>${x}</div>`).join("");

  const grid=document.getElementById("np83-grid");
  grid.innerHTML="";
  const firstWeekday=Number(m.start);
  for(let i=0;i<firstWeekday;i++) grid.insertAdjacentHTML("beforeend",`<div class="np83-day empty"></div>`);

  Object.entries(m.events).forEach(([day,value])=>{
    // rendered below after all cells are known
  });

  for(let day=1;day<=m.days;day++){
    const info=m.events[String(day)] || {};
    const d=adDateForMonthDay(m,day);
    const weekday=d.getUTCDay();
    const isToday=(calendarData.today && calendarData.today.month===monthIndex+1 && calendarData.today.day===day);
    const el=document.createElement("button");
    el.type="button";
    el.className="np83-day";
    if(weekday===6) el.classList.add("saturday");
    if(isToday) el.classList.add("today");
    if(selectedDay===day) el.classList.add("selected");
    const eventNames=(info.events||[]);
    el.innerHTML=`
      <span class="np83-bs">${np(day)}</span>
      <span class="np83-ad">${formatAd(d)}</span>
      <span class="np83-tithi">${info.tithi||""}</span>
      ${eventNames.length?`<span class="np83-events">${eventNames.map(()=>'<i class="np83-event-dot"></i>').join("")}</span>`:""}
      ${eventNames.length?`<span class="np83-event-name">${eventNames[0]}</span>`:""}
    `;
    el.addEventListener("click",()=>{selectedDay=day;render();renderSidebar();});
    grid.appendChild(el);
  }
}

function allMonthEvents(){
  const out=[];
  MONTHS.forEach((m,mi)=>{
    Object.entries(m.events||{}).forEach(([day,v])=>{
      (v.events||[]).forEach(name=>out.push({month:mi+1,monthName:m.name,day:Number(day),name}));
    });
  });
  return out;
}

function renderSidebar(){
  const box=document.getElementById("np83-side-content");
  if(!box)return;
  if(activeTab==="saits"){
    const items=calendarData.sidebar?.saits||{};
    box.innerHTML=Object.entries(items).map(([name,days])=>`
      <div class="np83-side-item">
        <div class="np83-side-name">${name}</div>
        <div class="np83-side-date">${days.map(x=>np(x)).join("  ")}</div>
      </div>`).join("") || `<div class="np83-side-empty">साइत जानकारी उपलब्ध छैन।</div>`;
    return;
  }
  if(activeTab==="holidays"){
    const items=calendarData.sidebar?.holidays||[];
    box.innerHTML=items.map(x=>`<div class="np83-side-item"><div class="np83-side-date">${np(x.day)} ${x.month}</div><div class="np83-side-name">${x.name}</div></div>`).join("") || `<div class="np83-side-empty">आगामी बिदा जानकारी उपलब्ध छैन।</div>`;
    return;
  }
  const items=allMonthEvents().filter(x=>x.month===monthIndex+1);
  box.innerHTML=items.map(x=>`<div class="np83-side-item"><div class="np83-side-date">${np(x.day)} ${x.monthName}</div><div class="np83-side-name">${x.name}</div></div>`).join("") || `<div class="np83-side-empty">यस महिनामा सूचीबद्ध पर्व छैन।</div>`;
}

function init(){
  document.querySelectorAll("[data-np83-tab]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      activeTab=btn.dataset.np83Tab;
      document.querySelectorAll("[data-np83-tab]").forEach(b=>b.classList.toggle("active",b===btn));
      renderSidebar();
    });
  });
  document.getElementById("np83-prev")?.addEventListener("click",()=>{monthIndex=(monthIndex+11)%12;selectedDay=null;render();renderSidebar();});
  document.getElementById("np83-next")?.addEventListener("click",()=>{monthIndex=(monthIndex+1)%12;selectedDay=null;render();renderSidebar();});
  document.getElementById("np83-month")?.addEventListener("change",e=>{monthIndex=Number(e.target.value);selectedDay=null;render();renderSidebar();});
  document.getElementById("np83-today")?.addEventListener("click",()=>{
    const today=calendarData.today;
    if(today){monthIndex=today.month-1;selectedDay=today.day;render();renderSidebar();}
    document.getElementById("calendar2083")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  render();
  renderSidebar();
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();
