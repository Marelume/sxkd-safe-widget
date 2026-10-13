export function numeric(value){return typeof value==='number'&&Number.isFinite(value)?value:null;}
export function decodeRecords(records){
  if(!Array.isArray(records)||records.length!==1)throw new Error('Cần đúng một dòng tổng hợp Dashboard.');
  const text=records[0]?.DuLieuDashboard;
  if(typeof text!=='string'||text.length>1000000)throw new Error('Chưa ánh xạ cột Dữ liệu Dashboard dạng Text.');
  const data=JSON.parse(text);
  if(data.version!==1||!Array.isArray(data.kpis))throw new Error('Dữ liệu Dashboard chưa đúng cấu trúc V1R3.');
  if(data.error)throw new Error(String(data.error));
  const seen=new Set();
  const kpis=data.kpis.map(k=>{
    if(!k||typeof k.code!=='string'||!k.code||seen.has(k.code))throw new Error('Mã chỉ tiêu thiếu hoặc trùng.');
    seen.add(k.code);
    return {code:k.code,label:String(k.label||k.code),unit:String(k.unit||'Chưa xác định đơn vị'),visible:k.visible===true,service:k.service===true,
      order:numeric(k.order)??9999,color:/^#[a-f\d]{6}$/i.test(k.color||'')?k.color:'#1268c4',group:String(k.group||''),
      week:numeric(k.week),weekNo:numeric(k.weekNo),month:numeric(k.month),plan:numeric(k.plan),year:numeric(k.year),
      ratio:numeric(k.month)!==null&&numeric(k.plan)!==null&&k.plan>0?k.month/k.plan*100:null,
      yearReason:String(k.yearReason||'Chưa đủ dữ liệu'),status:String(k.status||'')};
  }).filter(k=>k.visible).sort((a,b)=>a.order-b.order||a.code.localeCompare(b.code));
  const period=typeof data.period==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(data.period)?data.period:null;
  return {period,kpis};
}
