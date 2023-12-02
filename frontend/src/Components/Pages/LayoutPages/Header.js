import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {NavDropdown} from "react-bootstrap";

function Header() {
    const location = useLocation();
    const isActiveRoute = (route) => {
        return location.pathname === route;
    };

    return (
        <nav className="navbar navbar-light navbar-expand-md py-3">
            <div className="container">
                <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-3"><span
                    className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navcol-3">
                    <ul className="navbar-nav mx-auto">
                            <>
                                <li className='nav-item' style={{fontWeight: 'bold'}}><Link to='/'
                                                                                            className={`nav-link${isActiveRoute('/') ? ' active' : ''}`}>
                                    Home</Link></li>
                            </>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;