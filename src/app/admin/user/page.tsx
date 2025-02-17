import ManageUser from "@/component/layout/admin/user/manage.user";
import { sendRequest } from "@/utils/api";
import { Table } from "@mui/joy"
import { Button } from "@mui/material";
const rows = [
    { name: 'Frozen yoghurt', calories: 159, fat: 6.0, protein: 24, carbs: 4.0 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9.0, protein: 37, carbs: 4.3 },
    { name: 'Eclair', calories: 262, fat: 16.0, protein: 24, carbs: 6.0 },
    { name: 'Cupcake', calories: 305, fat: 3.7, protein: 67, carbs: 4.3 },
    { name: 'Gingerbread', calories: 356, fat: 16.0, protein: 49, carbs: 3.9 }
];

const ManageUserPage = async () => {

    return (
        <>

            <ManageUser />
        </>
    )
}
export default ManageUserPage