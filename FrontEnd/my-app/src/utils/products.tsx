"use client";

interface Product {
  id: string;
  name: string;
  price: number;
  code: string;
  quantity: number;
  category: string;
  description: string;
}

async function GetDataProducts(rows: number): Promise<Product[]> {
  let listProducts: Product[] = [];
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      `http://127.0.0.1:8000/products?limit=${rows}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let jsonData = await response.json();
      let products = jsonData.products;

      products.forEach((product: any) => {
        let newProduct: Product = {
          id: String(product.id),
          name: product.name,
          price: product.price,
          code: product.code,
          quantity: product.quantity,
          category: product.category,
          description: product.description,
        };
        listProducts.push(newProduct);
      });
    }
  } catch (error) {
    console.error("An error occurred while fetching the products:", error);
    return [];
  }

  return listProducts;
}

export default GetDataProducts;
