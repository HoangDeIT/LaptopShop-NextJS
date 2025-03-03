import { Button, Checkbox, Container, Divider, Drawer, FormControlLabel, Input, TextField } from "@mui/material"
import Box from '@mui/material/Box';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Logo from "@/../public/logo.png"
import Image from "next/image";
import { useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCurrentApp } from "@/context/app.context";
import { addCartQuantity, deleteCart, subCartQuantity } from "@/utils/action/actionUser";
import { useRouter } from "next/navigation";
interface IProps {
    open: boolean,
    setOpen: (v: boolean) => void
}


const CartDrawer = (props: IProps) => {
    const { open, setOpen } = props
    const { cart, fetchCart, setCart, ticks, setTicks, fetchCartWithOutCallApi } = useCurrentApp();
    const router = useRouter();
    const CartDetail = ({ cart, index }: { cart: ICart, index: number }) => {
        const isChecked = ticks.findIndex((t) => cart.id == t) !== -1
        return (
            <Box sx={{ flexGrow: 1, }}>
                <Box sx={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "stretch"
                }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 3, margin: "20px 0" }}>
                        <Image style={{ border: "1px solid #ccc", borderRadius: "5px" }} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${cart?.product?.mainImage}`} width={100} height={100} alt="just image" />
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            flexDirection: "column",
                            height: "100px"
                        }}>
                            <h4 style={{ margin: 0 }}>Laptop msi</h4>
                            <p style={{ margin: 0, fontSize: "12px", color: "#ccc" }}>100$ *3</p>
                            <Box display="flex" alignItems="center">
                                <button
                                    style={{
                                        borderRadius: "5px",
                                        width: "30px",
                                        height: "30px",
                                        backgroundColor: "inherit",
                                        border: "1px solid #ccc",
                                        cursor: "pointer"
                                    }}
                                    disabled={cart.quantity === 1}
                                    onClick={() => {
                                        subCartQuantity(cart.id)
                                        fetchCartWithOutCallApi(cart.id, "sub")
                                    }}
                                >
                                    <RemoveIcon sx={{ fontSize: "10px" }} />
                                </button>
                                <input
                                    defaultValue={cart.quantity}

                                    style={{
                                        border: "none",
                                        outline: "none",
                                        width: "40px",
                                        textAlign: "center"
                                    }}

                                />
                                <button
                                    style={{
                                        borderRadius: "5px",
                                        width: "30px",
                                        height: "30px",
                                        backgroundColor: "inherit",
                                        border: "1px solid #ccc",
                                        cursor: "pointer"

                                    }}
                                    onClick={() => {
                                        addCartQuantity(cart.id)
                                        fetchCartWithOutCallApi(cart.id, "add")
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: "10px" }} />
                                </button>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "space-between",
                        flexDirection: "column"
                    }}>
                        <div onClick={() => {
                            deleteCart(cart.id)
                            fetchCartWithOutCallApi(cart.id, "remove")
                        }}>
                            <Button>
                                <CloseIcon color="error" />
                            </Button>

                        </div>
                        <Checkbox
                            onClick={() => {
                                isChecked ? setTicks(ticks.filter((t) => t !== cart.id)) : setTicks([...ticks, cart.id])
                            }}
                            checked={isChecked} />
                    </Box>
                </Box>
            </Box>

        )
    }
    const DrawerList = (
        <Box sx={{ width: "400px", padding: "20px", display: "flex", flexDirection: "column", height: "100%" }} role="presentation" >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                }}>
                    <LocalMallOutlinedIcon sx={{ fontSize: 20 }} />
                    <p style={{ alignItems: "center" }}>3 item</p>
                </div>
                <div onClick={() => setOpen(false)}>
                    <Button>
                        <CloseIcon color="secondary" />
                    </Button>
                </div>
            </Box>
            <Divider sx={{ margin: "20px 0px" }} />

            <Box>
                <FormControlLabel
                    onClick={() => {
                        ticks.length === cart.length ? setTicks([]) : setTicks(cart.map((item) => item.id))
                    }}
                    control={<Checkbox
                        checked={ticks.length === cart.length} />}
                    label="Check all" />
            </Box>
            <Divider sx={{ margin: "20px 0px" }} />
            <div style={{ minHeight: "80vh" }}>
                {cart.map((item, index) => (
                    <CartDetail key={item.id} cart={item} index={index} />
                ))}

            </div>



            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 3 }}>
                <Button
                    onClick={() => fetchCart()}
                    variant="outlined" sx={{ width: "40%" }}>Reload cart</Button>
                <Button variant="contained" sx={{ width: "60%" }}

                    onClick={() => {
                        setOpen(false)
                        router.push(`/order?cartsId=${ticks.join(",")}`)
                    }}
                >Check out ({cart.reduce((total, item) => ticks.includes(item.id) ? total + item.quantity * item.product.price : total, 0)} USD)</Button>
            </Box>

        </Box>
    );

    return (
        <Drawer
            anchor={"right"}
            open={open}
            onClose={() => setOpen(false)}
            slotProps={{
                backdrop: {
                    style: {
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(5px)"
                    }
                }
            }}
            SlideProps={{
                style: {
                    borderRadius: "20px 0 0 20px",
                    boxSizing: "border-box",
                    border: "1px solid red",
                    width: "400px",
                    overflowX: "hidden"
                }
            }}

        >
            {DrawerList}
        </Drawer>
    )
}
export default CartDrawer