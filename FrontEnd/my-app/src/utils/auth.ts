"use client";

async function GetToken(username: string, password: string): Promise<boolean> {
  if (!username || !password) {
    return false;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "password",
        username: username,
        password: password,
        scope: "",
        client_id: "string",
        client_secret: "string",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tokenResponse = await response.json();
    const token = tokenResponse.access_token;
    sessionStorage.setItem('token', token);
    return true;
  } catch (error) {
    return false;
  }
}

export default GetToken;