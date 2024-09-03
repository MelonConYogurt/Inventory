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
            modeling_product = model_product(
                id= product[0],
                name=product[1],
                price=product[2],
                code=product[3],
                quantity=product[4],
                category=product[5],
                description=product[6]
            )
            products.append(modeling_product)
        return InvoiceResponse(products=products)
    except OperationalError as e:
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
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while fetching statistics: {str(e)}")


@router_methods.post("/add/product", response_model=model_product, tags=["Inventory"])
async def add_new_product(product: model_product):
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
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A product with the same code already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while adding the product: {str(e)}")


@router_methods.post("/add/multiple/products", response_model=InvoiceResponse_not_id, tags=["Inventory"])
async def add_new_products(products: List[model_product_not_id]):
    try:
        db = data_base()
        db.insert_list_products(products)
        return InvoiceResponse_not_id(products=products)
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: One or more products have duplicate codes.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while adding multiple products: {str(e)}")


@router_methods.post("/add/user/", tags=["User controls (Only Admins)"], dependencies=[Depends(get_current_admin_active_user)])
async def add_new_user(username: Annotated[str, Form()], full_name: Annotated[str, Form()],
                       email: Annotated[str, Form()], password: Annotated[str, Form()], admin: Annotated[bool, Form()]):
    try:
        db = data_base()
        db.new_user(
            username=username,
            full_name=full_name,
            email=email,
            password=password,
            admin= admin
        )
        print(f"User created: {username}")
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")

@router_methods.post("/delete/user/", tags=["User controls (Only Admins)"], dependencies=[Depends(get_current_admin_active_user)],)
async def delete_user(username: Annotated[str, Form()]):
    try:
        db = data_base()
        validation = db.delete_user(username)
        if validation:
            print("Succesfully")
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")
    
    
@router_methods.post("/update/user/password", tags=["User controls (Only Admins)"], dependencies=[Depends(get_current_admin_active_user)])
async def update_user_password(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    try:
        db = data_base()
        validation = db.update_user_password(password, username)
        if validation:
            print("Succesfully")
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")
    

@router_methods.post("/add/supplier/", tags=["Suppliers"], dependencies=[Depends(get_current_admin_active_user)], response_model=model_suppplier)
async def add_supplier(supplier: model_suppplier):
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
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")
    
    
@router_methods.get("/get/suppliers/", tags=["Suppliers"], dependencies=[Depends(get_current_admin_active_user)], response_model=list_suppliers)
async def get_suppliers_data():
    try:
        list = []
        db = data_base()
        data = db.get_suppliers()
        print(data)
        for row in data:
            supplier = model_suppplier(
                name = row[1],
                phone = row[2],
                direction = row[3],
                nit = row[4],
                email = row[5],
                contact = row[6]
            )
            list.append(supplier)
        return list_suppliers(suppliers=list)
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")
    
    
@router_methods.post("/sale/products/", tags=["Inventory"], dependencies=[Depends(get_current_admin_active_user)], response_model=InvoiceResponse)
async def sale_products(products: List[model_product]):
    try:
        db = data_base()
        db.sale_product_manual(products)
        return InvoiceResponse(products=products)
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Integrity error: A user with this username or email already exists.")
    except OperationalError as e:
        raise HTTPException(status_code=500, detail="Database connection error. Please try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while creating the user: {str(e)}")