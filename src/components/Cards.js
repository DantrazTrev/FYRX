import React from 'react'
import Card from './Card'
import Emotions from './emotions'
const Cards= ({currTab})=> {
    const data=[1,2,3,4,45,45,45,4,34,34,34,]
    
    return (
        
       <>
       { currTab=="ex" &&(
        <div className="Cards">
        {data.map((item)=>{
            return(<Card item={item}/>)
        })}

        </div>)}
           { currTab=="em" &&(
        <div className="Cards">
       <Emotions/>

        </div>)}
</>        
        )

}

export default Cards
