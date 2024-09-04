from typing import List
from pydantic import BaseModel
from datetime import date


class BaseProduct(BaseModel):
    name: str
    price: float
    code: int
    quantity: int
    category: str | None = None
    description: str | None = None

class Product(BaseProduct):
    id: int

class ProductWithoutID(BaseProduct):
    pass

class ProductSale(BaseProduct):
    id: int
    units: int

class InvoiceResponse(BaseModel):
    products: List[Product]

class InvoiceResponseNotID(BaseModel):
    products: List[ProductWithoutID]

class InvoiceResponseSales(BaseModel):
    products: List[ProductSale]

class ProductQuantity(BaseModel):
    product_name: str
    total_quantity: int

class CategoryCount(BaseModel):
    product_category: str
    amount: int

class ModelStatistics(BaseModel):
    product_total_count: int
    category_counts: List[CategoryCount]
    top_10_least_quantity: List[ProductQuantity]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    admin: bool | None = None

class UserInDB(User):
    hashed_password: str

class SupplierModel(BaseModel):
    name: str
    phone: int
    direction: str 
    nit: int
    email: str
    contact: str

class SupplierList(BaseModel):
    suppliers: List[SupplierModel]
    
class SalesModel(BaseModel):
    sale_id: str
    sale_code: int
    sale_date: date
    sale_total: int

class ProductsSaleModel(BaseModel):
    sale_products_id: int
    sale_id: str
    product_id: int
    quantity: int
    product_price_at_sale: float