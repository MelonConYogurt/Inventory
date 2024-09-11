interface Supplier {
  name: string;
  phone: number;
  direction: string;
  nit: number;
  email: string;
  contact: string;
}

async function SendSupplierData(data: Supplier): Promise<any> {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("https://api-iv.vercel.app/add/supplier/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error sending supplier data:", error);
    throw error;
  }
}

export default SendSupplierData;
