import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import { SignIn } from "./pages/signIn"
import { SignUp } from "./pages/signUp"

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
