# Assignment 1 - <i>Vulnerabilities in software products</i>

This document provides an overview of the project, its structure, vulnerabilities, and execution commands.


**Version Log**
- 2.0: Final version

## Index

- [Assignment 1 - Vulnerabilities in software products](#assignment-1---vulnerabilities-in-software-products)
  - [Index](#index)
  - [1. Project Description](#1-project-description)
    - [Project specifications](#project-specifications)
    - [Technology Stack](#technology-stack)
    - [Repository stucture](#repository-stucture)
  - [Run the project](#run-the-project)
    - [Run FrontEnd](#run-frontend)
    - [Run frontend inside a docker](#run-frontend-inside-a-docker)
    - [Run backend](#run-backend)
    - [Run backend inside a docker](#run-backend-inside-a-docker)
    - [Setting up Postman (To Test API Endpoints](#setting-up-postman-to-test-api-endpoints)
  - [Vulnerabilities implemented](#vulnerabilities-implemented)
- [Authors](#authors)


## 1. Project Description

This project involves the development of a merchandising website for DETI (Department of Electronics, Telecommunications, and Informatics), specializing in the sale of stickers, mugs, mousepads, wearables like t-shirts, and pen-drives.


The project comprises two versions:

- **app**: This version contains hidden vulnerabilities that may not be easily detectable by casual users due to coding errors and improper practices, posing a risk to the overall app's security and user privacy.
- **app_sec**: The secure version, where identified vulnerabilities have been corrected, and the overall app security is enhanced.


### Project specifications

Our e-commerce store offers a comprehensive range of functionalities, including:


- **User Management:**

  - User registration and login
  - User profiles
  - Password management (reset, change)
  - User roles and permissions (admin, customer)

- **Product Catalog:**

  - Product listings with details (name, description, price, images)
  - Product categories and filters
  - Product search functionality

- **Shopping Cart:**

  - Cart management (add, remove, update items)
  - Cart total calculation
  - Saved cart

- **Checkout Process:**

  - Shipping and billing information collection
  - Payment processing
  - Order confirmation and receipt generation

- **Inventory Management:**

  - Tracking product availability (in-stock, out-of-stock)
  - Managing product quantities

- **Order History:**

  - View and track past orders

- **Reviews and Ratings:**
  - Allow customers to rate and review products
  - Display average ratings and reviews

### Technology Stack

We have carefully selected a technology stack for our project:


| Project Component          | Technology Stack                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| FrontEnd Framework      | [React](https://react.dev/)                                            |
| CSS Framework           | [Tailwind](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) |
| Component Framework     | [MUI](https://mui.com/)                                                |
| API connection and call | [Axios](https://axios-http.com/)                                       |
| Backend API             | [SpringBoot](https://spring.io/projects/spring-boot)                   |
| Backend Database        | [H2](https://h2database.com/html/main.html)                            |

### Repository stucture

Our repository is organized as follows:

```
.
├── analysis
|   ├── postman_collections
|   └── report.pdf
|   
├── app
│   ├── backend
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   └── com
│   │       │   │       └── shop_backend
│   │       │   │           ├── controllers
│   │       │   │           └── models
│   │       │   │               ├── entities
│   │       │   │               └── repos
│   │       │   └── resources
│   │       └── test
│   └── frontend
│       ├── public
│       └── src
│           ├── assets
│           │   └── prod_images
│           ├── components
│           │   ├── layout
│           │   └── pages
│           ├── constants
│           └── utils
└── app_sec
    ├── backend
    │   └── src
    │       ├── main
    │       │   ├── java
    │       │   │   └── com
    │       │   │       └── shop_backend
    │       │   │           ├── controllers
    │       │   │           └── models
    │       │   │               ├── entities
    │       │   │               └── repos
    │       │   └── resources
    │       └── test
    └── frontend
        ├── public
        └── src
            ├── assets
            │   └── prod_images
            ├── components
            │   ├── layout
            │   └── pages
            ├── constants
            └── utils
```

## Run the project

Clone the repository locally:

```bash
git clone git@github.com:detiuaveiro/1st-project-group_02.git
```

As per the assignment, our project has two versions. Their run commands are the same but executed in their respective directories.

### Run FrontEnd

Navigate to the desired version

```bash
# Assuming you're in the root of the repository
cd <app | app_sec>
```

Go to the frontend directory:   

```bash
cd frontend
```

Install dependencies

```bash
yarn
-or-
npm install
```

Run the project

```bash
yarn dev
-or-
npm run dev
```

### Run frontend inside a docker

```bash
cd frontend
docker build -t react-docker:latest . 
docker run -p 5173:5173 react-docker:latest
```
---

### Run backend

Navigate to the desired version

```bash
# Assuming you're in the root of the repository
cd <app | app_sec>
```

Navigate to the root of the backend project:

```bash
cd backend/Backend
```

Run Spring-Boot:

```bash
 ./mvnw spring-boot:run
```

### Run backend inside a docker

```bash
cd backend/Backend
./mvnw install
docker build --build-arg JAR_FILE=target/shop_backend-0.0.1-SNAPSHOT.jar -t com/shop_backend .
docker run -p 8080:8080 com/shop_backend
```

### Setting up Postman (To Test API Endpoints)

Install [Postman Desktop](https://www.postman.com/downloads/).
If you are using Linux, you can search for it in package managers like [snap](https://snapcraft.io/postman) or [flatpack](https://flathub.org/apps/com.getpostman.Postman).

After installing, log in and follow this [tutorial](https://apidog.com/blog/how-to-import-export-postman-collection-data/) to import `/analysis/postman_collections/col.json` collection for each project version (*app* or *app_sec*).
To test the endpoints, make sure you have **Spring-Boot running**.

## Vulnerabilities implemented

In the insecure version of our project, we have intentionally implemented various vulnerabilities for demonstration purposes. To maintain simplicity, we list them in the following table:

| Vulnerability Code | Description                                       |
| ------------------ | --------------------------------------------------|
| **CWE-79**         | Cross-Site Scripting                              |
| **CWE-89**         | SQL Injection                                     |
| **CWE-20**         | Improper Input Validation                         |
| **CWE-521**        | Weak Password Requirements                        |
| **CWE-434**        | Unrestricted Upload of File with Dangerous Type   |
| **CWE-862**        | Missing Authorization                             |
| **CWE-256**        | Plaintext Storage of a Password                   |
| **CWE-287**        | Improper Authentication                           |
| **CWE-201**        | Insertion of sensitive information into sent data |

# Authors

Meet the team members who contributed to the project:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center">
        <a href="https://github.com/P-Ramos16">
            <img src="https://avatars0.githubusercontent.com/P-Ramos16?v=3" width="100px;" alt="Ramos"/>
            <br />
            <sub>
                <b>Pedro Ramos</b>
                <br>
                <i>107348</i>
            </sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/miguel-silva48">
            <img src="https://avatars0.githubusercontent.com/miguel-silva48?v=3" width="100px;" alt="Miguel"/>
            <br />
            <sub>
                <b>Miguel Silva</b>
                <br>
                <i>107449</i>
            </sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/dianarrmiranda">
            <img src="https://avatars0.githubusercontent.com/dianarrmiranda?v=3" width="100px;" alt="Diana"/>
            <br />
            <sub>
                <b>Diana Miranda</b>
                <br>
                <i>107457</i>
            </sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Dan1m4D">
            <img src="https://avatars0.githubusercontent.com/Dan1m4D?v=3" width="100px;" alt="Madureira"/>
            <br />
            <sub>
                <b>Daniel Madureira</b>
                <br>
                <i>107603</i>
            </sub>
        </a>
    </td>
  </tr>
</table>

