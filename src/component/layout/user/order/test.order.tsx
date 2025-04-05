"use client";

import { useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Divider,
    Checkbox,
    Grid2,
    Card,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCurrentApp } from "@/context/app.context";



export default function CheckoutPage({ cart, isCart }: { cart?: ICart[], isCart?: boolean }) {
    const [shippingMethod, setShippingMethod] = useState("delivery");
    const { fetchCart } = useCurrentApp()
    const receiverAddress = useRef<HTMLInputElement>(null)
    const receiverPhone = useRef<HTMLInputElement>(null)
    const session = useSession();
    const router = useRouter()
    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ICart[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`, method: "POST",
            body: {
                receiverAddress: receiverAddress.current?.value,
                receiverPhone: receiverPhone.current?.value,
                carts: cart
            },
            headers: {
                type: isCart ? "Cart" : "buy-now",
                Authorization: `Bearer ${session?.data?.access_token}`,

            }
        })
        console.log(res)
        if (!res.error) {
            router.replace("/");
            fetchCart();
            receiverAddress.current!.value = ""
            receiverPhone.current!.value = ""
            toast.success("Thanh toán thành công");
        }
    }
    return (
        <Grid2 minHeight={"90vh"} container spacing={3} sx={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
            {/* Cột trái - Danh sách sản phẩm và form */}
            <Grid2 size={8} >
                <Typography variant="body2" sx={{ color: "#007aff", cursor: "pointer" }}>
                    &lt; Quay lại giỏ hàng
                </Typography>

                <Typography variant="h6" sx={{ margin: "20px 0" }}>
                    Sản phẩm trong đơn ({cart?.length})
                </Typography>

                {/* Danh sách sản phẩm */}
                {cart && cart.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${item.product.mainImage}`} alt={item.product.name} width={60} height={60} style={{ borderRadius: "5px" }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography fontSize={14} fontWeight="bold">
                                {item.product.name}
                            </Typography>
                            <Typography fontSize={12} sx={{ color: "#555", background: "#f5f5f5", display: "inline-block", padding: "3px 8px", borderRadius: "5px" }}>
                                Màu: {item.product.factory.name}
                            </Typography>
                        </Box>
                        <Typography fontSize={14} fontWeight="bold" color="red">
                            {item.product.price.toLocaleString()} USD * {item.quantity} = {(item.product.price * item.quantity).toLocaleString()} USD
                        </Typography>
                    </Box>
                ))}

                {/* Quà tặng */}
                {/* <Button variant="contained" color="warning" sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "center" }}>
                    <CardGiftcardIcon />
                    6 Quà tặng đơn hàng
                </Button> */}

                {/* Thông tin người đặt hàng */}
                <Typography variant="h6" sx={{ margin: "20px 0" }}>
                    Người đặt hàng
                </Typography>
                <TextField value={session.data?.user.userName} disabled fullWidth label="Họ và tên" variant="outlined" sx={{ marginBottom: "10px" }} />
                <TextField inputRef={receiverPhone} fullWidth label="Số điện thoại" variant="outlined" sx={{ marginBottom: "10px" }} />
                <TextField inputRef={receiverAddress} fullWidth label="Adress" variant="outlined" sx={{ marginBottom: "20px" }} />

                {/* Hình thức nhận hàng */}
                {/* <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    Hình thức nhận hàng
                </Typography>
                <RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                    <FormControlLabel value="delivery" control={<Radio />} label="Giao hàng tận nơi" />
                    <FormControlLabel value="store" control={<Radio />} label="Nhận tại cửa hàng" />
                </RadioGroup>

                <TextField fullWidth label="Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã" variant="outlined" sx={{ marginBottom: "10px" }} />
                <TextField fullWidth label="Ghi chú (Ví dụ: Hãy gọi tôi khi chuẩn bị xong)" variant="outlined" multiline rows={2} sx={{ marginBottom: "10px" }} />
                <FormControlLabel control={<Checkbox />} label="Nhờ người khác nhận hàng" /> */}
            </Grid2>

            {/* Cột phải - Thông tin đơn hàng (Sticky) */}
            <Grid2 size={4}>
                <Card
                    sx={{
                        position: "sticky",
                        top: "20px",
                        padding: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <Typography variant="h6">Thông tin đơn hàng</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography>Tổng tiền:</Typography>
                        <Typography fontWeight="bold">{cart?.reduce((total, item) => total + item.product.price * item.quantity, 0)}</Typography>
                    </Box>
                    {/* <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                        <Typography>Tổng khuyến mãi:</Typography>
                        <Typography fontWeight="bold" color="red">2.000.000 đ</Typography>
                    </Box> */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                        <Typography>Phí vận chuyển:</Typography>
                        <Typography fontWeight="bold">Miễn phí</Typography>
                    </Box>
                    <Divider sx={{ margin: "10px 0" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                        <Typography>Cần thanh toán:</Typography>
                        <Typography fontWeight="bold" color="red">{cart?.reduce((total, item) => total + item.product.price * item.quantity, 0)} USD</Typography>
                    </Box>
                    {/* <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                        <Typography>Điểm thưởng:</Typography>
                        <Typography fontWeight="bold" color="gold">+11,870</Typography>
                    </Box> */}

                    {/* Nút đặt hàng */}
                    <Button
                        onClick={() => handleSubmit()}
                        variant="contained" color="error" fullWidth sx={{ marginTop: "20px", fontSize: "16px", padding: "12px" }}>
                        Đặt hàng
                    </Button>

                    <Typography variant="body2" sx={{ color: "#777", textAlign: "center", marginTop: "10px" }}>
                        Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
                        <Typography component="span" sx={{ color: "#007aff", cursor: "pointer" }}>
                            Điều khoản dịch vụ
                        </Typography>{" "}
                        và{" "}
                        <Typography component="span" sx={{ color: "#007aff", cursor: "pointer" }}>
                            Chính sách xử lý dữ liệu cá nhân
                        </Typography>{" "}

                    </Typography>
                </Card>
            </Grid2>
        </Grid2>
    );
}
