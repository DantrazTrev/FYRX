import React ,{useState} from 'react';
import './index.css';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
function Library() {
  const [currTab,setTab]=useState('ex')
  return (
    <>
     <nav className="nav">
            <h3>Library</h3>
          </nav>
    <main>

    <div className='overlay sidebar'>
    <ul className='options'>
  <li className={currTab==='ex'?"sel":""} onClick={()=>{setTab('ex')}}  >   <h3># Explore</h3></li>
    <li className={currTab==='em'?"sel":""} onClick={()=>{setTab('em')}}>   <h3>😃 Emotions</h3></li>
      <li className={currTab==='up'?"sel":""} onClick={()=>{setTab('up')}}>   <h3>▷ Your Uploads</h3></li>
    </ul>

    </div>
    </main>

    </>
  );
}

export default Library;
