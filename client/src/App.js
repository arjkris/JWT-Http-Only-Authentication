import { useEffect, useState } from 'react'
import { Box, Button, Input } from '@material-ui/core';
import axios from 'axios'
import cookie from 'universal-cookie'
import './App.css';

var Cookies = new cookie()

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const getToken = async () =>{
      try{
        var t = await axios.post('/reload').catch(function(eror){})
        setUser(t.data || null)
      }
      catch (err){}
    }
    getToken()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      var res = await axios.post('/login', { username, password })
      setUser(res.data)
      setSuccess(false)
      setError(false)
    }
    catch (err) {
      console.log(err)
    }
  }


  const handleDelete = async (id) => {
    setSuccess(false)
    setError(false)
    try {
      var res = await axios.delete('/users/' + id, {
        headers: { authorization: "Bearer " + user.accessToken }
      })
      setSuccess(true)
    }
    catch(err) {
      setError(true)
      console.log(err)
    }
  }

  const handleLogout = async (un) => {
    var id = 0;
    if(un === 'a')
      id=1
    else id = 2
    try{
      var res = await axios.post('/logout')
      setUser(null)
      setError(false)
      setSuccess(false)
    }
    catch (err){
      
    }
  }


  return (
    <div>
      {
        user ? (<div>
          <Box sx={style}>
            <center>Welcome to the <b>{user.isAdmin ? "Admin" : "user"} Dashboard</b></center>
            <div className='app__dashBoard'>
              <Button type='submit' variant='outlined' onClick={()=>handleDelete(1)}> Delete User A</Button>
              <Button type='submit' variant='outlined' onClick={()=>handleDelete(2)}>Delete User B</Button>
              <Button type='submit' variant='contained' onClick={()=>handleLogout(user.username)}>Logout</Button>
            </div>
            {
              success && (
                <div>
                  Successfully Deleted
                </div>
              )
            }
            {
              error && (
                <div>
                  Delete User Failed
                </div>
              )
            }
          </Box>
        </div>) : (<div>
          <Box sx={style}>
            <form onSubmit={handleSubmit} className='app__login'>
              <Input
                type='text'
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <Input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <Button type='submit'>Login</Button>
            </form>
          </Box>
        </div>
        )
      }
    </div>
  )

}
export default App;
