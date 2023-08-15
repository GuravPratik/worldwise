import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import CityList from "./components/CityList";
import City from "./components/City";
import CountriesList from "./components/CountriesList";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthContextProvider } from "./contexts/FakeAuthContext";

// import Homepage from "./Pages/Homepage";
// import Product from "./Pages/Product";
// import Pricing from "./Pages/Pricing";
// import ProtectedRoutes from "./Pages/ProtectedRoutes";
// import PageNotFound from "./Pages/PageNotFound";
// import Login from "./Pages/Login";
// import AppLayout from "./Pages/AppLayout";

const Homepage = lazy(() => import("./Pages/Homepage"));
const Product = lazy(() => import("./Pages/Product"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const ProtectedRoutes = lazy(() => import("./Pages/ProtectedRoutes"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));
const AppLayout = lazy(() => import("./Pages/AppLayout"));
const Login = lazy(() => import("./Pages/Login"));

function App() {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(function () {
  //   async function fetchCities() {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch("http://localhost:8000/cities");
  //       const data = await response.json();
  //       setCities(data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchCities();
  // }, []);

  return (
    <AuthContextProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route
                path="app"
                element={
                  <ProtectedRoutes>
                    <AppLayout />
                  </ProtectedRoutes>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountriesList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthContextProvider>
  );
}

export default App;
