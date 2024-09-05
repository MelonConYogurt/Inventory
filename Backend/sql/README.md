
# Esquema de la Base de Datos

## Tabla: `products`

Esta tabla almacena información sobre los productos.

```sql
CREATE TABLE public.products
(
    product_id serial NOT NULL PRIMARY KEY,
    product_name text NOT NULL,
    product_price numeric(12, 2) NOT NULL,
    product_code bigint NOT NULL UNIQUE,
    product_quantity bigint NOT NULL,
    product_category text DEFAULT NULL,
    product_description text DEFAULT NULL
);

ALTER TABLE IF EXISTS public.products
    OWNER TO postgres;
````

## Tabla: `sale_products`

Esta tabla relaciona productos con ventas específicas, incluyendo la cantidad vendida y el precio en el momento de la venta.

```sql
CREATE TABLE public.sale_products
(
    sale_products_id bigserial NOT NULL PRIMARY KEY,
    sale_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity bigint NOT NULL,
    product_price_at_sale numeric(12, 2) NOT NULL
);

ALTER TABLE IF EXISTS public.sale_products
    OWNER TO postgres;
```

## Tabla: `sales`

Esta tabla almacena información sobre las ventas realizadas.

```sql
CREATE TABLE public.sales
(
    sale_id serial NOT NULL PRIMARY KEY,
    sale_code bigint NOT NULL UNIQUE,
    sale_date date NOT NULL,
    sale_total numeric(12, 2) DEFAULT NULL
);

ALTER TABLE IF EXISTS public.sales
    OWNER TO postgres;
```

## Tabala `suppliers`

Esta tabla almacena información sobre los vendedores.

```sql
CREATE TABLE public.suppliers
(
    supplier_id serial NOT NULL,
    supplier_name text NOT NULL,
    supplier_phone bigint NOT NULL,
    supplier_direction text,
    supplier_nit bigint,
    supplier_email text,
    supplier_contact text,
    PRIMARY KEY (supplier_id)
);

ALTER TABLE IF EXISTS public.suppliers
    OWNER to postgres;
```

## Restricciones y Relaciones

Establece las claves foráneas para mantener la integridad referencial entre las tablas `sale_products`, `products` y `sales`.

```sql
ALTER TABLE IF EXISTS public.sale_products
    ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id)
    REFERENCES public.products (product_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.sale_products
    ADD CONSTRAINT fk_sale_id FOREIGN KEY (sale_id)
    REFERENCES public.sales (sale_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
```

## Índices

Crea índices para mejorar la eficiencia de las consultas en las columnas de `product_code` y `sale_code`.

```sql
CREATE INDEX idx_product_code
    ON public.products (product_code ASC NULLS LAST);

CREATE INDEX idx_sale_code
    ON public.sales (sale_code ASC NULLS LAST);
    
```


## Base de datos completa (SQL generico)

```sql
CREATE TABLE products (
  product_id bigint NOT NULL DEFAULT nextval('products_product_id_seq'::regclass) PRIMARY KEY,
  product_name text NOT NULL,
  product_price numeric(12, 2) NOT NULL,
  product_code bigint NOT NULL,
  product_quantity bigint NOT NULL,
  product_category text,
  product_description text
);

CREATE UNIQUE INDEX products_pkey ON products (product_id);
CREATE INDEX idx_product_code ON products (product_code);

CREATE TABLE sale_products (
  sale_products_id bigint NOT NULL DEFAULT nextval('sale_products_sale_products_id_seq'::regclass) PRIMARY KEY,
  sale_id bigint NOT NULL,
  product_id bigint NOT NULL,
  quantity bigint NOT NULL,
  product_price_at_sale numeric(12, 2) NOT NULL
);

CREATE UNIQUE INDEX sale_products_pkey ON sale_products (sale_products_id);

CREATE TABLE sales (
  sale_id bigint NOT NULL DEFAULT nextval('sales_sale_id_seq'::regclass) PRIMARY KEY,
  sale_code bigint NOT NULL,
  sale_date date NOT NULL,
  sale_total bigint
);

CREATE UNIQUE INDEX sales_pkey ON sales (sale_id);
CREATE INDEX idx_sale_code ON sales (sale_code);

CREATE TABLE suppliers (
  supplier_id integer NOT NULL DEFAULT nextval('suppliers_supplier_id_seq'::regclass) PRIMARY KEY,
  supplier_name text NOT NULL,
  supplier_phone bigint NOT NULL,
  supplier_direction text,
  supplier_nit bigint,
  supplier_email text,
  supplier_contact text
);

CREATE UNIQUE INDEX suppliers_pkey ON suppliers (supplier_id);

CREATE TABLE user (
  user_id integer NOT NULL DEFAULT nextval('user_user_id_seq'::regclass) PRIMARY KEY,
  username text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  disabled boolean NOT NULL DEFAULT false,
  admin boolean NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX user_pkey ON user (user_id);

ALTER TABLE sale_products ADD CONSTRAINT pk_sale_id FOREIGN KEY (sale_id) REFERENCES sales (sale_id);
ALTER TABLE sale_products ADD CONSTRAINT pk_sale_products_id FOREIGN KEY (product_id) REFERENCES products (product_id);

```

## Base de datos completa (SQL postgres)

```sql
CREATE SEQUENCE IF NOT EXISTS products_product_id_seq;
CREATE TABLE IF NOT EXISTS products (
  product_id bigint NOT NULL DEFAULT nextval('products_product_id_seq') PRIMARY KEY,
  product_name text NOT NULL,
  product_price numeric(12, 2) NOT NULL,
  product_code bigint NOT NULL,
  product_quantity bigint NOT NULL,
  product_category text,
  product_description text
);

CREATE UNIQUE INDEX IF NOT EXISTS products_pkey ON products (product_id);
CREATE INDEX IF NOT EXISTS idx_product_code ON products (product_code);

CREATE SEQUENCE IF NOT EXISTS sale_products_sale_products_id_seq;
CREATE TABLE IF NOT EXISTS sale_products (
  sale_products_id bigint NOT NULL DEFAULT nextval('sale_products_sale_products_id_seq') PRIMARY KEY,
  sale_id bigint NOT NULL,
  product_id bigint NOT NULL,
  quantity bigint NOT NULL,
  product_price_at_sale numeric(12, 2) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS sale_products_pkey ON sale_products (sale_products_id);

CREATE SEQUENCE IF NOT EXISTS sales_sale_id_seq;
CREATE TABLE IF NOT EXISTS sales (
  sale_id bigint NOT NULL DEFAULT nextval('sales_sale_id_seq') PRIMARY KEY,
  sale_code bigint NOT NULL,
  sale_date date NOT NULL,
  sale_total bigint
);

CREATE UNIQUE INDEX IF NOT EXISTS sales_pkey ON sales (sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_code ON sales (sale_code);

CREATE SEQUENCE IF NOT EXISTS suppliers_supplier_id_seq;
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id integer NOT NULL DEFAULT nextval('suppliers_supplier_id_seq') PRIMARY KEY,
  supplier_name text NOT NULL,
  supplier_phone bigint NOT NULL,
  supplier_direction text,
  supplier_nit bigint,
  supplier_email text,
  supplier_contact text
);

CREATE UNIQUE INDEX IF NOT EXISTS suppliers_pkey ON suppliers (supplier_id);

CREATE SEQUENCE IF NOT EXISTS user_user_id_seq;
CREATE TABLE IF NOT EXISTS "user" (
  user_id integer NOT NULL DEFAULT nextval('user_user_id_seq') PRIMARY KEY,
  username text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  disabled boolean NOT NULL DEFAULT false,
  admin boolean NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX IF NOT EXISTS user_pkey ON "user" (user_id);

ALTER TABLE sale_products ADD CONSTRAINT pk_sale_id FOREIGN KEY (sale_id) REFERENCES sales (sale_id);
ALTER TABLE sale_products ADD CONSTRAINT pk_sale_products_id FOREIGN KEY (product_id) REFERENCES products (product_id);
```