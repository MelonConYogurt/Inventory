async function GetStadiscticData() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("https://api-iv.vercel.app/statistics/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let jsonData = await response.json();
      return jsonData;
    }
  } catch (error) {
    alert("An error occurred while fetching the products (chart data)");
    return [];
  }
}

export default GetStadiscticData;
