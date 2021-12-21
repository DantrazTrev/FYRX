import React from 'react'
import {useNavigate} from 'react-router-dom'
function Upload() {
    const Nav = useNavigate()
    return (<>
         
            <div className='card' onClick={()=>{Nav('/app') }} >
            <img className='ico'  src={require('../add.png')}/>
        </div>
        
            </>
    )
}

export default Upload
