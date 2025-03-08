import './NavBar.css';
import { Link } from 'react-router-dom';
import { MagnifyingGlass } from '@phosphor-icons/react';
function NavBar(){
    return(
        <>
            <nav className='NavBar'>
                <ul className='NavBar'>
                    <li className='li'><Link to="/settings">Settings</Link></li>
                    <li className='li'><Link to="/profile">Profile</Link></li>
                    <label htmlFor="search" className='li'>Search</label>
                </ul>
                <form>
                    <input type="text" name='search' className='navSearch' /> 
                    <button type="submit">Search</button>
                </form>
            </nav>
            <hr className='hr'/>
        </>
    );
}
export default NavBar;