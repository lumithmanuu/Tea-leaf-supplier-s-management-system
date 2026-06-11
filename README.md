# Tea Leaf Supplier Quality and Payment Management System

A full-stack web dashboard application for managing tea leaf suppliers, daily leaf collections, grade-based payments, supplier history, and supplier quality reports.

## Overview

This system is designed to support supplier-side operations in a tea factory. It allows an admin or factory officer to manage suppliers, record daily tea leaf collections, calculate payments automatically, and analyze supplier quality performance.

The system supports multi-grade leaf collection, where one supplier can bring different grades of tea leaves on the same day. Payments are calculated based on the grade, weight, and rate per kilogram.

## Background and Motivation

This project was inspired by my real-world work experience in a tea factory after completing my Advanced Level examinations. During that period, I observed that supplier records, daily collections, payment calculations, and quality checking were mostly handled manually.

I identified that this manual process could lead to calculation errors, difficulty in tracking supplier history, and problems when suppliers brought multiple grades of tea leaves in one collection. Because of this, I decided to build a web-based system to make supplier management, payment calculation, and quality reporting more efficient.

This is not only a portfolio project. I also plan to deploy this system and introduce it to the tea factory where I gained this experience.

## Key Features

* Admin login and protected dashboard access
* Supplier management
* Tea leaf grade and price management
* Daily multi-grade leaf collection entry
* Automatic payment calculation
* Supplier quality score calculation
* Supplier collection history
* Dashboard summary reports
* Supplier-wise and grade-wise reports
* Rejected leaf percentage tracking

## Tech Stack

### Frontend

* React.js
* HTML
* CSS
* JavaScript

### Backend

* NestJS
* REST API
* JWT Authentication

### Database

* SQL Database

## Main Modules

* **Admin Authentication** - Secure login and protected dashboard access.
* **Supplier Management** - Add, update, view, and manage supplier details.
* **Grade Management** - Manage tea leaf grades and price rates.
* **Leaf Collection Management** - Record daily collections with multiple grades.
* **Payment Calculation** - Automatically calculate payment based on grade and weight.
* **Supplier History** - View previous collection records of each supplier.
* **Reports Dashboard** - View collection summaries, supplier performance, and quality reports.

## Supplier Quality Score

The supplier quality score is calculated based on the grade distribution of tea leaves.

| Grade    | Quality Points |
| -------- | -------------: |
| A Grade  |            100 |
| B Grade  |             75 |
| C Grade  |             50 |
| Rejected |              0 |

```text
Quality Score = ((A kg × 100) + (B kg × 75) + (C kg × 50) + (Rejected kg × 0)) / Total kg
```

## Database Design

The system uses a relational SQL database with the following main tables:

* Users
* Suppliers
* Grades
* Collections
* CollectionItems

Main relationships:

* One supplier can have many collections.
* One collection can have many collection items.
* One grade can be used in many collection items.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/lumithmanuu/Tea-leaf-supplier-s-management-system.git
```

### 2. Navigate to the project folder

```bash
cd Tea-leaf-supplier-s-management-system
```

### 3. Install and run the frontend

```bash
cd frontend
npm install
npm start
```

### 4. Install and run the backend

Open a new terminal:

```bash
cd backend
npm install
npm run start:dev
```

## Future Enhancements

* PDF receipt generation for suppliers
* SMS notifications to suppliers
* Supplier login portal
* Monthly payment slip generation
* Inventory management
* Mobile application

## Project Purpose

This project was developed as a practical full-stack web application based on a real problem I identified while working in a tea factory.

It demonstrates my knowledge of frontend development, backend API development, SQL database design, CRUD operations, authentication, business logic implementation, payment calculation, and dashboard reporting.


