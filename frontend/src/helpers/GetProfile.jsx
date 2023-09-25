export const GetProfile = async (userId, setState) => {
    const token = localStorage.getItem("token")
    const request = await fetch(`http://localhost:5000/api/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();
    console.log(data);
  
    if (data.status === "success" && data.user) {
      setState(data.user);
    }
  };
  