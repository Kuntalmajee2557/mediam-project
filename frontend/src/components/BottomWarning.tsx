import React from 'react'

function BottomWarning({text, buttontext, onclickHandler}) {
  return (
    <div className='w-72 flex justify-center'>
      <p>{text}</p>
      <button className='px-1 underline' onClick={onclickHandler}>{buttontext}</button>
    </div>
  )
}

export default BottomWarning