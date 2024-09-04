async function GetSalesData() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    const response = await fetch("http://127.0.0.1:8000/get/sales/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return false;
  }
}

export default GetSalesData;
