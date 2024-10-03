# Hotel Room Reservation App: Spring Boot Backend, React Frontend & Postgres Database

This project consists of two main parts:
1. **Backend**: A Java Spring Boot application.
2. **Frontend**: A React.js application.

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Java Development Kit (JDK)** 8 or later (Recommended: JDK 11).
  - [Download JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- **Apache Maven** for managing the backend dependencies.
  - [Download Maven](https://maven.apache.org/install.html)
- **Node.js** and **npm** for managing frontend dependencies.
  - [Download Node.js and npm](https://nodejs.org/en/download/)
- **PostgreSQL** for the database.
  - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** for version control.
  - [Download Git](https://git-scm.com/downloads)

## Getting Started

### Database: Postgres

**Configure postgres server instance**

### Backend: Java Spring Boot

1. **Clone the repository and move to backend directory:**
    ```bash
    git clone https://github.com/kamilMlynarczykk/room-reservation-app-Springboot-React.git
    cd hotel-room-reservation-app-java/hotel-reservation-app-backend
    ```
    

2. **Build the Project:**
    ```bash
    mvn clean install
    ```

3. **Run the Application:**
    ```bash
    mvn spring-boot:run
    ```

    The backend should now be running at: `http://localhost:8080`

4. **Backend Configuration:**
    Ensure your `application.yml` file is properly configured, especially database connection settings.
   ```bash
   spring:
    datasource:
      url: jdbc:postgresql://localhost:5432/ #server name
      username: #your username
      password: #your password
      driver-class-name: org.postgresql.Driver
   ```

---

### Frontend: React.js

1. **Navigate to the Frontend Directory:**
    ```bash
    cd hotel-reservation-app-frontend
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Configure Backend URL:**
    Open the `.env` file or any relevant configuration file and set the backend URL:
    ```bash
    REACT_APP_BACKEND_URL=http://localhost:8080
    ```

4. **Run the Application:**
    ```bash
    npm run dev

---

