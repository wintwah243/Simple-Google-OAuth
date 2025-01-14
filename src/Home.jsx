import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
    } else {
      axios.get("http://localhost:8081/")
        .then(res => {
          if (res.data.valid) {
            setUser({ name: res.data.name });
          }
        })
        .catch(err => console.log(err));
    }
  }, []);

  return (
    <div>
      {user ? <h1>Hello, {user.name}!</h1> : <h1>Welcome to the homepage!</h1>}
    </div>
  );
}

export default Home;
