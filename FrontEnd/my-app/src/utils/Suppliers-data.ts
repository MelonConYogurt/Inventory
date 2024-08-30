// interface Supplier{
//     name: string;
//     phone: number;
//     direction: string;
//     nit: number;
//     email: string;
//     contact: string;
// }

async function GetSuppliersData() {
    try {
        const token = sessionStorage.getItem('token')
        const response = await fetch("http://127.0.0.1:8000/get/suppliers/",
            {   
                method : 'GET',
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        } else{
            const data = await response.json()
            const suppliers = data.suppliers
            console.log(suppliers)
            return suppliers
        }
    } catch (error) {
        console.error('Faile fetchin the data')
        return []
    }
}

export default GetSuppliersData;