import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const RefusedMessage = ({ open, setOpen, message, setMessage }: { open: boolean, setOpen: (v: boolean) => void, message: string, setMessage: (v: string) => void }) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth='xl'
        // slotProps={{
        //     paper: {
        //         component: 'form',
        //         onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        //             event.preventDefault();
        //             const formData = new FormData(event.currentTarget);
        //             const formJson = Object.fromEntries((formData as any).entries());
        //             const email = formJson.email;
        //             console.log(email);
        //             setOpen(false);
        //         },
        //     },
        // }}
        >
            <DialogTitle>Reason for Refused</DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText> */}
                <TextField
                    sx={{
                        minWidth: 800
                    }}
                    autoFocus
                    required
                    margin="dense"
                    label="Message"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                // onKeyDown={(e) =>{
                //     if (e.key === "Enter") {
                //         e.preventDefault();
                //         const formData = new FormData(e.currentTarget.form as HTMLFormElement);
                //         const formJson = Object.fromEntries((formData as any).entries());
                //         const email = formJson.email;
                //         console.log(email);
                //         setOpen(false);
                //     }
                // }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setMessage("")
                    setOpen(false)
                }}>Cancel</Button>
                <Button onClick={() => setOpen(false)} type="submit">Submit</Button>
            </DialogActions>
        </Dialog>
    )
}
export default RefusedMessage