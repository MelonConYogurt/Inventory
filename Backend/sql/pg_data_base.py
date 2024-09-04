#Import python utilitys
import logging
import datetime
from faker import Faker

#import de scaner module
from Backend.scanner.scan_barcode import *
from Backend.scanner.code_generator import *

#Load config for connection
from Backend.sql.config import load_config

#Hashing passwords
from passlib.context import CryptContext

#pg database
import psycopg2

# Faker instance
faker = Faker()

class data_base:
    def __init__(self):
        self.connect = None
        self.cursor = None
        self.config = load_config()
        self.logger = logging.getLogger(__name__)
        try:
            self.connect = psycopg2.connect(**self.config)
            self.cursor = self.connect.cursor()
            print("Connected to the database")
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
    
    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connect:
            self.connect.close()
        print("Database connection closed")

    def drop_product(self, code: int):
        try:
            verify_product = self.search_products(code)
            if not verify_product[0]:
                print("Product not found")
                return
            else:
                query = "DELETE FROM public.products WHERE product_code = %s RETURNING *"
                values = (code,)
                
                self.cursor.execute(query, values)
                delete_info = self.cursor.fetchone()
                self.connect.commit()
                print(f"Product eliminated:\n {delete_info}")
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise        
    
    def search_products(self, code: int):
        try:
            query = "SELECT * FROM public.products WHERE product_code = %s"
            values = (code,)
            self.cursor.execute(query, values)
            product = self.cursor.fetchone()
            if product:
                print(f"Product found:\n {product}")
                return True, product
            else:
                print("Product not found")
                return False, None
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def insert_product(self, name: str, price: float, code: int, quantity: int, category: str = None, description: str = None):
        try:
            verify_product = self.search_products(code)
            if verify_product[0]:
                self.logger.warning(f"Product with code {code} already exists.")
                return

            query = """
                INSERT INTO public.products (product_name, product_price, product_code, product_quantity, product_category, product_description)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *;
            """
            values = (name, price, code, quantity, category, description)
            self.cursor.execute(query, values)
            data_insert = self.cursor.fetchone()
            self.connect.commit()

            self.logger.info(f"Product inserted successfully:\n {data_insert} ")
            return data_insert

        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise

    def delete_products(self, code: int, quantity: int):
        try:
            verify_product = self.search_products(code)
            if not verify_product[0]:
                print("Product not found")
                return
            else:
                query_verificate_quantity = "SELECT product_quantity FROM public.products WHERE product_code = %s"
                values = (code,)
                self.cursor.execute(query_verificate_quantity, values)
                current_quantity = self.cursor.fetchone()
                if current_quantity and quantity > current_quantity[0]:
                    print(f"Insufficient quantity in stock\nThe stock for the product is: {current_quantity[0]}")
                    return False
                else:
                    query = "UPDATE public.products SET product_quantity = product_quantity - %s WHERE product_code = %s"
                    values = (quantity, code)
                    self.cursor.execute(query, values)
                    return True
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise

    def sale(self):
        try:
            date = datetime.datetime.now().strftime('%Y%m%d')
            number = faker.random_number(digits=5)
            generate_code = f"{date}{number}"
            generate_qr(data=generate_code)  
            
            sale_data = {
                "sale_code": generate_code,
                "sale_date": datetime.datetime.now().strftime("%Y-%m-%d"),  
                "sale_total": 0
            }
            
            query = "INSERT INTO public.sales (sale_code, sale_date, sale_total) VALUES (%s, %s, %s) RETURNING sale_id"
            values = (sale_data["sale_code"], sale_data["sale_date"], sale_data["sale_total"])  
        
            self.cursor.execute(query, values)
            sale_id = self.cursor.fetchone()[0]  
            return sale_id
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise

    def sale_products_scanner(self):
        self.connect.autocommit = False
        try:
            scanner_instance = Scanner()  
            product_list = scanner_instance.recorder()  
            if not product_list:
                raise ValueError("Empty list")
            
            valid_products = [product for product in product_list if self.search_products(product)[0]]
            if not valid_products:
                raise ValueError("No valid products found")
            
            sale_id = self.sale()  
            if not sale_id:
                raise ValueError("Failed to create sale")
            
            for product in product_list:
                verify_product = self.search_products(product)
                if verify_product[0]:
                    product_data = {
                        "product_id": verify_product[1][0],
                        "product_name": verify_product[1][1],
                        "product_price": verify_product[1][2],
                        "product_code": verify_product[1][3],
                        "product_quantity": 1
                    }
                    query = "INSERT INTO public.sale_products (sale_id, product_id, quantity, product_price_at_sale) VALUES (%s, %s, %s, %s) RETURNING *"
                    values = (sale_id, product_data["product_id"], product_data["product_quantity"], product_data["product_price"])
                    self.cursor.execute(query, values)
                    sale_item_data = self.cursor.fetchone()
                    print(f"Sale product: {sale_item_data}")
                    self.delete_products(code=product_data["product_code"], quantity=product_data["product_quantity"])
        
            self.connect.commit()            
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
        finally:
            self.connect.autocommit = True
            
    def sale_product_manual(self, products: list):
        self.connect.autocommit = False
        sale_total = 0
        validate_products = []
        fail_to_validate = []
        try:
            sale_id = self.sale()
            if sale_id:
                for product in products:
                    valor, product_data = self.search_products(product.code)
                    if valor and (product.units > 0):
                        validate_products.append(product)
                    else:
                        fail_to_validate.append(product)
                
                if len(validate_products) <= 0:
                    query = ("DELETE FROM public.sales WHERE sale_id = %s")
                    values = (sale_id,)
                    self.cursor.execute(query, values)
                    self.logger.error(f"Error: {err}", exc_info=True)
                    self.connect.rollback()
                    raise
                
                for product in validate_products:
                    sale_total += product.price * product.units
                    query = "INSERT INTO public.sale_products (sale_id, product_id, quantity, product_price_at_sale) VALUES (%s, %s, %s, %s) RETURNING *"
                    values = (sale_id, product.id, product.units, product.price)
                    self.cursor.execute(query, values)
                    print(f"Sale product: {product.name}, units: {product.units}")
                    self.delete_products(code=product.code, quantity=product.units)
            
                query_update_total = ("UPDATE public.sales SET sale_total = %s WHERE sale_id = %s")
                values_sale_update = (sale_total, sale_id)
                self.cursor.execute(query_update_total, values_sale_update)            
            self.connect.commit()            
        except psycopg2.Error as err:
            query = ("DELETE FROM public.sales WHERE sale_id = %s")
            values = (sale_id,)
            self.cursor.execute(query, values)
            self.logger.error(f"Error: {err}", exc_info=True)
            self.connect.rollback()
            raise
        finally:
            self.connect.autocommit = True
    
    def update_product_data(self,
                        name: str | None = None,
                        price: float | None = None,
                        code: int | None = None,
                        quantity: int | None = None,
                        category: str | None = None,
                        description: str | None = None):
        try:
            product_data_in_db = self.search_products(code=code)
            if not product_data_in_db:
                print("Product not found.")
                return

            update_fields = []
            update_values = []

            if name is not None:
                update_fields.append("product_name = %s")
                update_values.append(name)
            if price is not None:
                update_fields.append("product_price = %s")
                update_values.append(price)
            if quantity is not None:
                update_fields.append("product_quantity = %s")
                update_values.append(quantity)
            if category is not None:
                update_fields.append("product_category = %s")
                update_values.append(category)
            if description is not None:
                update_fields.append("product_description = %s")
                update_values.append(description)
            
            if not update_fields:
                print("No fields to update.")
                return

            update_values.append(code)
            
            query = f"UPDATE public.products SET {', '.join(update_fields)} WHERE product_code = %s RETURNING *"
            self.cursor.execute(query, update_values)
            product_update_data = self.cursor.fetchone()
            self.connection.commit()
            print(f"Product updated successfully: {product_update_data}")
        
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
      
    def view_all_products(self, limit:int):
        try:
            query =("SELECT * FROM public.products LIMIT %s")
            self.cursor.execute(query, (limit,))
            view = self.cursor.fetchall()
            self.connect.commit()            
            if view:
                return view
            else:
                raise
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def fake_product_insert(self, fake_cycles: int):
        try:
            for _ in range(fake_cycles):
                self.insert_product(
                    name=faker.word(),
                    price=faker.random_number(digits=5),
                    code=faker.ean13(),
                    quantity=faker.random_number(digits=2),
                    category=faker.word(),
                    description=faker.sentence(nb_words=3, variable_nb_words=False)
                )
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
            
    def insert_list_products(self, list_product_raw = list):
        try:
            if not list_product_raw:
                return 
            for product in list_product_raw:
                self.insert_product(
                    name = product.name,
                    price = product.price,
                    code = product.code,
                    quantity = product.quantity,
                    category = product.category,
                    description = product.description
                )
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise   
        
    def product_statistics(self):
        try:
            query_category_count = """
                SELECT product_category, COUNT(product_category) AS amount
                FROM public.products
                GROUP BY product_category;
            """
            self.cursor.execute(query_category_count)
            category_counts = self.cursor.fetchall()

            query_total_count = """
                SELECT COUNT(*) AS count
                FROM public.products;
            """
            self.cursor.execute(query_total_count)
            total_count = self.cursor.fetchone()[0]

            query_top_10_least_quantity = """
                SELECT product_name, SUM(product_quantity) AS total_quantity
                FROM public.products
                GROUP BY product_name
                ORDER BY total_quantity ASC
                LIMIT 10;
            """
            self.cursor.execute(query_top_10_least_quantity)
            top_10_least_quantity = self.cursor.fetchall()

            self.connect.commit()

            self.logger.info("Product category counts: %s", category_counts)
            self.logger.info("Total product count: %d", total_count)
            self.logger.info("Top 10 products with least quantity: %s", top_10_least_quantity)

            return {
                "category_counts": category_counts,
                "total_count": total_count,
                "top_10_least_quantity": top_10_least_quantity
            }
        except psycopg2.Error as err:
            self.logger.error(f"Error fetching product statistics: {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def get_password_hash(self, password):
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(password)     
    
    def verify_user(self, username: str) -> bool:
        try:
            query = "SELECT username FROM public.user WHERE username = %s"
            self.cursor.execute(query, (username,))
            row = self.cursor.fetchone()
            return row is not None  
        except psycopg2.Error as err:
            self.logger.error(f"Error verifying user: {err}", exc_info=True)
            self.connect.rollback()
            raise
            
    def new_user(self, username: str, full_name: str, email: str, password: str, admin: bool):
        if self.verify_user(username):
            raise ValueError("Username already exists")
        try:
            query = "INSERT INTO public.user (username, full_name, email, password, admin) VALUES (%s, %s, %s, %s, %s)"
            password_hashed = self.get_password_hash(password)
            values = (username, full_name, email, password_hashed, admin)
            self.cursor.execute(query, values)
            self.connect.commit()
        except psycopg2.Error as err:
            self.logger.error(f"Error : {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def get_users(self):
        try:
            user_list = {}
            query = "SELECT username, full_name, email, password AS hashed_password, disabled, admin FROM public.user"
            self.cursor.execute(query)
            rows = self.cursor.fetchall()
            if rows:
                for row in rows:
                    user_list[row[0]] = {
                        "username": row[0],
                        "full_name": row[1],
                        "email": row[2],
                        "hashed_password": row[3],
                        "disabled": row[4],
                        "admin": row[5],
                    }
            return user_list
        except psycopg2.Error as err:
            self.logger.error(f"Error retrieving user: {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def delete_user(self, username: str):
        try:
            if self.verify_user(username):
                query = "UPDATE public.user SET disabled = %s WHERE username = %s"
                self.cursor.execute(query, (True, username))
                self.connect.commit()
                return True
            else:
                raise ValueError("Username dosen't exists")
            
        except psycopg2.Error as err:
            self.logger.error(f"Error disabling user: {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def update_user_password(self, password: str, username: str):
        try:
            if self.verify_user(username):
                password_hashed = self.get_password_hash(password)
                query = "UPDATE public.user SET password = %s WHERE username = %s"
                self.cursor.execute(query, (password_hashed, username))
                self.connect.commit()
                return True
            else:
                raise ValueError("Username dosen't exists")
        except psycopg2.Error as err:
            self.logger.error(f"Error disabling user: {err}", exc_info=True)
            self.connect.rollback()
            raise
    
    def add_supplier(self, name: str, phone: int, direction: str, nit: int, email: str,contact: str):
        try:
            query = ("INSERT INTO public.suppliers (supplier_name,supplier_phone, supplier_direction, supplier_nit, supplier_email, supplier_contact)  VALUES(%s,%s,%s,%s,%s,%s)")
            self.cursor.execute(query, (name, phone, direction, nit, email, contact))
            self.connect.commit()
        except psycopg2.Error as err:
            self.logger.error(f"Error disabling user: {err}", exc_info=True)
            self.connect.rollback()
            raise
        
    def get_suppliers(self):
        try:
            query = ("SELECT * FROM public.suppliers")
            self.cursor.execute(query)
            data = self.cursor.fetchall()
            if data:
                return data
        except psycopg2.Error as err:
            self.logger.error(f"Error disabling user: {err}", exc_info=True)
            self.connect.rollback()
            raise
            
            
if __name__ == "__main__":  
    pass
    # try:
    #     db = data_base()
    #     db.new_user("admin","admin","admin","alecontra13", True)
    # except Exception as e:
    #     print(e)
   
    