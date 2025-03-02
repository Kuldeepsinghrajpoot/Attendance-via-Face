import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
export function Role({ data }: any) {
    console.log(data);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Email</TableHead>
                    <TableHead className="">First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.getUser?.map((item: any) => (
                    <TableRow key={item?.id}>
                        <TableCell className="font-medium">
                            {item?.email}
                        </TableCell>
                        <TableCell className="font-medium">
                            {item?.firstName}
                        </TableCell>
                        <TableCell>{item?.lastName}</TableCell>
                        <TableCell>{item?.phone}</TableCell>
                        <TableCell className="text-right">
                            {item?.role}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4} className="space-x-4">
                        <span>Teacher</span>
                        <span>{data?.teacherCount}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-4">
                        <span>Admin</span>
                        <span>{data?.adminCount}</span>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
