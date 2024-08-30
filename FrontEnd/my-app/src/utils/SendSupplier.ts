interface Supplier {
    name: string;
    phone: number;
    direction: string;
    nit: number;
    email: string;
    contact: string;
} 

async function SendSupplierData(data: Supplier) {
    try {
        const token = sessionStorage.getItem('token')
        const response = await fetch("http://127.0.0.1/add/supplier/",{
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }
        )
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }else{
            let jsonData = await response.json();
            return jsonData;
        }
    } catch (error) {
        return false
    }
}

export default SendSupplierData;