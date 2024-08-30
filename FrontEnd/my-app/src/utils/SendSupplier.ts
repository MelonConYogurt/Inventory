interface Supplier {
    name: string;
    phone: string; 
    direction: string;
    nit: string;
    email: string;
    contact: string;
}

async function SendSupplierData(data: Supplier): Promise<any> {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch("http://127.0.0.1:8000/add/supplier/", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error sending supplier data:', error);
        throw error;
    }
}

export default SendSupplierData;