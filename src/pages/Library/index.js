import React ,{useState} from 'react';
import './index.css';
import Sidebar from '../../components/Sidebar'

import Cards from '../../components/Cards'
function Library() {
  const [currTab,setTab]=useState('ex')
  return (
    <>
     <nav className="nav">
            <h3>Library</h3>
          </nav>
    
<Sidebar currTab={currTab} setTab={setTab}/>
    <main className="main">
<Cards currTab={currTab}/>
    </main>

    </>
  );
}

export default Library;
