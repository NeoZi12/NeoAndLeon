// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";

// יצירת הקונטקסט
export const AuthContext = createContext();

// קומפוננטת Provider שמכילה את המשתמש
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // סנכרון עם localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// הוק מותאם אישית לצורך שימוש נוח
export const useAuth = () => useContext(AuthContext);
