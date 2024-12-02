# Paperless Billing System

![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/Logo.jpg?raw=true)

The project aim is to reduce the use of 
paper and prepare a digital bill receipt using barcode scanner, for a merchant and after proving digital 
signature, send it to the customer via a mail. 
 

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Screenshots](#project-screenshots)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview
The Paperless Billing System is a modern, eco-friendly solution designed to streamline the billing process by eliminating paper-based transactions. Implemented a digital bill receipt generation system using Node.js, SQL DBMS, HTML, 
CSS, and JavaScript. Integrated barcode scanning technology for efficient invoice retrieval and processing for merchants. Ensured data integrity and authentication using SHA-256 hashing algorithm and RSA 
digital signatures. Designed and implemented a secure email delivery system to send digital bill receipts to 
customers after verification

## Features
1. ### Registration 
   - User can register his company on system with required details.
2.  ### Prepare Bill
    - System user read barcode of products with the help of barcode reader and prepare bill.
3. ### Digitally sign Receipt
   - After payment is received from customer, receipt with digital signature is generated.
4. ###  Email Receipt to Customer
   - After Receipt is singed then it will be send to specified email address of customer.
5. ###  Verify Receipt
   - eceipt can be verified in future. In case of any changes in data inside receipt, then changes will be detected.
6. ###  View Reports
   - System user can view past records of orders.
7. ###  Manage Inventory Database
   - System user can add,delete,modify products in inventory database.
8. ### Administrative dashboard
9. ### Report generation and analytics


## Technology Stack
- Frontend: 
  - HTML
  - CSS
  - JavaScript

- Backend: 
  - Node.js(Express)

- Database: 
  - SQL DBMS
- Authentication: 
  - SHA-256 hashing algorithm and 
  - RSA digital signatures


## Project Screenshots:

<img src="https://res.cloudinary.com/do9zaevax/image/upload/Paperless_billing_system/gpaijdzaveo4e6u0pzss" alt="project-screenshot">

<img src="https://res.cloudinary.com/do9zaevax/image/upload/Paperless_billing_system/ehmby6hrtdgeguncglwy" alt="project-screenshot">

![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/prepare_bill.png?raw=true)

![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/Payment.png?raw=true)

![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/Receipt.png?raw=true)

![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/Email_receipt.png?raw=true)

![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/verify_bill.png?raw=true)


![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/Reports.png?raw=true)


![alt text](https://github.com/Raviast/Paperless-Billing-System/blob/main/public/images/Add_products.png?raw=true)


## Prerequisites
 - ### Hardware
   - Barcode Reader
   - Products with UPC Barcode
   - Computer machine( 4GB RAM, 1TB Storage)
   - Database storage (local hard disk)
 - ### Software
   - Visual Studio Code
   - Browser
   - MySQL workbench
   - Node.JS development Environment
- ### Software Requirements
   -  HTML, Bootstrap, CSS, Javascript
   -  Node.js on server
   -  MySQL for database management
   -  PDFKIT
   - Pdf Reader
   - PDF-LIB
   - NodeMailer

- ### Hardware Requirements
   -  Barcode Reader
   -  100GB Memory for Database (as per requirement)
   - Computer system with browser

## Installation
1. Clone the repository
```bash
git clone https://github.com/Raviast/Paperless-Billing-System.git
```
2. Navigate to project directory
```
cd paperless-billing-system
```
3. Install dependencies for web application
```
npm install
```
4. Run the project
```
node server.js
```

## Usage
1. ### Admin Portal

   - Managing bills

   - User management

   - System configuration

   - Report generation

2. ### Customer Portal

   - View bills

   - Make payments

   - Download invoices

   - View payment history

## Security Features
  - Encrypted data transmission

  - Secure payment processing

  - Role-based access control

   - Session management

   - Data backup and recovery

# Contributing
We welcome contributions! Please follow these steps:

 1. Fork the repository

 2. Create your feature branch 
    ```
    git checkout -b feature/AmazingFeature 
    ```
 3. Commit your changes (``` git commit -m 'Add some AmazingFeature'```)

 4. Push to the branch (``` 
 git push origin feature/AmazingFeature```)

 5. Open a Pull Request


# License
 This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgments
 - Thanks to all contributors and supporters

