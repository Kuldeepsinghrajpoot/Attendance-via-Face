import { Button } from "@/components/ui/button"
import Link from "next/link"
interface Props {
  Subject: any
}
const Subject: React.FC<Props> = ({ Subject }) => {
  return (
    <div className=" mx-3 rounded-md  md:mx-7 md:my-5 drop-shadow-md flex justify-start gap-5">
      {Subject.map((subject: any) => (
        <div key={subject} >
          <Button className="font-medium"><Link href={`/dashboard/quiz/${subject.subjectName}`}>{subject.subjectName}</Link></Button>
        </div>
      ))}

    </div>
  )
}
export default Subject