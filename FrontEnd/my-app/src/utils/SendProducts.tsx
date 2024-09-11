async function SendData(products: any[]) {
  let formatProducts: any[] = [];

  products.forEach((product) => {
    formatProducts.push({
      name: product.name,
      price: parseInt(product.price),
      code: parseInt(product.code),
      quantity: parseInt(product.quantity),
      category: product.category,
      description: product.description,
    });
  });

  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(
      "https://api-iv.vercel.app/add/multiple/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formatProducts),
      }
    );
    if (!response.ok) {
      throw Error(`HTTP error! status: ${response.status}`);
    } else {
      let jsonData = await response.json();
      return true;
    }
  } catch (error) {
    console.error("An error occurred while fetching the products:", error);
    return false;
  }
}

export default SendData;
