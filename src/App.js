import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loginpage from "./pages/auth/LoginPage";
import HomePageOne from "./pages/HomePageOne";
import ErrorPage from "./pages/ErrorPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import CalendarMainPage from "./pages/camp/camplist";
import DonorListPage from "./pages/donors/DonorListPage";
import AddRequesterPage from "./pages/requestor/AddRequesterPage";

function App() {
  return (
    <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          
        <Route path="/login" element={<Loginpage />} />
          <Route path="/"  element={<HomePageOne />} />
          
        <Route exact path='/camp' element={<CalendarMainPage />} />
        <Route exact path='/donor-list' element={<DonorListPage />} />
        <Route exact path='/add-requester' element={<AddRequesterPage />} />
        <Route exact path='*' element={<ErrorPage />} />
      </Routes>             
    </BrowserRouter>
  );
}

export default App;
