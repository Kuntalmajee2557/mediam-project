import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import axios from 'axios'

function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  function signupClickHandler(){
    navigate("/signup")
  }
  async function signinClickHandler(){
    const response = await axios.post('https://backend.kuntalmajee338.workers.dev/api/v1/user/signin', {
      email: email,
      password: password
    })

    alert(response.data.token) 
    console.log("response : " + response.data)
    // console.log(response.data.token)
    navigate("/dashboard", {state:{token: response.data.token}})
  }


  return (
    <div className="container bg-white h-screen max-w-full flex justify-center items-center" >
      <div className='wrapper py-28 px-48 rounded-md bg-slate-300'>
      <div className=' flex flex-col justify-center items-center bg-white border border-white h-1/3 px-7 py-10 rounded-md'>
        <Heading content='Sign Up' />
        <SubHeading content='Enter your information to log in your account' ></SubHeading>
        <InputBox label="Email" content='JhonDoe User' value={email} setValue={setEmail}></InputBox>
        <InputBox label="Password" content='12345' value={password} setValue={setPassword}></InputBox>

        <Button content="Sing in" onclickHandler={signinClickHandler}></Button>
        <BottomWarning text="Don't have an account?" buttontext='Sign  up' onclickHandler={signupClickHandler}></BottomWarning>

      </div>
      </div>

    </div>

  )
}

export default Signin