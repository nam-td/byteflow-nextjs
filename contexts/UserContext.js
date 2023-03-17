"use client";

import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(null);
    return (
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}

