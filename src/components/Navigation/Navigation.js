import React from 'react';
import './Navigation.css';

const Navigation = () => {
    return(
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p className='f3 link white pa3 pointer'>Sign out</p>
        </nav>
    );
}

export default Navigation;