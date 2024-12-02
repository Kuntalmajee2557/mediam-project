import React from 'react'

function Button({content, onclickHandler}) {
  return (
    <div>
      <button className='bg-black text-white p-2 m-1 rounded-md mt-4' onClick={onclickHandler}>{content}</button>
    </div>
  )
}

export default Button