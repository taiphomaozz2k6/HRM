import './modules/utilsModule.js';
import { initAuth, currentSession, login, logout } from './modules/authModule.js';
import { initEmployees } from './modules/employeeDbModule.js';
import { initDepartments, renderDepartments } from './modules/departmentModule.js';
import { initPositions, renderPositions } from './modules/positionModule.js';
import { renderAdd } from './modules/addEmployeeModule.js';
import { renderEdit } from './modules/editEmployeeModule.js';
import { renderDelete } from './modules/deleteEmployeeModule.js';
import { renderSearch } from './modules/searchEmployeeModule.js';
import { renderSalary } from './modules/salaryModule.js';
import { renderAttendance } from './modules/attendanceModule.js';
import { renderLeave } from './modules/leaveModule.js';
import { renderPerformance } from './modules/performanceModule.js';

const view = document.getElementById('view');
const userStatus = document.getElementById('userStatus');

const init = async ()=>{
  await initAuth(); initEmployees(); initDepartments(); initPositions();
  bindMenu(); renderRoute('dashboard'); updateUserStatus();
};

const updateUserStatus = ()=>{ const s = currentSession(); userStatus.textContent = s ? `User: ${s.username} (${s.role})` : 'Not logged in'; document.getElementById('logoutBtn').style.display = s ? 'block':'none'; };

const bindMenu = ()=>{
  document.getElementById('menu').addEventListener('click', e=>{
    const li = e.target.closest('li[data-view]'); if(!li) return; const viewName = li.dataset.view; if(!currentSession()) return showLogin(); renderRoute(viewName);
  });
  document.getElementById('logoutBtn').addEventListener('click', ()=>{ logout(); updateUserStatus(); showLogin(); });
};

const showLogin = ()=>{
  view.innerHTML = `<h3>Login</h3><form id="loginForm"><div class="form-row"><input name="username" placeholder="Tên đăng nhập (admin)"/></div><div class="form-row"><input name="password" placeholder="Mật khẩu (Mật khẩu- admin)" type="password"/></div><div class="form-row"><button class="btn" type="submit">Login</button></div></form>`;
  const f = document.getElementById('loginForm'); f.addEventListener('submit', async e=>{ e.preventDefault(); const fd = new FormData(f); try{ await login({username: fd.get('username'), password: fd.get('password')}); alert('Login OK'); updateUserStatus(); renderRoute('dashboard'); }catch(err){ alert(err.message); } });
};

function renderRoute(name){
  switch(name){
    case 'dashboard': view.innerHTML = `<h3>Dashboard</h3><p class="small">Chọn chức năng từ menu</p>`; break;
    case 'add': renderAdd(view); break;
    case 'edit': renderEdit(view); break;
    case 'delete': renderDelete(view); break;
    case 'search': renderSearch(view); break;
    case 'departments': renderDepartments(view); break;
    case 'positions': renderPositions(view); break;
    case 'salary': renderSalary(view); break;
    case 'attendance': renderAttendance(view); break;
    case 'leave': renderLeave(view); break;
    case 'performance': renderPerformance(view); break;
    default: view.innerHTML = '<p>Không tìm thấy</p>';
  }
}

// on load
init();
