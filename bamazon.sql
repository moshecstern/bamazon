DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(30) NOT NULL,
  department VARCHAR(30) NOT NULL,
  price INT DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  product_sales INT DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs INT(30) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("couch", "furniture", 800, 200);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("table", "furniture", 120, 300);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("bed", "furniture", 250, 150);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("mattress", "furniture", 400, 200);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("chair", "furniture", 80, 100);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("playstation", "electronics", 300, 350);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("x-box", "electronics", 250, 350);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("Iphone", "electronics", 1500, 150);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("backpack", "outdoors", 60, 200);

INSERT INTO products (item_name, department, price, stock_quantity)
VALUES ("boots", "outdoors", 120, 100);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", "800");

INSERT INTO departments (department_name, over_head_costs)
VALUES ("furniture", "1200");

INSERT INTO departments (department_name, over_head_costs)
VALUES ("outdoors", "400");