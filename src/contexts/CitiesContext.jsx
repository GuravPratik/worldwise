/* eslint-disable react/prop-types */
import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    default:
      throw new Error("unknown action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch("http://localhost:8000/cities");
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
        // setCities(data);
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "Their is the error while loading the cities...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCityData = useCallback(
    async function getCityData(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const response = await fetch(`http://localhost:8000/cities/${id}`);
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
        // setCurrentCity(data);
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "Their is the error while getting a city data...",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`http://localhost:8000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
      // setCities((cities) => [...cities, data]);
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Their is the error while creating a city...",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`http://localhost:8000/cities/id`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Their is the error while deleting a city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCityData,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Context is used outside of the scope");

  return context;
}

export { CitiesProvider, useCities };
