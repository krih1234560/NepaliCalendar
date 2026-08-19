let calendarData = null;
let MONTHS = null;
const NP_WEEKDAYS = ["आइतवार","सोमवार","मंगलवार","बुधवार","बिहिवार","शुक्रवार","शनिवार"];
const NP_DIGITS = "०१२३४५६७८९";
let monthIndex = 4;
let selectedDay = null;
let activeTab = "festivals";

const np = value => String(value).split("").map(x => NP_DIGITS[Number(x)] ?? x).join("");
const monthData = () => MONTHS[monthIndex];
const adDateForMonthDay = (month, day) => {
  const start = new Date(`${month.adStart}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() + day - 1);
  return start;
};
const formatAd = d => d.toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric", timeZone:"UTC"});

function monthHolidayCount(month){
  let count=0;
  for(let day=1; day<=month.days; day++){
    const weekday=adDateForMonthDay(month,day).getUTCDay();
    if(weekday===0 || weekday===6) count++;
  }
  return count;
}

function renderHolidaySummary(){
  const box=document.getElementById("np83-holiday-summary");
  if(!box)return;
  box.innerHTML = MONTHS.map((m,i)=>`
    <button type="button" class="np83-holiday-month ${i===monthIndex?'active':''}" data-month-index="${i}">
      <span>${m.name}</span><strong>${np(monthHolidayCount(m))}</strong><small>बिदा</small>
    </button>`).join("");
  box.querySelectorAll("[data-month-index]").forEach(btn=>btn.addEventListener("click",()=>{
    monthIndex=Number(btn.dataset.monthIndex); selectedDay=null; render(); renderSidebar(); renderHolidaySummary();
  }));
}

function render(){
  const m=monthData();
  document.getElementById("np83-month-name").textContent=`${m.name} ${calendarData.yearNepali}`;
  document.getElementById("np83-month-en").textContent=m.eng;
  document.getElementById("np83-month-subtitle").textContent=m.eng;
  const select=document.getElementById("np83-month");
  select.innerHTML=MONTHS.map((x,i)=>`<option value="${i}" ${i===monthIndex?'selected':''}>${x.name} · ${x.eng}</option>`).join("");
  document.getElementById("np83-weekdays").innerHTML=NP_WEEKDAYS.map((x,i)=>`<div class="${i===0||i===6?'holiday-weekday':''}">${x}</div>`).join("");
  const grid=document.getElementById("np83-grid"); grid.innerHTML="";
  const firstWeekday=adDateForMonthDay(m,1).getUTCDay();
  for(let i=0;i<firstWeekday;i++) grid.insertAdjacentHTML("beforeend",`<div class="np83-day empty"></div>`);
  for(let day=1;day<=m.days;day++){
    const info=m.events[String(day)]||{};
    const d=adDateForMonthDay(m,day); const weekday=d.getUTCDay();
    const isWeekend=weekday===0||weekday===6;
    const el=document.createElement("button"); el.type="button"; el.className="np83-day";
    if(weekday===0)el.classList.add("sunday"); if(weekday===6)el.classList.add("saturday"); if(isWeekend)el.classList.add("holiday");
    if(selectedDay===day)el.classList.add("selected");
    const eventNames=info.events||[];
    el.innerHTML=`<span class="np83-bs">${np(day)}</span><span class="np83-ad">${formatAd(d)}</span><span class="np83-tithi">${info.tithi||""}</span>${eventNames.length?`<span class="np83-events">${eventNames.map(()=>'<i class="np83-event-dot"></i>').join("")}</span><span class="np83-event-name">${eventNames[0]}</span>`:""}`;
    el.addEventListener("click",()=>{selectedDay=day;render();renderSidebar();}); grid.appendChild(el);
  }
  renderHolidaySummary();
}

function allMonthEvents(){
  const out=[]; MONTHS.forEach((m,mi)=>Object.entries(m.events||{}).forEach(([day,v])=>(v.events||[]).forEach(name=>out.push({month:mi+1,monthName:m.name,day:Number(day),name})))); return out;
}
function renderSidebar(){
  const box=document.getElementById("np83-side-content"); if(!box)return;
  if(activeTab==="saits"){
    const items=calendarData.sidebar?.saits||calendarData.sidebar?.sait||{};
    const entries=Array.isArray(items)?items:Object.entries(items).map(([name,days])=>({name,days}));
    box.innerHTML=entries.map(x=>`<div class="np83-side-item"><div class="np83-side-name">${x.name}</div><div class="np83-side-date">${(x.days||[]).map(np).join("  ")}</div></div>`).join("")||`<div class="np83-side-empty">साइत जानकारी उपलब्ध छैन।</div>`; return;
  }
  if(activeTab==="holidays"){
    const items=calendarData.sidebar?.holidays||[];
    box.innerHTML=items.map(x=>`<div class="np83-side-item"><div class="np83-side-date">${np(x.day)} ${x.month||""}</div><div class="np83-side-name">${x.name}</div></div>`).join("")||`<div class="np83-side-empty">आगामी बिदा जानकारी उपलब्ध छैन।</div>`; return;
  }
  const items=allMonthEvents().filter(x=>x.month===monthIndex+1);
  box.innerHTML=items.map(x=>`<div class="np83-side-item"><div class="np83-side-date">${np(x.day)} ${x.monthName}</div><div class="np83-side-name">${x.name}</div></div>`).join("")||`<div class="np83-side-empty">यस महिनामा सूचीबद्ध पर्व छैन।</div>`;
}

function init(){
  document.querySelectorAll("[data-np83-tab]").forEach(btn=>btn.addEventListener("click",()=>{activeTab=btn.dataset.np83Tab;document.querySelectorAll("[data-np83-tab]").forEach(b=>b.classList.toggle("active",b===btn));renderSidebar();}));
  document.getElementById("np83-prev")?.addEventListener("click",()=>{monthIndex=(monthIndex+11)%12;selectedDay=null;render();renderSidebar();});
  document.getElementById("np83-next")?.addEventListener("click",()=>{monthIndex=(monthIndex+1)%12;selectedDay=null;render();renderSidebar();});
  document.getElementById("np83-month")?.addEventListener("change",e=>{monthIndex=Number(e.target.value);selectedDay=null;render();renderSidebar();});
  document.getElementById("np83-today")?.addEventListener("click",()=>{const now=new Date();const i=MONTHS.findIndex(m=>{const start=new Date(`${m.adStart}T00:00:00Z`);const end=new Date(start);end.setUTCDate(end.getUTCDate()+m.days-1);return now>=start&&now<=end;});if(i>=0){monthIndex=i;selectedDay=Math.floor((now-new Date(`${MONTHS[i].adStart}T00:00:00Z`))/86400000)+1;render();renderSidebar();}});
  render(); renderSidebar();
}
async function loadDataAndInit(){
  try{
    const res = await fetch("./calendar-2083.json");
    if(!res.ok) throw new Error(`Failed to load calendar-2083.json: ${res.status}`);
    calendarData = await res.json();
    MONTHS = calendarData.months;
    init();
  }catch(err){
    console.error("Nepali Calendar 2083: failed to load data", err);
    const grid=document.getElementById("np83-grid");
    if(grid) grid.innerHTML = `<div class="np83-side-empty">पात्रो डाटा लोड हुन सकेन। पछि पुन: प्रयास गर्नुहोस्।</div>`;
  }
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",loadDataAndInit);else loadDataAndInit();
