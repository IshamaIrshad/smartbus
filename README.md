# SmartBus

A bus ticket booking system for Sri Lanka. Passengers search for buses, pick a
seat, pay and get a PDF ticket. Bus company staff (admins, drivers and
conductors) use the same website to manage buses, routes, schedules and trips.

- **Frontend:** React (`smartbus-frontend/`), runs on port 3000
- **Backend:** Spring Boot 4 + Java 21 REST API (`smartbus-backend/`), runs on port 8080
- **Database:** MySQL 8
- **Login:** JWT tokens, with four roles: Passenger, Admin, Driver, Conductor

```
Browser ──► React app (:3000) ──► Spring Boot API (:8080) ──► MySQL (:3306)
```

## Project structure

```
smartbus/
├── README.md
├── smartbus-backend/              Spring Boot API
│   ├── pom.xml
│   ├── .env.example               copy to .env and fill in (see below)
│   └── src/main/java/com/smartbus/backend/
│       ├── controller/            REST endpoints (/api/...)
│       ├── service/               business logic (bookings, tickets, PDF/QR, reports)
│       ├── repository/            database access (Spring Data JPA)
│       ├── entity/                database tables
│       ├── dto/                   request / response shapes
│       ├── security/              JWT login filter and service
│       └── config/                security/CORS, error handler, role seeding
└── smartbus-frontend/             React app
    ├── public/                    index.html, images
    └── src/
        ├── App.js                 all page routes
        ├── components/Navbar.js
        ├── pages/                 one file per screen
        └── styles/                one CSS file per screen
```

## How to run it

### 1. Install the tools

| Tool | Version |
|---|---|
| Java JDK | 21 |
| Node.js | 18 or newer (with npm) |
| MySQL | 8 |

### 2. Create the database

Start MySQL, then create an empty database. The tables are created
automatically the first time the backend starts.

```sql
CREATE DATABASE smartbus_db;
```

### 3. Configure the backend

Passwords are **not** stored in the code. Create your own settings file:

```bash
cd smartbus-backend
cp .env.example .env
```

Open `.env` and set:

| Setting | What to put |
|---|---|
| `DB_PASSWORD` | your MySQL root password |
| `DB_USERNAME` / `DB_URL` | only change if your MySQL is not `root` on `localhost:3306` |
| `JWT_SECRET` | a long random Base64 string, for example the output of `openssl rand -base64 48` |

`.env` is git-ignored. Never commit it.

### 4. Start the backend

```bash
cd smartbus-backend
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```

Wait for `Started SmartbusBackendApplication`. The API is now on
http://localhost:8080. The four roles (Admin, Driver, Conductor, Passenger)
are created automatically on first start.

### 5. Start the frontend

In a second terminal:

```bash
cd smartbus-frontend
npm install
npm start
```

Open http://localhost:3000.

> The backend only accepts requests from `http://localhost:3000` and
> `http://localhost:3001`. If you run the frontend on another port, add it to
> `setAllowedOrigins` in `smartbus-backend/src/main/java/com/smartbus/backend/config/SecurityConfig.java`.

### 6. Create the first admin

Anyone can register as a **passenger** from the website. There is no public
sign-up for admins, so make the first admin yourself:

1. Open http://localhost:3000/register and create an account.
2. Promote it in MySQL:

   ```sql
   UPDATE users
   SET role_id = (SELECT role_id FROM roles WHERE role_name = 'ADMIN')
   WHERE email = 'your-email@example.com';
   ```
3. Log in with that account. You now land on the admin dashboard.

From the admin area you can create driver and conductor accounts
(**Manage Staff**).

## What to do on the website

### Visitors (not logged in)
- **Home** `/` – overview, why SmartBus, popular routes
- **Search** `/search` – look up buses by route and date
- **About** `/about`, **Contact** `/contact`
- **Register** `/register` / **Login** `/login`

### Passengers
1. **Register**, then **log in**.
2. **Search** for a bus: choose pick-up and drop-off points and a date.
3. **Select a seat** on the seat map (booked seats are shown as taken).
4. Check the **booking summary**, then **pay** (online, or pay on boarding).
5. On the **confirmation** page, generate and **download your PDF ticket**
   (the conductor checks it in later from the Tickets page).
6. **My Bookings** shows all your trips and lets you **cancel** a booking.
7. **Profile** lets you edit your details. **Track Bus** shows a map.

### Admins
Set everything up in this order:

1. **Manage Routes** – add routes (for example "Colombo to Kandy").
2. **Manage Buses** – add buses with their seat capacity.
3. **Manage Schedules** – create trips: bus, route, date, times, and ticket
   prices between pick-up and drop-off points.
4. **Manage Staff** – create drivers and conductors, then assign them to
   schedules.
5. **Manage Bookings / Manage Passengers** – review and manage what customers did.
6. **Reports** – bookings and revenue summaries.

### Drivers
- **Dashboard** – today's assigned trip, bus and route
- **My Trip**, **Passengers**, **Track Bus**, **Profile**

### Conductors
- **Dashboard** – assigned trip details
- **Passengers** – everyone booked on the trip
- **Tickets** – verify (check in) passenger tickets; cancelled bookings are rejected
- **My Trip**, **Track Bus**, **Profile**

## Page map

| Area | Pages |
|---|---|
| Public | `/` · `/about` · `/contact` · `/login` · `/register` |
| Booking | `/search` → `/seat-selection` → `/booking-summary` → `/payment` → `/booking-confirmation` |
| Passenger | `/passenger-dashboard` · `/my-bookings` · `/profile` · `/track-bus` |
| Admin | `/admin-dashboard` · `/manage-buses` · `/manage-routes` · `/manage-schedules` · `/manage-bookings` · `/manage-passengers` · `/manage-staff` · `/admin-reports` |
| Driver | `/driver-dashboard` · `/driver-my-trip` · `/driver-passengers` · `/driver-track-bus` · `/driver-profile` |
| Conductor | `/conductor-dashboard` · `/conductor-my-trip` · `/conductor-passengers` · `/conductor-tickets` · `/conductor-track-bus` · `/conductor-profile` |

## Known limitations

- The **driver pages** and the passenger **Track Bus** map currently show
  **sample data**; they are not connected to the backend yet (the backend
  endpoints for them already exist).
- The frontend calls the backend at `http://localhost:8080` (hardcoded), so it
  is meant for local use until that address is moved into a setting.
- Card payment is simulated: no real payment provider is connected and card
  details are never sent to the server.

## Useful commands

```bash
# backend
cd smartbus-backend
./mvnw test                 # run backend tests
./mvnw spring-boot:run      # start the API

# frontend
cd smartbus-frontend
npm start                   # dev server on :3000
npm run build               # production build in build/
```
