import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  function logoutHandler() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="navbar bg-base-100 px-4 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 text-sm">
            <li>
              <Link to="/memberIndex">Member</Link>
            </li>
            <li>
              <Link to="/bukuIndex">Buku</Link>
            </li>
            <li>
              <Link to="/minjamIndex">Peminjaman</Link>
            </li>
            <li>
              <Link to="/dendaIndex">Denda</Link>
            </li>
            <li>
              <Link to="/grafikIndex">Grafik</Link>
            </li>
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link to="/home" className="btn btn-ghost text-lg font-semibold">
          Perpus Wikrama
        </Link>
      </div>

      <div className="navbar-end">
        <div className="text-sm opacity-60">Guest</div>
      </div>
    </div>
  );
};

export default Navbar;
