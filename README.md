# Task Tracker

This is a small web app I wrote to keep track of personal tasks. Nothing huge or enterprise level, just a normal site where you can register, log in add tasks with priority and status and mark things done. There is also a small weather block that looks at the city stored in your profile and asks OpenWeather for the current situation outside. Also there is a quotes.

The project is built on Node.js with Express and EJS on the server side, MySQL for the database, Bootstrap for layout and some simple custom styles and a tiny script for the dashboard.

---

## What you need before you start

To make this thing run on your own PC you should have:

- Node.js and npm installed  
- MySQL server running locally  
- Git or at least a way to download the repo as a folder  

If you can open a terminal, run `node -v`, `npm -v` and connect to MySQL, you are fine.

---

## Getting the code

Clone the repo from GitHub to your computer:

```bash
git clone https://github.com/arturrw/task-tracker-university.git
```

After the repo is on your machine go inside the project folder:

```bash
cd task-tracker
```

If the folder name is a bit different in your case, just update it when you run the command.

---

## Installation

Inside the project folder install all Node packages:

```bash
npm install
```

This reads `package.json` and pulls Express, EJS, MySQL client, sessions, axios and everything else the app needs. The `node_modules` folder will appear automatically, you do not have to touch it.

---

## Database setup

The app expects a MySQL database with a specific structure. I already prepared an sql file for that.

In the project there is a file:

```text
sql/schema.sql
```

Open a terminal and log in to MySQL as a user that has enough rights to create databases and users, usually something like:

```bash
mysql -u root -p
```

Once you are inside the MySQL run:

```sql
SOURCE /full/path/to/sql/schema.sql;
```

or, if you are already in the project folder and MySQL is started with the right working directory:

```sql
SOURCE sql/schema.sql;
```

This script will:

- create a database `task_tracker_db`
- create a user `tt_user` with a password from the script
- User access to the new database
- create `users` and `tasks` tables with the columns that the app expects
---

## Environment variables

In the root of the project there is a file named `.env.example`. This is a template with all the variables the app uses.

Create your own `.env` file based on it.

On Windows you can create a new file called `.env` and copy the values from `.env.example` by hand.

Then open `.env` in any editor and fill in the values:

```env
PORT=3000

DB_HOST=localhost
DB_USER=tt_user
DB_PASSWORD=strong_password_here
DB_NAME=task_tracker_db

SESSION_SECRET=some_secret_string_here

WEATHER_API_KEY=your_openweather_api_key_here
WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5/weather
```
---

## Running the server

After the database and `.env` are ready go back to your terminal in the project folder and run:

```bash
npm start
```

This command just runs:

```bash
node server.js
```

in the background because that is how it is defined in `package.json`.

If everything is fine, you should see something like:

```text
Server is running on http://localhost:3000
```

Open the browser and go to:

```text
http://localhost:3000
```

If you are not logged in yet the app will send you to the login and registration pages first.

---

## Quick tour of how to use it

The flow is pretty simple:

1. First create an account.  
   Go to the registration page, fill in email, password and optional fields like name and city. The city is later used for the weather block on the dashboard.

2. Log in.  
   After registration you can log in with the same email and password. A session is created for you using `express-session`.

3. Work with tasks.  
   On the tasks screen you can create a new task with a title, description, priority, status, category and deadline. Later you can edit tasks, change status when something is completed or archive what you no longer need. There are filters to narrow down tasks by status or priority so the list does not become a complete mess.

4. Check your profile and weather.  
   In the profile page you can update your name and city. After that, when you open the dashboard, the app will try to load weather data for that city using your OpenWeather key from `.env`.

If you break something in the database or in the environment file, the most common result is that the server throws errors about connection problems or missing tables. In that case I usually go back to `schema.sql`, run it again.

---

## Stopping the app

To stop the server just go to the terminal where it is running and press `Ctrl + C`. The port will be end and you can start it again later with `npm start`.

---
