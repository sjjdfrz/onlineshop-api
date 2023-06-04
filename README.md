![online-shop Project](https://www.merchantcapital.co.za/hubfs/Electronic%20Online%20Header-01.jpg)

<h3 align="center"><b>online-shop Project</b></h3>

# 📖 onlineshop

This is a small project about building api for an electronic devices onlineshop.

## 🛠 Built With

* [Express](https://expressjs.com/) - The node.js framework used
* [MySQL](https://dev.mysql.com/doc/) - The databse used

## 💻 Getting Started
To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

* Node.js

  https://nodejs.org/en/download

* MySQL

  https://www.mysql.com/downloads/

* Postman

  https://www.postman.com/downloads/

  ### Setup

1) Clone this repository to your desired folder.
```
git clone https://github.com/sjjdfrz/onlineshop-api.git
```

2) Create **config.env** file.

3) Copy content of **config-example.env** file and paste in **config.env** file.
4) Fill variables of mysql with your own data.
```
MYSQL_DB=
MYSQL_PASSWORD=
MYSQL_USER=
MYSQL_HOST=
```

### install
Run this command to install dependencies:
```
npm install
```

### Usage
First of all you must run queries of **queries folder** in your db.

To run the server, execute this command:
```
npm start
```

After that import **DB_Project.postman_collection.json** file in postman and do http requests.

for this routes you must login as admin role:
```
  * http://127.0.0.1:3000/api/v1/products/product-sellers/{ID} [GET]
  * http://127.0.0.1:3000/api/v1/products/cheapest-seller/{ID} [GET]
  * http://127.0.0.1:3000/api/v1/products/sell-amount/{ID}/{month} [GET]
  * http://127.0.0.1:3000/api/v1/products/avg-sell/{month} [GET]
  * http://127.0.0.1:3000/api/v1/products/ [POST]
  * http://127.0.0.1:3000/api/v1/products/{ID} [PATCH]
  * http://127.0.0.1:3000/api/v1/products/{ID} [DELETE]
  
```

for this routes you must just login:

```
  * http://127.0.0.1:3000/api/v1/users/orders/ [GET]
  * http://127.0.0.1:3000/api/v1/users/last-ten-orders/{ID} [GET]
  * http://127.0.0.1:3000/api/v1/users//top-ten-users/{month}/{week}? [GET]
  * http://127.0.0.1:3000/api/v1/users/{city}? [GET]
  * http://127.0.0.1:3000/api/v1/users/{ID} [PATCH]

```

## Concepts:

* Authentication/Authorization (with JWT)
* Error handling
* SQL queries
* etc