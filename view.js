const nf=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2});
const pf=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1});
const textValue=n=>n===null?'Chưa có dữ liệu':nf.format(n);
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function metric(label,value,missing=false){const e=el('div','metric');e.append(el('span',null,label),el('strong',missing?'missing':null,value));return e;}
function track(value,cls){const t=el('div','track '+cls);const f=el('span','fill');f.style.width=`${value===null?0:Math.max(0,Math.min(100,value))}%`;t.append(f);return t;}
export function showMessage(message){document.querySelector('#message').textContent=message;document.querySelector('#message').hidden=!message;}
export function renderDashboard(model){
  const cards=document.querySelector('#kpis');cards.replaceChildren();
  document.querySelector('#period').textContent=model.period?'Kỳ '+model.period.slice(5)+'/'+model.period.slice(0,4)+' · Cập nhật từ bảng đã chọn':'Chưa có kỳ báo cáo';
  for(const k of model.kpis){
    const c=el('article','kpi');c.dataset.code=k.code;c.style.setProperty('--accent',k.color);
    c.append(el('h2','kpi-label',k.label),el('div','month-value',textValue(k.month)),el('p','unit','Lũy kế tháng · '+k.unit));
    if(k.group)c.append(el('p','kpi-group',k.group));
    const m=el('div','metrics');
    m.append(metric(k.weekNo===null?'Tuần gần nhất':'Tuần '+k.weekNo,textValue(k.week),k.week===null),metric('Kế hoạch tháng',textValue(k.plan),k.plan===null),
      metric('Lũy kế năm',k.year===null?'Chưa đủ dữ liệu':nf.format(k.year),k.year===null),metric('Hoàn thành tháng',k.ratio===null?'Chưa có tỷ lệ':pf.format(k.ratio)+'%',k.ratio===null));
    c.append(m,track(k.ratio,'kpi-track'));c.title=k.yearReason+(k.status?' · '+k.status:'');cards.append(c);
  }
  const services=model.kpis.filter(k=>k.service);
  const units=new Set(services.map(k=>k.unit));
  const chart=document.querySelector('#chart');const progress=document.querySelector('#progress');chart.replaceChildren();progress.replaceChildren();
  document.querySelector('#analysis').hidden=services.length===0;
  document.querySelector('#chart-unit').textContent=units.size===1?[...units][0]+' · Các chỉ tiêu dịch vụ, không cộng vào doanh thu công ty':'Mỗi dòng theo đơn vị của chỉ tiêu; không so sánh chéo đơn vị';
  const maxima=new Map([...units].map(u=>[u,Math.max(1,...services.filter(k=>k.unit===u).flatMap(k=>[k.month,k.plan]).filter(n=>n!==null&&n>=0))]));
  for(const k of services){
    const row=el('div','chart-row');row.append(el('div','chart-label',k.label+(units.size>1?' · '+k.unit:'')));
    const bars=el('div','bars');
    for(const [label,n,cls] of [['Kế hoạch',k.plan,'plan'],['Thực hiện',k.month,'actual']]){
      const line=el('div','bar-line');const t=track(n===null?null:n/maxima.get(k.unit)*100,cls);t.setAttribute('aria-label',label+': '+textValue(n)+' '+k.unit);
      line.append(t,el('span','bar-value',textValue(n)));bars.append(line);
    }
    row.append(bars);chart.append(row);
    const p=el('div','progress-item');const head=el('div','progress-head');head.append(el('span',null,k.label),el('strong',null,k.ratio===null?'Chưa có tỷ lệ':pf.format(k.ratio)+'%'));p.append(head,track(k.ratio,'actual'));progress.append(p);
  }
  showMessage(model.kpis.length?'':'Chưa có KPI được bật. Admin bật Hiện Dashboard trong ChiTieu.');
}
