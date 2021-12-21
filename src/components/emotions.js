import React from 'react'
function Emotion() {

    const emotions=[
        {emoji:'😀',name:'Happy',color:'#6a6a00'},
        {emoji:'☹️',name:'Sad',color:'blue'},
        {emoji:'😡',name:'Angry',color:'red'},
        {emoji:'😱',name:'Fearful',color:'black'},
        {emoji:'😁',name:'Cheery',color:'pink'},
        {emoji:'😳',name:'Suprising',color:'orange'},
    ]
    return (<>
         {emotions.map((emotion)=>{
             return(<div style={{backgroundColor:'#ffc100', fontSize:'2rem'}} className='card'>
               <div style={{position:'absolute', left:'10px', fontSize:'5rem'}}> {emotion.emoji}</div>
             <div style={{position:'absolute', right:'15px',bottom:'10px'}}>{emotion.name}</div></div>)
         })}
            </>
    )
}

export default Emotion
