import './App.css'
import { Route, Routes } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {


  return (
    <Routes>
      <Route exact path='/signup' element={<Signup />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/' element={<Home />} />
    </Routes>
  )
}

export default App
