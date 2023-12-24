import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
import { ModeState } from './Context/ModeProvider';
import Footer from './components/Footer';

function App() {
  const {mode} = ModeState();

  return (
    <div className="App" style={{backgroundImage: mode=='light'?'url(' + require('./Pages/images/bg.jpg') + ')': 'url(' + require('./Pages/images/dark-bg.jpg') + ')'}}>
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/chats' element={<ChatPage/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
