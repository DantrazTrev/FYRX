import React from 'react';

function Card({ item, setvid }) {
  return (
    <div
      className='card'
      onClick={() => {
        setvid(item.id);
      }}
    >
      <img
        alt='thum'
        className='thumb'
        src='https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2825&q=80'
      />
    </div>
  );
}

export default Card;
