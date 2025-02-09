# WFH Attendance System - Backend

This is the backend of the WFH Attendance System. It is built using Express.js and MySQL.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Update `.env` file in the root directory and update the following environment variables:
    - `DB_CLIENT`
    - `DB_HOST`
    - `DB_USER`
    - `DB_PASS`
    - `DB_NAME`
    - `JWT_SECRET`
    - `JWT_REFRESH_SECRET`
4. Update front-end URL in `server.js` file (line 28)
5. Run `npm run migrate:refresh` to create the database tables (and seeders)
6. Run `npm run dev` to start the server
7. By default, the server will be running on `http://localhost:3000`
8. Testings can be done using Postman using this [file](./Postman%20Collection.postman_collection.json) by importing it to Postman then update the environment variables.
