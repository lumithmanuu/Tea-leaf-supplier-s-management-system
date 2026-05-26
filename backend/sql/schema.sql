CREATE DATABASE tea_leaf_management;
GO

USE tea_leaf_management;
GO

CREATE TABLE Users (
    userId INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

CREATE TABLE Suppliers (
    supplierId INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Active',
    registeredDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Grades (
    gradeId INT PRIMARY KEY IDENTITY(1,1),
    gradeName VARCHAR(50) NOT NULL,
    ratePerKg DECIMAL(10,2) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE Collections (
    collectionId INT PRIMARY KEY IDENTITY(1,1),
    supplierId INT NOT NULL,
    collectionDate DATE NOT NULL,
    totalWeight DECIMAL(10,2) DEFAULT 0,
    totalAmount DECIMAL(10,2) DEFAULT 0,
    qualityScore DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (supplierId) REFERENCES Suppliers(supplierId)
);

CREATE TABLE CollectionItems (
    itemId INT PRIMARY KEY IDENTITY(1,1),
    collectionId INT NOT NULL,
    gradeId INT NOT NULL,
    weightKg DECIMAL(10,2) NOT NULL,
    ratePerKg DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (collectionId) REFERENCES Collections(collectionId),
    FOREIGN KEY (gradeId) REFERENCES Grades(gradeId)
);

INSERT INTO Users (name, email, password, role)
VALUES ('Factory Admin', 'admin@teafactory.local', 'admin123', 'admin');

INSERT INTO Grades (gradeName, ratePerKg, description)
VALUES
    ('A Grade', 300.00, 'High quality tea leaves'),
    ('B Grade', 260.00, 'Medium quality tea leaves'),
    ('C Grade', 220.00, 'Low quality tea leaves'),
    ('Rejected', 0.00, 'Rejected leaves');
