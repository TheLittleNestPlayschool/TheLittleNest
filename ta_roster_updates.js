import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{apiRequest}from'./ta_api.js';
const ROSTER_SUBMIT_API='https://x58r-xped-p4y6.n7e.xano.io/api:EpDLPKN0/ta_weekly_roster_submit';
const CALENDAR_READ_API='https://x58r-xped-p4y6.n7e.xano.io/api:EpDLPKN0/ta_session_calendar';

/*   Teacher class roster and calendar update intake*/
export function renderRosterUpdatesModule(){
clearWorkspace();
const workspace=getWorkspace();
if(!workspace)return;
const drafts={roster:'',update:''};
let kind='roster',calendarRequest=0,calendarData=null;
const root=document.createElement('section');
root.className='teacher-roster-updates';
root.innerHTML=`
<div class="teacher-roster-heading"><div class="teacher-roster-heading-icon" aria-hidden="true">📋</div><div><h2>Class Rosters &amp; Updates</h2></div></div>
<div class="teacher-roster-choices" aria-label="Choose what to send">
<button type="button" class="teacher-roster-choice is-active" data-roster-kind="roster" aria-pressed="true"><span class="teacher-roster-choice-icon" aria-hidden="true">📋</span><strong>Weekly Roster</strong><small>Paste your class list</small></button>
<button type="button" class="teacher-roster-choice" data-roster-kind="update" aria-pressed="false"><span class="teacher-roster-choice-icon" aria-hidden="true">🗓️</span><strong>Calendar Update</strong><small>Report a change</small></button>
<button type="button" class="teacher-roster-choice" data-roster-kind="calendar" aria-pressed="false"><span class="teacher-roster-choice-icon" aria-hidden="true">📅</span><strong>View Calendar</strong><small>Read-only schedule</small></button>
</div>
<div class="teacher-roster-calendar" id="teacherRosterCalendar" hidden>
<div class="nh-cal-toolbar"><div class="nh-cal-title" id="nhCalendarRange">Session Calendar</div><div class="nh-cal-tools"><span class="nh-cal-key"><b>E</b> Enrolled&nbsp; <b>M</b> Makeup&nbsp; <b>T</b> Free Trial&nbsp; <b>O</b> Open</span></div></div>
<p id="nhCalendarStatus" class="nh-calendar-status" role="status">Loading calendar…</p>
<div class="nh-scroll-hint">Swipe horizontally to see more days ↔</div>
<div class="nh-cal-scroll" id="nhCalendarScroll" tabindex="0" aria-label="Scrollable three-week session calendar"><div class="nh-cal-inner"><div class="nh-cal-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div id="nhCalendarGrid"></div></div></div>
<div class="nh-cal-legend"><span><i class="nh-cal-dot"></i>Today</span><span><i class="nh-cal-dot unset"></i>Not yet updated</span><span><i class="nh-cal-dot closed"></i>Closed</span></div>
</div>
<div class="teacher-roster-editor">
<h3 id="teacherRosterFormTitle">Submit Weekly Roster</h3>
<p class="teacher-roster-description" id="teacherRosterFormHelp">Copy your current Facebook class roster and paste it below. A complete week or a partial roster is fine.</p>
<label class="teacher-roster-label" for="teacherRosterText">Paste class roster</label>
<textarea id="teacherRosterText" class="teacher-roster-textarea" rows="5" spellcheck="false" placeholder="Paste the class roster from Facebook here…"></textarea>
<button type="button" class="teacher-roster-action" id="teacherRosterReview" disabled>Review Submission <span aria-hidden="true">→</span></button>
</div>
<div class="teacher-roster-review" hidden>
<h3>Review Your Submission</h3>
<p class="teacher-roster-description" id="teacherRosterReviewKind">Weekly Roster</p>
<pre class="teacher-roster-preview" id="teacherRosterPreview"></pre>
<button type="button" class="teacher-roster-action" id="teacherRosterSubmit">Submit and Save</button>
</div>
<div id="teacherRosterPopup" role="dialog" aria-modal="true" aria-labelledby="teacherRosterPopupTitle" hidden style="position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(26,38,47,.32);padding:20px;backdrop-filter:blur(5px)">
<div style="width:min(340px,100%);height:245px;box-sizing:border-box;border-radius:22px;background:#fff;padding:24px;text-align:center;box-shadow:0 20px 65px rgba(25,39,48,.22);display:flex;flex-direction:column;align-items:center;justify-content:center">
<div id="teacherRosterPopupIcon" style="font-size:34px;margin-bottom:10px">⏳</div>
<h3 id="teacherRosterPopupTitle" style="margin:0 0 10px;color:#263449;font-size:1.3rem">Submitting…</h3>
<p id="teacherRosterPopupMessage" style="margin:0;color:#637282;font-size:.92rem;line-height:1.5">Sending your weekly roster.</p>
<button type="button" id="teacherRosterPopupOk" class="teacher-roster-action" style="width:100%;margin-top:auto" hidden>OK</button>
</div>
</div>`;
workspace.append(root);
const $=id=>root.querySelector('#'+id),textarea=$('teacherRosterText'),reviewBtn=$('teacherRosterReview');
const editor=root.querySelector('.teacher-roster-editor'),review=root.querySelector('.teacher-roster-review'),submitBtn=$('teacherRosterSubmit');
const popup=$('teacherRosterPopup'),popupIcon=$('teacherRosterPopupIcon'),popupTitle=$('teacherRosterPopupTitle'),popupMessage=$('teacherRosterPopupMessage'),popupOk=$('teacherRosterPopupOk');
let submitting=false;
function showPopup(title,message,icon,buttonLabel='OK'){
popup.hidden=false;popup.style.display='flex';popupTitle.textContent=title;popupMessage.textContent=message;popupIcon.textContent=icon;
popupOk.hidden=buttonLabel===null;if(buttonLabel!==null)popupOk.textContent=buttonLabel;
}
function closePopup(){popup.style.display='none';popup.hidden=true;}
function updateReviewButton(){reviewBtn.disabled=!textarea.value.trim()}
function showKind(next){
if(kind!=='calendar')drafts[kind]=textarea.value;
kind=next;
root.querySelectorAll('[data-roster-kind]').forEach(button=>{const active=button.dataset.rosterKind===kind;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});
const calendar=kind==='calendar',roster=kind==='roster';
$('teacherRosterCalendar').hidden=!calendar;
editor.hidden=calendar;review.hidden=true;
if(calendar){loadCalendar();return}
$('teacherRosterFormTitle').textContent=roster?'Submit Weekly Roster':'Report Calendar Update';
$('teacherRosterFormHelp').textContent=roster?'Copy your current Facebook class roster and paste it below. A complete week or a partial roster is fine.':'Tell head office what changed. Include the date or day and session time when relevant.';
root.querySelector('label[for="teacherRosterText"]').textContent=roster?'Paste class roster':'What has changed?';
textarea.placeholder=roster?'Paste the class roster from Facebook here…':'Example: We are closed Tuesday due to a power interruption. Or: Wednesday 1:30 PM now has 2 enrolled children.';
textarea.value=drafts[kind];updateReviewButton();
}
root.querySelectorAll('[data-roster-kind]').forEach(button=>button.addEventListener('click',()=>showKind(button.dataset.rosterKind)));
textarea.addEventListener('input',()=>{drafts[kind]=textarea.value;updateReviewButton()});
reviewBtn.addEventListener('click',()=>{if(!textarea.value.trim())return;drafts[kind]=textarea.value;editor.hidden=true;root.querySelector('.teacher-roster-choices').hidden=true;review.hidden=false;submitBtn.disabled=false;submitBtn.textContent='Submit and Save';$('teacherRosterReviewKind').textContent=kind==='roster'?'Weekly Roster':'Calendar Update';$('teacherRosterPreview').textContent=textarea.value.trim()});
popupOk.addEventListener('click',()=>{const done=popupTitle.textContent==='Done';closePopup();if(done)document.getElementById('teacherHomeBack')?.click();});
submitBtn.addEventListener('click',async()=>{
if(submitting)return;
const rosterText=drafts[kind].trim();if(!rosterText)return;
submitting=true;submitBtn.disabled=true;showPopup('Submitting…',kind==='roster'?'Sending your weekly roster.':'Sending your calendar update.','⏳',null);
try{
const result=await apiRequest(ROSTER_SUBMIT_API,{method:'POST',body:{roster_text:rosterText}});
if(!result?.weekly_roster?.id)throw new Error('Submission response did not confirm a saved roster. Please check before resubmitting.');
drafts[kind]='';showPopup('Done',kind==='roster'?'Your weekly roster has been sent to head office.':'Your calendar update has been sent to head office.','✓');
}catch(error){
showPopup('Unable to submit',error instanceof Error?error.message:'Unable to submit roster.','!', 'OK');
submitBtn.disabled=false;
}finally{submitting=false;}
});
/*   Teacher read-only availability calendar — same display as NestHub*/
const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const calTodayParts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const calTodayFields=Object.fromEntries(calTodayParts.map(p=>[p.type,p.value]));
const calToday=new Date(Number(calTodayFields.year),Number(calTodayFields.month)-1,Number(calTodayFields.day),12);
function calendarKey(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0')}
function calendarAnchor(){const d=new Date(calToday);d.setDate(d.getDate()-d.getDay());return d}
function calendarDate(offset){const d=calendarAnchor();d.setDate(d.getDate()+offset);return d}
function calendarDateKey(value){if(typeof value==='number'){const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)}return String(value||'').slice(0,10)}
function calendarSessionsOn(date){const eligible=(calendarData?.sessions||[]).filter(s=>s.is_active===true&&s.display===true&&Array.isArray(s.scheduled_days)&&s.scheduled_days.some(day=>String(day).toLowerCase()===dayNames[date.getDay()].toLowerCase()));
eligible.sort((a,b)=>(String(b.description||'').toLowerCase()==='full session')-(String(a.description||'').toLowerCase()==='full session')||(b.scheduled_days?.length||0)-(a.scheduled_days?.length||0));
const unique=new Map();for(const s of eligible){const slot=String(s.start_time_slot)+'|'+String(s.end_time_slot);if(!unique.has(slot))unique.set(slot,s)}
return [...unique.values()].sort((a,b)=>String(a.start_time_slot).localeCompare(String(b.start_time_slot)))}
function renderCalendar(){
if(!calendarData)return;
const first=calendarDate(0),last=calendarDate(20);
$('nhCalendarRange').textContent=first.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' – '+last.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const records=new Map();for(const r of calendarData.calendar_records){records.set(calendarDateKey(r.calendar_date)+'|'+r.session_id,r)}
const grid=$('nhCalendarGrid');grid.replaceChildren();
for(let w=0;w<3;w++){const row=document.createElement('div');row.className='nh-cal-row';
for(let i=0;i<7;i++){const d=calendarDate(w*7+i),dateKey=calendarKey(d),ss=calendarSessionsOn(d),isToday=dateKey===calendarKey(calToday),cell=document.createElement('div');
const allClosed=ss.length&&ss.every(s=>records.get(dateKey+'|'+s.id)?.is_closed===true);
cell.className='nh-cal-day'+(isToday?' today':'')+(!ss.length||allClosed?' closed':'');
const num=document.createElement('div');num.className='nh-cal-day-num';num.textContent=d.getDate()===1?d.toLocaleDateString('en-US',{month:'short',day:'numeric'}):String(d.getDate());cell.append(num);
if(!ss.length){const closed=document.createElement('div');closed.className='nh-cal-closed';closed.textContent='Closed';cell.append(closed)}
else{
const headings=document.createElement('div');headings.className='nh-cal-headings';for(const value of ['Time','E','M','T','O']){const label=document.createElement('span');label.textContent=value;headings.append(label)}cell.append(headings);
for(const s of ss){const r=records.get(dateKey+'|'+s.id),closed=r?.is_closed===true,regular=r?.regular_count==null?null:Number(r.regular_count),makeup=r?.makeup_count==null?null:Number(r.makeup_count),trial=r?.trial_count==null?null:Number(r.trial_count),capacity=Number(s.max_students);
const known=regular!==null&&Number.isFinite(regular),total=known?regular+(makeup??0)+(trial??0):null;
const open=closed?'×':total===null||!Number.isFinite(capacity)?'—':Math.max(0,capacity-total);
const values=[String(s.start_time_slot||'').slice(0,5),known?regular:'—',r?(makeup??'—'):'—',r?(trial??'—'):'—',open];
const line=document.createElement('div');line.className='nh-cal-line';line.title=(s.name||'Class')+' · '+values[0]+'–'+String(s.end_time_slot||'').slice(0,5)+' · Enrolled '+values[1]+' · Makeup '+values[2]+' · Free trial '+values[3]+' · Open '+values[4];
values.forEach((value,idx)=>{const part=document.createElement('span');part.textContent=String(value);if(idx>0)part.className='nh-number';if(idx===4)part.className+=' nh-open '+(value==='—'?'unknown':value==='×'||value===0?'full':'ok');line.append(part)});cell.append(line)}
}row.append(cell)}
grid.append(row)}
}
async function loadCalendar(){
const request=++calendarRequest;calendarData=null;$('nhCalendarGrid').replaceChildren();$('nhCalendarStatus').textContent='Loading calendar…';
const params=new URLSearchParams({start_date:calendarKey(calendarDate(0)),end_date:calendarKey(calendarDate(20))});
try{const data=await apiRequest(CALENDAR_READ_API+'?'+params);
if(!Array.isArray(data.sessions)||!Array.isArray(data.calendar_records))throw new Error('Unexpected calendar response');if(request!==calendarRequest||!root.isConnected||kind!=='calendar')return;
calendarData=data;$('nhCalendarStatus').textContent=data.calendar_records.length?'':'Counts not yet updated for this period. Missing values are marked —.';renderCalendar();
const scroll=$('nhCalendarScroll');if(scroll.scrollWidth>scroll.clientWidth){const todayColumn=calToday.getDay(),dayWidth=scroll.scrollWidth/7;scroll.scrollLeft=Math.max(0,(todayColumn-1)*dayWidth)}else scroll.scrollLeft=0;
}catch(error){if(request===calendarRequest)$('nhCalendarStatus').textContent='Unable to load calendar: '+(error?.message||'Unknown error')}}

}
