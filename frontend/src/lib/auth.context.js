import { useLocation, useNavigate } from "react-router-dom";

const {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} = require("react");

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  function register(email, password) {
    (async function () {
      setError(undefined);
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email.toLowerCase(),
            password: password,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) setError(data.message);
      else {
        setUser(data.user);
      }
      setLoading(false);
    })();
  }

  function login(email, password) {
    (async function () {
      setError(undefined);
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email.toLowerCase(),
            password: password,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) setError(data.message);
      else {
        setUser(data.user);
      }
      setLoading(false);
    })();
  }

  function logout() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
      method: "DELETE",

      credentials: "include",
    }).then((response) => {
      setUser(undefined);
      // navigate("/login");
    });
  }

  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/whoami`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        // navigate("/dashboard");
      }
      // else {
      //   setError(data.message)
      // }
      setLoadingInitial(false);
    })();
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      register,
      login,
      logout,
      setError,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={{ ...memoedValue }}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
