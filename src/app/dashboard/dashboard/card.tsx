'use client'



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, User, UserCheck2Icon, ViewIcon } from "lucide-react";

export function CardWithForm({ dataItem }: any) {
    const { title, Icon, data } = dataItem;
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{title}</CardTitle>
                <Icon />
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>+{data}</div>
                <p className='text-xs text-muted-foreground'>
                    +{data}% from last month
                </p>
            </CardContent>
        </Card>
    )
}

export default function CardWithFormList({ data }: any) {
    const cartItem = [
        { title: "Students", Icon: UserCheck2Icon, data: data.student },
        { title: "Teachers", Icon: User, data: data.role },
        { title: "Attendance", Icon: CheckCircle, data: data.attendance },
        { title: "Visitor", Icon: ViewIcon, data: 1500 },
    ];
    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {cartItem.map((item, index) => (
                <CardWithForm key={index} dataItem={item} />
            ))}
        </div>
    )
}


