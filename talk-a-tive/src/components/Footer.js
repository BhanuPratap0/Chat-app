import React from 'react'
import { ModeState } from '../Context/ModeProvider';

const Footer = () => {

    const {position} = ModeState();

    return (
        <footer style={{width:"100%",bottom:"0",flexDirection: "column"}}  id="sticky-footer" className="py-4 bg-dark text-white-50"  >
            <div className="container" >
                <small style={{display:"flex", justifyContent:"center"}}>Made With &nbsp; <g-emoji class="g-emoji" alias="heart" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png">
<img class="emoji" alt="heart" height="20" width="20" src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png"/></g-emoji> &nbsp;by Bhanu Pratap Singh</small>
            </div>
        </footer>
    )
}

export default Footer
