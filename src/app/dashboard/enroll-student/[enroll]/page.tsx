import { Usable, use } from "react"
import { SubjectForm } from "../subject-form";
import { Subject } from "../table";
 
interface Params {
  enroll: string;
}

export default function Page(props: { params: Usable<Params>}) {
  const params = use(props.params)

  console.log(params?.enroll)
    return (
        <section className=' p-4 rounded-md  '>
        <div className='flex justify-start gap-2 h-12 max-h-min'>
            <SubjectForm/>
            {/* <SelectSubject/> */}
        </div>
        <div className='bg-background border rounded-md p-4 my-4'>
            <Subject/>
        </div>
        </section>
    )
}