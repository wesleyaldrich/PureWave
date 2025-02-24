# PureWave
**PureWave** is a **web application** project specifically designed to be a **community website** for **producers and editors**.
The features for this app is still very open for expansion. But as starter point of this project, for every project that is created,
**the default selected feature will be to denoise an audio recording** (mainly designed for speech).

## Tech Stacks
- **Spring Boot** for Backend.
- **React.js** and **Bootstrap 5** for Frontend.
- **MongoDB** for Database.
- **Flask** for API Microservices.

## Team Members
- Baylee Theda as **Frontend Developer and Tester**
- Daniela Vallerine Gunawan as **Frontend Developer and Tester**
- Naufal Dimas Azizan as **AI Microservices Developer**
- Olivio Leoartha as **Frontend Developer and Designer**
- Wesley Aldrich as **Backend Developer and Codebase Master**

## Guide to use this project:
- Clone this project (the **stable** branch) to your local directory then mount it. The main branch is for UI Development, so you'll
  only see the front end code there, which is pointless in this case.
  ```
  git clone -b stable --single-branch https://github.com/wesleyaldrich/PureWave.git
  cd ./purewave
  ```
- Create your own **"application.properties"** file. As you can find in this project, you'll see a file named **"application.properties.example"**.
  Remove the ".example" part from the name, such that it's now named **"application.properties"**.
- You will see these lines in your **"application.properties"** file.
  ```
  # oauth2
  spring.security.oauth2.client.registration.google.client-id="your-oauth2-client-id"
  spring.security.oauth2.client.registration.google.client-secret="your-oauth2-client-secret"
  spring.security.oauth2.client.registration.google.scope=openid,profile,email
  spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google
  spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/auth
  spring.security.oauth2.client.provider.google.token-uri=https://oauth2.googleapis.com/token
  spring.security.oauth2.client.provider.google.user-info-uri=https://www.googleapis.com/oauth2/v3/userinfo
  ```
  To use Google OAuth, you need to create your own credentials for **Client ID** and **Client Secret**:

  1. Go to **Google Cloud Console** → [OAuth Credentials](https://console.cloud.google.com/apis/credentials).
  2. Create a **new OAuth 2.0 Client ID**.
  3. Set **Authorized Redirect URI** to: http://localhost:8080/login/oauth2/code/google
  4. Copy your **Client ID** and **Client Secret** to replace the placeholder I placed in that file.

- You will see these lines in your **"application.properties"** file.
  ```
  # database
  spring.data.mongodb.uri=mongodb://localhost:27017/
  spring.data.mongodb.database=purewave
  ```
  You will need to replace the port to your own local MongoDB Service port while making sure it's installed.
  Also, you have to create the database with the name "purewave" for it to work. Connection name is totally free.

- After doing all the configs, open this file in IntelliJ Idea, run the file from **PureWaveApplication.java**!
  If any error happen related to Maven, you might need to build the **pom.xml** file before re-running it again.
  ![image](https://github.com/user-attachments/assets/d7d736f5-dac5-486b-a6db-6fbce8f2cb47)

## Images
![purewave_1](https://github.com/user-attachments/assets/c83458eb-ee76-426d-9aa2-5ef98e29f58e)
![purewave_2](https://github.com/user-attachments/assets/df0a19ed-c9b0-49c9-b145-eaa2ad5f2e62)
![purewave_3](https://github.com/user-attachments/assets/3f2a1b02-3b7f-4942-a80f-e5510f2d9167)
