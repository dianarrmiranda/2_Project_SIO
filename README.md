# Assignment 2 - <i>Vulnerabilities in software products</i>

This document provides an overview of the project, its structure, vulnerabilities, and execution commands.


**Version Log**
- 1.0: Initial version

## Index

- [Assignment 2 - Vulnerabilities in software products](#assignment-2---vulnerabilities-in-software-products)
  - [Index](#index)
  - [1. Project Description](#1-project-description)
    - [Audited Issues](#audited-issues)
    - [Implemented improvements and fixes](#implemented-improvements-and-fixes)
    - [Aditional Improvements](#aditional-improvements)
    - [Repository stucture](#repository-stucture)
  - [Run the project](#run-the-project)
    - [Run FrontEnd](#run-frontend)
    - [Run frontend inside a docker](#run-frontend-inside-a-docker)
    - [Run backend](#run-backend)
    - [Run backend inside a docker](#run-backend-inside-a-docker)
    - [Setting up Postman (To Test API Endpoints](#setting-up-postman-to-test-api-endpoints)
- [Authors](#authors)


## 1. Project Description

The first iteration of this project involved the development of a merchandising website for DETI (Department of Electronics, Telecommunications, and Informatics), specializing in the sale of stickers, mugs, mousepads, wearables like t-shirts, and pen-drives.

For this delivery, we will coduct a moderatly in-depth ASVS Security Audit, specifically the OWASP ASVS checklist for audits, and identify high relevance issues from the last project's application.
After this audit, we must select the eight most critical issues and implement fixes for them, explaining in depth why we chose the specific issue and how the final fix was implemented.

After this eigth issues are dealt with, we must implement two of the following features:
 - Password strength requirements;
 - Two-Factor authentication using either a OAuth2 system, TOTP one time password system or a FIDO2 challenge response system;
 - Critical data encryption in the Database layer of the original application.


The project comprises two versions:

- **app**: This version is the same as the "app_sec" version of the original delivery, that being the secure version of the initial website where then found vulnerabilites where fixed;
- **app_sec**: The secure more version, where the eight most critical identified vulnerabilities from the security audithave been corrected and two of the chosen features have been implemented, and the overall app security is enhanced.


### Audited Issues

After a comprehensive security audit we have found these critical issues:

- **Issue 1 Name:**

  - Issue 1 description
  - Issue 1 relevance score

- **Issue 2 Name:**     

  - Issue 2 description        
  - Issue 2 relevance score




### Implemented improvements and fixes

We have carefully selected a technology stack for our project:


| Issue          | How we fixed/mitigated the problem                              
| ----------------------- | ---------------------------------------------------------------------- |
| Issue 1 name | Light fix 1 description|
| Issue 2 name | Light fix 2 description|
|...|...       |


### Aditional Improvements
These are the two aditional imprvements we implemented to further extend the security level of our service implementatin:
 - **Improvement name 1**
   - Improvement 1 description.

 - **Improvement name 2** 
   - Improvement 2 description.  


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
git clone git@github.com:detiuaveiro/2st-project-group_02.git
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

