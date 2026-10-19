import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import Calendar from './pages/Calendar/Calendar'
import Footer from './components/Footer/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import Standings from './pages/Standings/Standings'
import Drivers from './pages/Drivers/Drivers'
import DriverDetails from './pages/Drivers/DriverDetails'
import Teams from './pages/Teams/Teams'
import TeamDetails from './pages/Teams/TeamsDetails'


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element = { <Dashboard/> }/>
        <Route path='/standings' element={ <Standings/>}/>

        <Route path="/calendar" element={<Calendar />} />

        <Route path='/drivers' element={<Drivers/>}/>
        <Route path='/drivers/:driverId' element={ <DriverDetails/> }/>

        <Route path='/teams' element={ <Teams/> }/>
        <Route path='/teams/:teamId' element={ <TeamDetails/> }/>

      </Routes>
      <Footer/>

    </BrowserRouter>
  )
}

export default App