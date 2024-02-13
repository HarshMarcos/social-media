import './App.css'
import { Route, Routes } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import PostForm from './components/post/PostForm';

function App() {


  return (
    <Routes>
      <Route exact path='/signup' element={<Signup />} />
      <Route exact path='/login' element={<Login />} />
      <Route path='/' element={<Home />} />
      <Route path='/new-post' element={<PostForm />} />
    </Routes>
  )
}

export default App
