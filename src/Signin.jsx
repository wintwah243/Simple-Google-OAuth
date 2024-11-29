import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });

        const { name, email } = res.data;
        setUserData(res.data);
        
        await axios.post("http://localhost:8081/signin", { name, email });

        localStorage.setItem("user", JSON.stringify(res.data));

        // Navigate to home page
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flex:1
        }}>
      <button style={{
        padding:'10px',
        backgroundColor:'palegoldenrod',
        borderRadius:'20px',
        marginTop:"20%"
      }}
       onClick={() => login()}>Sign up with Google</button>
    </div>
  );
}

export default Signin;
