"use client"
import { getCart } from "@/utils/action/actionUser";
import { Backdrop, CircularProgress } from "@mui/material";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


type AppContextType = {
    cart: ICart[],
    fetchCart: () => void,
    theme: "LIGHT" | "DARK",
    setTheme: React.Dispatch<React.SetStateAction<"LIGHT" | "DARK">>,
    setCart: React.Dispatch<React.SetStateAction<ICart[]>>,
    fetchCartWithOutCallApi: (id: number, action: "add" | "remove" | "sub") => void,
    setBackDrop: React.Dispatch<React.SetStateAction<boolean>>,
    backDrop: boolean
}
const ThemeContext = createContext<AppContextType | null>(null);

interface IProps {
    children: ReactNode,

}
const AppProvider = (props: IProps) => {
    const [theme, setTheme] = useState<"LIGHT" | "DARK">("LIGHT");
    const [cart, setCart] = useState<ICart[]>([])
    const [backDrop, setBackDrop] = useState(false)
    const fetchCart = async () => {
        setBackDrop(true);
        const res = await getCart();
        const ticks = res.map((item) => item.id);
        setCart(res);
        setBackDrop(false);
    }
    const fetchCartWithOutCallApi = (id: number, action: "add" | "remove" | "sub") => {
        setCart((prev) => {
            switch (action) {
                case "add":
                    return prev.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                case "sub":
                    return prev.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                    );
                case "remove":
                    return prev.filter((item) => item.id !== id);
                default:
                    return prev;
            }
        });

    };

    useEffect(() => {
        fetchCart();
    }, [])
    return (
        <ThemeContext.Provider value={{
            theme, setTheme,
            cart, fetchCart, setCart, fetchCartWithOutCallApi, backDrop, setBackDrop
        }}>
            {props.children}
            <BackDropEffect backDrop={backDrop} setBackDrop={setBackDrop} />
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

const BackDropEffect = ({ backDrop, setBackDrop }: { backDrop: boolean, setBackDrop: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={backDrop}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}