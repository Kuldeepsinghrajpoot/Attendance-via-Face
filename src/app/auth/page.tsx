
'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Login() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <Button variant="outline">Open popover</Button> */}
        <button>Login</button>
      </PopoverTrigger>
      <div className="flex justify-center">

      <PopoverContent className="w-80 ">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex justify-center">Login</h4>
            <p className="text-sm text-muted-foreground">
             
             Welcome to ThetaApp
            </p>
          </div>
          <div className=" ">
            <div className=" gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className=" gap-4 py-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <button>Login</button>
          </div>
        </div>
      </PopoverContent>
      </div>
    </Popover>
  )
}
