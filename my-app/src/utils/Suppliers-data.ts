async function GetSuppliersData() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("https://api-iv.vercel.app/get/suppliers/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      const suppliers = data.suppliers;
      console.log(suppliers);
      return suppliers;
    }
  } catch (error) {
    console.error("Faile fetchin the data");
    return [];
  }
}

export default GetSuppliersData;
