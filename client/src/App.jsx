import './App.css'
import io from 'socket.io-client'
import { Home } from './pages/Home/Home';
import { ContextProvider } from './ContextProvider/ContextProvider';

const socket = io("http://localhost:3000")

function App() {

  return (
      <ContextProvider>
        <Home socket={socket} />
      </ContextProvider>
  )
}

export default App
