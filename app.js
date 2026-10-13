import {decodeRecords} from './model.js';
import {renderDashboard,showMessage} from './view.js';
let access='none',lastRecords=null;
const badge=document.querySelector('#connection');
function refresh(){
  if(access!=='read table'){
    document.querySelector('#kpis').replaceChildren();document.querySelector('#analysis').hidden=true;
    showMessage(access==='full'?'Quyền không phù hợp. Đổi về Read selected table; widget không dùng Full access.':'Cho phép Read selected table và ánh xạ cột Dữ liệu Dashboard.');return;
  }
  if(!lastRecords)return;
  try{renderDashboard(decodeRecords(grist.mapColumnNames(lastRecords)));}catch(e){document.querySelector('#kpis').replaceChildren();document.querySelector('#analysis').hidden=true;showMessage(e.message||'Không đọc được dữ liệu tổng hợp.');}
}
grist.onOptions((options,interaction)=>{
  access=interaction?.access_level||interaction?.accessLevel||'none';
  badge.textContent=access==='read table'?'Grist · Chỉ đọc bảng':access==='full'?'Cần giảm quyền':'Chưa được cấp quyền';refresh();
});
grist.onRecords(records=>{lastRecords=records;refresh();});
grist.ready({requiredAccess:'read table',columns:[{name:'DuLieuDashboard',title:'Dữ liệu Dashboard',type:'Text'}]});
