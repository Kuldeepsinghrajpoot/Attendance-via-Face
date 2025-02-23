'use client'

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CardWithForm({ dataItem }: any) {
    const { title, Icon, data } = dataItem;
    return (
        <Card className="w-[400px] grid col-span-3 gap-5 space-x-5">
            <CardHeader>
                <CardTitle>
                    <Icon   className=" h-10 w-10 text-primary "/>
                </CardTitle>
                <CardDescription>{title}</CardDescription>
                <CardDescription>{data}</CardDescription>
            </CardHeader>
        </Card>
    )
}

export default CardWithForm;
