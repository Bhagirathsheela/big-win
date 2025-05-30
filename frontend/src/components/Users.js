import React, { useEffect, useState } from "react";
import { useHttpClient } from "../common/hooks/http-hook";

const Users = () => {
      const [userList, setUserList] = useState([]);
       const {sendRequest } = useHttpClient();
useEffect(() => {
  const getUsers = async () => {
    try {
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
      console.log(responseData);
      setUserList(responseData.users);
    } catch (error) {}
  };
  getUsers();
}, [sendRequest]);

  return (<>
    <div>Users</div>
    <ul>
     {userList.map((user,index)=>{
        return <li key={index}>{user.name}</li>
     })}
    </ul>
    </>
  )
}

export default Users