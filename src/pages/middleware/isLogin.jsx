import { Navigate } from 'react-router-dom'

const IsLogin = ({ children }) => {
  const authentication = localStorage.getItem('access_token')
  return authentication ? children : <Navigate to='/' replace />
}

export default IsLogin