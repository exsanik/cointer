CREATE TABLE Family(
    Family_ID SERIAL PRIMARY KEY,
    Family_Name VARCHAR(255),
    Family_Code VARCHAR(10) NOT NULL
);

CREATE TABLE Counter_Agent(
    Counter_Agent_ID SERIAL PRIMARY KEY,
    Agent_Name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    Family_ID INTEGER REFERENCES Family,
    Avatar_Hash VARCHAR(10)
);

CREATE TABLE Account_Types(
    Account_Type_ID SERIAL PRIMARY KEY,
    Account_Type VARCHAR(100) NOT NULL
);

CREATE TABLE Currency(
    Currency_ID SERIAL PRIMARY KEY,
    Currency_Type VARCHAR(10) NOT NULL,
    value_to_UAH money 
);

CREATE TABLE Counter_Agent_Account(
    Agent_Account_ID SERIAL PRIMARY KEY,
    Balance MONEY DEFAULT 0,
    Account_Type_ID INTEGER REFERENCES Account_Types,
    Counter_Agent_ID INTEGER REFERENCES Counter_Agent,
    Currency_ID INTEGER REFERENCES Currency,
    Account_Name VARCHAR(100)
);

CREATE TABLE Income_Categories(
    Income_Category_ID SERIAL PRIMARY KEY,
    Income_Category_Name VARCHAR(20) NOT NULL,
    Counter_Agent_ID INTEGER REFERENCES Counter_Agent
);

CREATE TABLE Income(
    Income_ID SERIAL PRIMARY KEY,
    Agent_Account_ID INTEGER REFERENCES Counter_Agent_Account
    On delete cascade,
    Income_Category_ID INTEGER REFERENCES Income_Categories,
    Income_Date DATE NOT NULL,
    Income_Value MONEY NOT NULL
);

CREATE TABLE Spend_Categories(
    Spend_Category_ID SERIAL PRIMARY KEY,
    Spend_Category_Name VARCHAR(20) NOT NULL,
    Counter_Agent_ID INTEGER REFERENCES Counter_Agent
);

CREATE TABLE ClosureTable(
    Pair_ID SERIAL PRIMARY KEY,
    Parent_ID INTEGER REFERENCES Spend_Categories NULL on delete cascade,
    Child_ID INTEGER REFERENCES Spend_Categories NULL on delete cascade,
    Depth INTEGER
);

CREATE TABLE ClosureTable_Income(
    Pair_ID SERIAL PRIMARY KEY,
    Parent_ID INTEGER REFERENCES Spend_Categories NULL on delete cascade,
    Child_ID INTEGER REFERENCES Spend_Categories NULL on delete cascade,
    Depth INTEGER
);

CREATE TABLE Spend(
    Spend_ID SERIAL PRIMARY KEY,
    Spend_Category_ID INTEGER REFERENCES Spend_Categories,
    Agent_Account_ID INTEGER REFERENCES Counter_Agent_Account
    on delete cascade,
    Spend_Date DATE NOT NULL,
    Spend_Value MONEY NOT NULL,
    Spend_Name VARCHAR(255),
    Usefull BOOLEAN
);