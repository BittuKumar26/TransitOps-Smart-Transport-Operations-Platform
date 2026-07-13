import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('transitops_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('transitops_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrapAuth = async () => {
      if (!token) {
        if (active) {
          setAuthReady(true);
        }

        return;
      }

      try {
        const response = await getMe();
        const nextUser = response.data;

        if (active) {
          setUser(nextUser);
          localStorage.setItem('transitops_user', JSON.stringify(nextUser));
        }
      } catch (error) {
        if (active) {
          localStorage.removeItem('transitops_token');
          localStorage.removeItem('transitops_user');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      authReady,
      login: (nextToken, nextUser) => {
        localStorage.setItem('transitops_token', nextToken);
        localStorage.setItem('transitops_user', JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser);
        setAuthReady(true);
      },
      logout: () => {
        localStorage.removeItem('transitops_token');
        localStorage.removeItem('transitops_user');
        setToken(null);
        setUser(null);
        setAuthReady(true);
      }
    }),
    [token, user, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
