import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface UserData {
  user: {
    fullName: string;
    rollNumber: string;
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
        <div className=' flex justify-between bg-white px-5 py-5 drop-shadow-md dark:bg-background'>
          <div>
            <div>Subject - Digital Image Processing</div>
            <div>Time : 20min</div>
            <div>Date : {new Date().getFullYear()} - {new Date().getMonth() + 1} - {new Date().getDate()}</div>
            <div>Number of Question :10</div>
          </div>
          <div>
            <div>Name : {name.user.fullName}</div>
            <div>Roll Number : {name.user.rollNumber}</div>
            <div>Email : {name.user.email}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifiedUser;
