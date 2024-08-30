from typing import List
from pydantic import BaseModel

class model_product(BaseModel):
    id: int
    name: str
    price: float
    code: int
    quantity: int
    category: str | None = None
    description: str | None = None

class InvoiceResponse(BaseModel):
    products : List[model_product]

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

# class ModelNewUser(BaseModel):
#     username: str
#     email: str 
#     full_name: str 
#     password: str
#     disabled: bool | None = False