import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface UserData {
  user: {
    fullName: string;
    RollNumber: string;
    email: string;
  }
}

const VerifiedUser: React.FC<{ id: any }> = ({ id }) => {
  const [name, setName] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     (async function(){
      try {
        const response = await axios.get<UserData>(`http://localhost:3000/api/student?id=${id}`);
        setName(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching user data");
        setLoading(false);
      }
     })();

  
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {name && (
        <div className='border-border bg-background flex px-5 py-4 mix-blend-color shadow-inner justify-between bg-white dark:bg-background border-none rounded-sm drop-shadow-md dark:text-white text-[#9C9AA6]'>
          <div>
            <div>Subject - Digital Image Processing</div>
            <div>Time : 20min</div>
            <div>Date : {new Date().getFullYear()} - {new Date().getMonth() + 1} - {new Date().getDate()}</div>
            <div>Number of Question :10</div>
          </div>
          <div>
            <div>Name : {name.user.fullName}</div>
            <div>Roll Number : {name.user.RollNumber}</div>
            <div>Email : {name.user.email}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifiedUser;
