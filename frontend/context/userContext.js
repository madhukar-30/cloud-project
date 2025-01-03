"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [navTracker, setNavTracker] = useState(false);

  const [email, setEmail] = useState('');

  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    email: "",
    fname: "",
    lname: "",
    files: [],
  });

  const user = session?.user?.email || null;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      if (user) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_MAIN_ROUTE}/api/users/email?email=${user}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch user details");
          }

          const userData = await res.json();
          setUserData(userData);
          setEmail(userData?.email);
          setAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        userData,
        authenticated,
        loading,
        setLoading,
        navTracker,
        setNavTracker,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
