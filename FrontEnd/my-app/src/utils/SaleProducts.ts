interface Product {
  id: string;
  name: string;
  price: number;
  code: string;
  quantity: number;
  category: string;
  description: string;
}

async function SaleProdcuts(data: Product[]) {
  try {
    const formatData = {
      products: data,
    };
    console.log(formatData);
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/sale/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {}
}

export default SaleProdcuts;
