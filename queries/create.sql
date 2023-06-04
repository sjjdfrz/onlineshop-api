CREATE SCHEMA mydb1;
USE mydb1;



CREATE TABLE product
(
    ID    INT NOT NULL,
    name  VARCHAR(20) NOT NULL,
    price INT NOT NULL,
    brand VARCHAR(20),
    online_shop_website_url  VARCHAR(50) REFERENCES online_shop (website_url),
    category VARCHAR(45),
    PRIMARY KEY (ID)
);


CREATE TABLE comment
(
    description  VARCHAR(200),
    score INT ,
    product_ID INT REFERENCES product (ID)

);



CREATE TABLE users
(
    ID       INT NOT NULL,
    name     VARCHAR(50) NOT NULL,
    mobile   VARCHAR(50),
    zip_code VARCHAR(50),
    country  VARCHAR(50),
    city     VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer',
    PRIMARY KEY (ID)

);


CREATE TABLE supplier
(
    ID      INT NOT NULL,
    name    VARCHAR(50) NOT NULL,
    city VARCHAR(50),
    PRIMARY KEY (ID)
);


CREATE TABLE online_shop
(
    website_url    VARCHAR(50)  NOT NULL,
    phone          VARCHAR(50),
    name           VARCHAR(50),
    PRIMARY KEY (website_url)
);


CREATE TABLE bill
(
    ID           INT NOT NULL,
    count        INT,
    total_price  INT,
    purchaser    VARCHAR(50),
    product_name VARCHAR(50),
    date datetime,
    supplier_ID  INT REFERENCES supplier (ID)

);


CREATE TABLE discount
(
    amount     INT,
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)

);


CREATE TABLE profilePage
(
   
    email         VARCHAR(50) NOT NULL,
    password      VARCHAR(50) NOT NULL,
    user_ID   INT REFERENCES users (ID),
    PRIMARY KEY (email, user_ID)
);


CREATE TABLE price_history
(
    price      INT,
    date datetime,
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)
);


CREATE TABLE shopping_card
(
    order_no     INT   NOT NULL,
    date datetime,
    total_price  INT,
    user_ID  INT REFERENCES users (ID),
    product_name VARCHAR(50),
    PRIMARY KEY (order_no, user_ID)

);


CREATE TABLE camera
(
    resolution INT,
    PRIMARY KEY (product_ID),
    product_ID INT REFERENCES product (ID)
);


CREATE TABLE game_console
(
    storage    VARCHAR(50),
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)
);


CREATE TABLE audio_device
(
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)

);


CREATE TABLE speaker
(
    connection  VARCHAR(30),
    audio_device_product_ID INT REFERENCES audio_device (product_ID),
    PRIMARY KEY (audio_device_product_ID)
);

CREATE TABLE headphone
(
    color                   VARCHAR(50),
    audio_device_product_ID INT REFERENCES audio_device (product_ID),
    PRIMARY KEY (audio_device_product_ID)
);

CREATE TABLE TV
(
    quality    VARCHAR(50),
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)
);

CREATE TABLE laptop
(
    RAM        VARCHAR(50),
    OS         VARCHAR(50),
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)
);

CREATE TABLE mobile
(
    network    VARCHAR(50),
    product_ID INT REFERENCES product (ID),
    PRIMARY KEY (product_ID)
);

CREATE TABLE product_has_supplier
(
    product_ID  INT REFERENCES product (ID),
    supplier_ID INT REFERENCES supplier (ID),
    PRIMARY KEY (product_ID, supplier_ID)
);


CREATE TABLE online_shop_has_user
(
    online_shop_website_url VARCHAR(50) REFERENCES online_shop (website_url),
    user_ID             INT REFERENCES users (ID),
    PRIMARY KEY (online_shop_website_url, user_ID)
);


CREATE TABLE shopping_card_has_product
(
    order_no INT REFERENCES shopping_card (order_no),
    user_ID             INT REFERENCES shopping_card (user_ID),
    product_ID             INT REFERENCES product (ID),
    PRIMARY KEY (order_no, user_ID, product_ID)
);
