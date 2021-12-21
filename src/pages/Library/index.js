import React ,{useState} from 'react';
import './index.css';
import Sidebar from '../../components/Sidebar'
import LoginModal from '../../components/LoginModal'
import Cards from '../../components/Cards'

function Library() {
   
  const [loginModal,setModal] = useState(false)
  const [currTab,setTab]=useState('ex')
  return (
    <>
     <nav className="nav">
            <h3>Library</h3>
               <div className='login' onClick={()=>{setModal(!loginModal)}}>Login / Sign up</div>
          </nav>
    
<Sidebar currTab={currTab} setTab={setTab}/>
    <main className="main">
<Cards currTab={currTab}/>
    </main>
  { loginModal&& <LoginModal handleClose={()=>{setModal(false)}}/>
}
    </>
  );
}

export default Library;
