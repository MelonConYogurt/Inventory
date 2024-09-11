interface Product {
  id: number;
  units: number;
  name: string;
  price: number;
  code: string;
  quantity: number;
  category: string;
  description: string;
}

async function SaleProducts(data: Product[]) {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Token no found close the app and re login");
    }

    const response = await fetch("https://api-iv.vercel.app/sale/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error en la solicitud: ${errorData.message || response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log("Respuesta del servidor:", responseData);
  } catch (error) {
    console.error("Error al realizar la venta de productos:", error);
  }
}

export default SaleProducts;
