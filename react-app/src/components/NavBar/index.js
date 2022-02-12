import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginFormModal from '../Modals/LoginFormModal';
import SignupFormModal from '../Modals/SignupFormModal';
import ProfileButton from './ProfileButton';
import { loadCart } from '../../store/cart'
import Footer from './Footer';
import './NavBar.css';
import SearchBar from './search';


function NavBar({ loaded }) {
    const location = useLocation();
    const sessionUser = useSelector(state => state.session.user);
    const cartLength = useSelector(state => state.carts?.cart?.length);
    const dispatch = useDispatch();

    // console.log(cartLength?.length);
    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <ProfileButton user={sessionUser} />
        );
    } else {
        if (location.pathname === '/signup' || location.pathname === '/login') {
            sessionLinks = (<></>)
        } else {
            sessionLinks = (
                <>
                    <LoginFormModal />
                    <SignupFormModal />
                </>
            );
        }
    }

    useEffect( () => {
      dispatch(loadCart(sessionUser?.id))
    })

    return (
      <>
        <nav className="nav">
          <div className="nav_left">
            <NavLink id="nav_head" to="/">
              Remotely
            </NavLink>
          </div>
           <SearchBar />
          <div className="nav_right">{loaded && sessionLinks}</div>
          {!sessionUser?.id ? null: 
          <NavLink className="cart-icon" to="/cart">
            <i className="fas fa-shopping-cart"/>
            {<div className="shopping-cart-count">{cartLength}</div>}
          </NavLink>}
        </nav>
        <Footer />
      </>
    );
}

export default NavBar
