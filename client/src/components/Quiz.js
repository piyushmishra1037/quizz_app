import React from 'react'
import Questions from './Questions'

export default function Quiz() {
  // next button click handler
  function onNext(){
    console.log('On next click');
  }
  // previous button click handler
  function onPrev(){
    console.log('On prev click');
  }
  return (
    <div className='container'>
      <h1 className='title text-light'>Quiz_App</h1>
      {/* display question*/}
      <Questions> </Questions>      {/* display question number */}
      <div className='grid'>
        <button className='btn prev' onClick={onPrev}>Prev</button>
        <button className='btn next' onClick={onNext}>Next</button>

      </div>



    </div>
  )
}

