"use client"
import { createContext, ReactNode, useContext, useState } from "react";


type AppContextType = {

}
const ThemeContext = createContext<AppContextType | null>(null);

interface IProps {
    children: ReactNode
}
const AppProvider = (props: IProps) => {
    const [theme, setTheme] = useState<"LIGHT" | "DARK">("LIGHT");

    return (
        <ThemeContext.Provider value={{
            theme, setTheme,

        }}>
            {props.children}
        </ThemeContext.Provider>
    )
}
export default AppProvider;


//Custom hook
export const useCurrentApp = () => {
    const currentTheme = useContext(ThemeContext);
    if (!currentTheme) {
        throw new Error(
            "useCurrentApp has to be used within <AppContext.Provider>"
        );
    }
    return currentTheme;
}