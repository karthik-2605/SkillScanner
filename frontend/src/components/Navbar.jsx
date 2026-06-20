import {NavLink} from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <div className="logo_heading_links">
        <div className="logo_heading">
          <i className="fa-solid fa-file"></i>
          <h2>Skill Scanner</h2>
        </div>

        <div className="links">
          <div className="links_child">
            <i className="fa-regular fa-file" ></i>
            <NavLink className={(e)=>{return e.isActive ? "blue":""}} to="/">Upload Resume</NavLink>
          </div>

          <div className="links_child">
            <i className="fa-solid fa-chart-column"></i>
            <NavLink className={(e)=>{return e.isActive?"blue":""}} to="/dashboard">Dashboard</NavLink>
          </div>

          <div className="links_child">
            <i className="fa-solid fa-circle-user"></i>
            <NavLink className={(e)=>{return e.isActive?"blue":""}} to="/admin">Admin</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
