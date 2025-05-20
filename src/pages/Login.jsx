import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../lib/axios'


const Login = () => {
    const [login,setLogin] = useState({
        email: "",
        password:""
    })

    let navigate = useNavigate()

    function LoginProces(e){
        e.preventDefault();
        API.post('/login', login)
  .then(res => {
    console.log(res);
    if (res.data.token) {
      localStorage.setItem('access_token', res.data.token);
      // Jika user tidak ada, jangan set user
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      navigate('/home');
    } else {
      console.warn("Token not found in response", res.data);
    }
  })
  .catch(err => {
    console.log(err);
    setError(err.response?.data || {});
  });

    }
const [error,setError] = useState([])
  return (
    <form action="" onSubmit={LoginProces}  className="min-h-screen flex items-center justify-center">
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
         {
                Object.keys(error).length > 0 ? (
                    <ol className="alert alert-danger">
                        {
                            Object.entries(error.data).length > 0 ?
                            Object.entries(error.data).map(([value]) => (
                                <li>{value}</li>
                            )) : error.message
                        }
                    </ol>
                ) : ''
            }
  <legend className="fieldset-legend">Login</legend>

  <label className="label">Email</label>
  <input type="email" className="input" name='email' placeholder="kafka@email.com" id='email' value={login.email} onChange={(e) =>setLogin({...login,email:e.target.value})} />

  <label className="label">Password</label>
  <input type="password" className="input" name='password' placeholder="****" id='password' value={login.password} onChange={(e) => setLogin({...login,password:e.target.value})}/>

  <button className="btn btn-neutral mt-4" type='submit'>Login</button>
</fieldset>
    </form>
  )
}

export default Login
