import React, { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const navigate = useNavigate()
  async function signupClickHandler() {
    const response = await axios.post('https://backend.kuntalmajee338.workers.dev/api/v1/user/signup', {
      name: name,
      email: email,
      password: password
    })

    alert(response.data.token) 
    console.log("response : " + response.data)
    // console.log(response.data.token)
    navigate("/dashboard", {state:{token: response.data.token}})

  }
  function signinClickHandler() {
    navigate("/signin")
  }

  return (
    <div className="container bg-white h-screen max-w-full flex justify-center items-center" >
      <div className='wrapper py-28 px-48 rounded-md bg-slate-300'>
      <div className=' flex flex-col justify-center items-center bg-white border border-white h-1/3 px-7 py-10 rounded-md'>
        <Heading content='Sign Up' />
        <SubHeading content='Enter your information to create an account' ></SubHeading>
        <InputBox label="Name" content='JhonDoe' value={name} setValue={setName}></InputBox>
        <InputBox label="Email" content='Jhon' value={email} setValue={setEmail}></InputBox>
        <InputBox label="Password" content='12345' value={password} setValue={setPassword}></InputBox>

        <Button content="singup" onclickHandler={signupClickHandler}></Button>
        <BottomWarning text='Already have an account? ' buttontext='Sign  in' onclickHandler={signinClickHandler}></BottomWarning>



      </div>
      </div>

    </div>
  )
}

export default Signup