import { Link } from 'react-router-dom';
import { MagnifyingGlass } from '@phosphor-icons/react';
import './NavBar.css';

function NavBar() {
  return (
    <nav className='navbar'>
      <div className='nav-container'>
        <div className='nav-brand'>
          <Link to="/" className='brand-link'>Admin Panel</Link>
        </div>
        
        <div className='nav-items'>
          <div className='search-container'>
            <MagnifyingGlass size={20} className='search-icon' />
            <input 
              type="text" 
              placeholder='Search users...' 
              className='search-input' 
            />
          </div>
          
          <div className='nav-links'>
            <Link to="/profile" className='nav-link'>
              <span className='link-text'>Profile</span>
            </Link>
            <Link to="/settings" className='nav-link'>
              <span className='link-text'>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;