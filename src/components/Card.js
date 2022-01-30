import React, { useState } from 'react';
import queryString from 'query-string';
function Card({ item, setvid, setPrivate }) {
  var thumb = '';
  if (item.src.includes('youtube')) {
    let qsp = queryString.parse(item.src);
    thumb = `http://img.youtube.com/vi/${qsp['https://www.youtube.com/watch?v']}/hqdefault.jpg`;
    console.log(qsp);
  }
  return (
    <div
      className='card'
      onClick={() => {
        setvid(item.id);
        setPrivate();
      }}
    >
      {thumb === '' ? (
        <video alt='thum' className='thumb' src={item.src} />
      ) : (
        <img alt='thum' className='thumb' src={thumb} />
      )}{' '}
      <div id='card-title' style={{ textAlign: 'center' }}>
        {item.name}
      </div>
    </div>
  );
}

export default Card;
