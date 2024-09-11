async function GetProductsSale() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    const response = await fetch(
      "https://api-iv.vercel.app/get/products/sale/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return false;
  }
}

export default GetProductsSale;
