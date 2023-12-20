import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/chats' element={<ChatPage/>} />
      </Routes>
    </div>
  );
}

export default App;
