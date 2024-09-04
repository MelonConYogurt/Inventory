from fastapi import HTTPException, APIRouter, Depends, Form
from psycopg2 import OperationalError, IntegrityError
from typing import List, Annotated

# Database connection and models/functions
from Backend.api.utils import get_current_active_user, get_current_admin_active_user
from Backend.sql.pg_data_base import data_base
from Backend.api.models import *

router_methods = APIRouter(
    dependencies=[Depends(get_current_active_user)]
)

@router_methods.get("/products", response_model=InvoiceResponse, tags=["Inventory"])
async def list_products(limit: int | None = 1000):
    try:
        db = data_base()
        raw_products = db.view_all_products(limit)
        products = []
        for product in raw_products:
            modeling_product = Product(
                id=product[0],
                name=product[1],
                price=product[2],
                code=product[3],
                quantity=product[4],
                category=product[5],
                description=product[6]
            )
            products.append(modeling_product)
        return InvoiceResponse(products=products)
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while listing products: {str(e)}")


@router_methods.get("/statistics/", response_model=ModelStatistics, tags=["Inventory"])
async def statistics():
    try:
        db = data_base()
        data = db.product_statistics()
        formatted_data = {
            "product_total_count": data['total_count'],
            "category_counts": [CategoryCount(product_category=category, amount=count) for category, count in data['category_counts']],
            "top_10_least_quantity": [ProductQuantity(product_name=name, total_quantity=int(quantity)) for name, quantity in data['top_10_least_quantity']]
        }
        return formatted_data
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while fetching statistics: {str(e)}")


@router_methods.post("/add/product", response_model=Product, tags=["Inventory"])
async def add_new_product(product: Product):
    try:
        db = data_base()
        db.insert_product(
            name=product.name,
            price=product.price,
            code=product.code,
            quantity=product.quantity,
            category=product.category,
            description=product.description
        )
        return product
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: A product with the same code already exists.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while adding the product: {str(e)}")


@router_methods.post("/add/multiple/products", response_model=InvoiceResponseNotID, tags=["Inventory"])
async def add_new_products(products: List[ProductWithoutID]):
    try:
        db = data_base()
        db.insert_list_products(products)
        return InvoiceResponseNotID(products=products)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: One or more products have duplicate codes.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while adding multiple products: {str(e)}")


@router_methods.post("/add/user/", tags=["User controls (Only Admins)"], dependencies=[Depends(get_current_admin_active_user)])
async def add_new_user(
    username: Annotated[str, Form()],
    full_name: Annotated[str, Form()],
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    admin: Annotated[bool, Form()]
):
    try:
        db = data_base()
        db.new_user(
            username=username,
            full_name=full_name,
            email=email,
            password=password,
            admin=admin
        )
        print(f"User created: {username}")
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")


@router_methods.post("/delete/user/", tags=["User controls (Only Admins)"], dependencies=[Depends(get_current_admin_active_user)])
async def delete_user(username: Annotated[str, Form()]):
    try:
        db = data_base()
        validation = db.delete_user(username)
        if validation:
            print("Successfully deleted user")
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while deleting the user: {str(e)}")


@router_methods.post("/update/user/password", tags=["User controls (Only Admins)"], dependencies=[Depends(get_current_admin_active_user)])
async def update_user_password(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    try:
        db = data_base()
        validation = db.update_user_password(password, username)
        if validation:
            print("Password updated successfully")
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while updating the user password: {str(e)}")


@router_methods.post("/add/supplier/", tags=["Suppliers"], dependencies=[Depends(get_current_admin_active_user)], response_model=SupplierModel)
async def add_supplier(supplier: SupplierModel):
    try:
        db = data_base()
        db.add_supplier(
            supplier.name,
            int(supplier.phone),
            supplier.direction,
            int(supplier.nit),
            supplier.email,
            supplier.contact
        )
        return supplier
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: A supplier with this NIT already exists.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while adding the supplier: {str(e)}")


@router_methods.get("/get/suppliers/", tags=["Suppliers"], dependencies=[Depends(get_current_admin_active_user)], response_model=SupplierList)
async def get_suppliers_data():
    try:
        suppliers = []
        db = data_base()
        data = db.get_suppliers()
        for row in data:
            supplier = SupplierModel(
                name=row[1],
                phone=row[2],
                direction=row[3],
                nit=row[4],
                email=row[5],
                contact=row[6]
            )
            suppliers.append(supplier)
        return SupplierList(suppliers=suppliers)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: A supplier with this NIT already exists.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while fetching suppliers: {str(e)}")


@router_methods.post("/sale/products/", tags=["Inventory"], dependencies=[Depends(get_current_admin_active_user)], response_model=InvoiceResponseSales)
async def sale_products(products: List[ProductSale]):
    try:
        db = data_base()
        db.sale_product_manual(products)
        return InvoiceResponseSales(products=products)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: Some products have duplicate codes.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while processing the sale: {str(e)}")



@router_methods.get("/get/sales/", tags=["Inventory"], dependencies=[Depends(get_current_admin_active_user)], response_model=list[SalesModel])
async def get_sales_data():
    sales = []
    try:
        db = data_base()
        data = db.get_sales()
        for sale in data:
            row = SalesModel(
                sale_id = sale[0],
                sale_code = sale[1],
                sale_date = sale[2],
                sale_total = sale[3]
            )
            sales.append(row)
        return sales
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Integrity error: Some products have duplicate codes.")
    except OperationalError:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while processing the sale: {str(e)}")