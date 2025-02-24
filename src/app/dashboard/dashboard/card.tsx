'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CardWithForm({ dataItem }: any) {
    const { title, Icon, data } = dataItem;
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Icon/>
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

export default CardWithForm;
