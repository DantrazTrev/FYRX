import React from 'react'

function Sidebar({currTab,setTab}) {
    return (
        
    <div className='overlay sidebar'>
    <ul className='options'>
  <li className={currTab==='ex'?"sel":""} onClick={()=>{setTab('ex')}}  >   <h3># Explore</h3></li>
    <li className={currTab==='em'?"sel":""} onClick={()=>{setTab('em')}}>   <h3>😃 Emotions</h3></li>
      <li className={currTab==='up'?"sel":""} onClick={()=>{setTab('up')}}>   <h3>▷ Your Uploads</h3></li>
      </ul>
    </div>
    )
}

export default Sidebar
