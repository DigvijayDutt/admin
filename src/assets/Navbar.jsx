import './Navbar.css';
import { Link } from 'react-router-dom';
function NavBar(){
    return(
        <>
            <nav className='NavBar'>
                <ul className='NavBar'>
                    <li className='li'><Link to="/settings">Settings</Link></li>
                    <li className='li'><Link to="/profile">Profile</Link></li>
                </ul>                
            </nav>
            <hr className='hr'/>
        </>
    );
}
export default NavBar;