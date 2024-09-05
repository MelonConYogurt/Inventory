# Inventory app (Para iniciar next primero "npm install")

## Video demostracion

[![Alt text](https://github.com/user-attachments/assets/f9bc2234-428c-4f4d-a143-9dfe22730ddc)](https://youtu.be/o_4IJ4fPeyc)

# Proyecto: Sistema de Gestión de Productos con Código de Barras y QR

Este proyecto consta de varios módulos clave: escaneo de códigos de barras y QR, generación de códigos (EAN13 y QR), gestión de productos en una base de datos, modelos de datos y métodos para la interacción vía API. A continuación, se describen cada uno de los módulos y su funcionalidad.

## Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Módulos](#módulos)
    - [1. Escáner](#1-escáner)
    - [2. Generador de Códigos](#2-generador-de-códigos)
    - [3. Gestión de Base de Datos](#3-gestión-de-base-de-datos)
    - [4. Modelos](#4-modelos)
    - [5. Métodos](#5-métodos)
4. [Uso](#uso)
5. [Vistas](#vistas)
6. [Contribuciones](#contribuciones)
7. [Licencia](#licencia)

## Requisitos

- Python 3.x
- Librerías adicionales especificadas en `requirements.txt`

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tu_usuario/tu_proyecto.git
    cd tu_proyecto
    ```

2. Instala las dependencias:

    ```bash
    pip install -r requirements.txt
    ```

## Módulos

### 1. Escáner

El módulo de escaneo (`scanner.py`) utiliza la cámara para detectar y decodificar códigos de barras y QR en tiempo real. Los códigos escaneados se muestran en la pantalla y se almacenan en una lista interna.

**Funciones principales:**

- `recorder()`: Inicia la captura de video y decodifica los códigos en cada fotograma.
- `decode_barcode(frame)`: Decodifica los códigos de barras presentes en el fotograma y dibuja un recuadro alrededor del código detectado.
- `local_storage(data)`: Almacena los códigos decodificados en una lista y emite un sonido cuando se registra un nuevo código.





https://github.com/user-attachments/assets/13df3b9b-02f7-4fc0-aa34-99bcd2d66842





**Uso:**

```python
scanner_instance = Scanner()
scanned_codes = scanner_instance.recorder()
print("Códigos escaneados:", scanned_codes)
```

### 2. Generador de Códigos

El módulo de generación de códigos (`generate_codes.py`) permite la creación de códigos de barras en formato EAN13 y códigos QR. Estos códigos se almacenan como archivos `.svg` (para EAN13) y `.png` (para QR) en directorios específicos.

**Funciones principales:**

- `generate_barcode_ean13(code: str)`: Genera un código de barras EAN13 a partir de una cadena de texto.
- `generate_qr(data: any)`: Genera un código QR con los datos proporcionados.
- `generate_fake_barcodes(quantity: int)`: Genera múltiples códigos de barras EAN13 falsos para pruebas.




**Uso:**

```python
generate_fake_barcodes(1)
generate_qr(data="https://github.com/tu_usuario")
```

### 3. Gestión de Base de Datos

El módulo de gestión de base de datos (`database.py`) permite realizar operaciones de inserción, eliminación y venta de productos utilizando códigos de barras. La base de datos está estructurada para manejar productos, categorías y ventas.

**Funciones principales:**

- `insert_products()`: Inserta un nuevo producto en la base de datos.
- `delete_products()`: Elimina o reduce la cantidad de un producto basado en su código de barras.
- `sale()`: Crea una nueva venta en la base de datos y genera un código QR para la misma.
- `sale_products()`: Escanea productos y los registra como parte de una venta en la base de datos.

## Diagrama:

![InventoryApp-db](https://github.com/user-attachments/assets/b02cbcfd-b07a-45e9-aab8-78d12ca5676f)


**Uso:**

```python
db_instance = Database()  # Asumiendo que ya tienes una clase de base de datos
db_instance.insert_products(name="Producto 1", price=10.0, code=123456789012, quantity=100, category="Categoría A")
db_instance.sale_products()
```

### 4. Modelos

![Screenshot 2024-09-05 144137](https://github.com/user-attachments/assets/560de64c-0278-4de1-b265-4011302fe339)


El módulo de modelos (`models.py`) define la estructura de los datos que se manejarán en las operaciones del API, usando `Pydantic` para garantizar la validación de datos.

**Modelo principal:**

- `model_product`: Representa la estructura de un producto con los siguientes campos:
  - `name` (str): Nombre del producto.
  - `price` (float): Precio del producto.
  - `code` (int): Código único del producto.
  - `quantity` (int): Cantidad disponible del producto.
  - `category` (str, opcional): Categoría del producto.
  - `description` (str, opcional): Descripción del producto.

**Uso:**

```python
from models import model_product

new_product = model_product(
    name="Producto A",
    price=15.99,
    code=123456789012,
    quantity=50,
    category="Electrónica",
    description="Descripción del producto A"
)
```

### 5. Métodos

El módulo de métodos (`methods.py`) expone una API para interactuar con el sistema de gestión de productos. Se utiliza `FastAPI` para crear un servidor que permita añadir productos a la base de datos mediante solicitudes HTTP.

**Endpoints principales:**

- `GET /`: Redirige a la documentación interactiva de la API.
- `POST /add/product`: Añade un nuevo producto a la base de datos.

**Uso:**

```python
from fastapi import FastAPI
from models import model_product

app = FastAPI()

@app.post("/add/product", response_model=model_product)
async def add_new_product(product: model_product):
    # Lógica para agregar el producto a la base de datos
    return product
```

## Vistas


## Uso

Para utilizar cualquiera de los módulos, asegúrate de que la base de datos esté configurada correctamente y que las dependencias estén instaladas. Puedes probar cada módulo individualmente ejecutando los scripts correspondientes.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un `issue` o envía un `pull request` para cualquier mejora o corrección.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes consultar más detalles en el archivo `LICENSE`.

---
