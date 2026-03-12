from fastapi import FastAPI
import mysql.connector
from database import connection, cursor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home route
@app.get("/")
def home():
    return {"message": "Truck Management API Running"}

# Get all trips
@app.get("/trips")
def get_trips():
    query = "SELECT * FROM trips"
    cursor.execute(query)
    result = cursor.fetchall()
    return result


# Get single trip
@app.get("/trips/{trip_id}")
def get_trip(trip_id: int):
    query = "SELECT * FROM trips WHERE id=%s"
    cursor.execute(query, (trip_id,))
    result = cursor.fetchone()
    return result


# Create trip
@app.post("/trips")
def create_trip(data: dict):

    total = (data["distance"] * data["rate_per_km"]) + data["toll"] + data["loading_charge"]

    query = """
    INSERT INTO trips
    (truck_number, driver_name, from_city, to_city, distance, rate_per_km, toll, loading_charge, total_fare, trip_date)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        data["truck_number"],
        data["driver_name"],
        data["from_city"],
        data["to_city"],
        data["distance"],
        data["rate_per_km"],
        data["toll"],
        data["loading_charge"],
        total,
        data["trip_date"]
    )

    cursor.execute(query, values)
    connection.commit()

    return {"message": "Trip added", "total_fare": total}


# Update trip
@app.put("/trips/{trip_id}")
def update_trip(trip_id: int, data: dict):

    total = (data["distance"] * data["rate_per_km"]) + data["toll"] + data["loading_charge"]

    query = """
    UPDATE trips
    SET truck_number=%s,
        driver_name=%s,
        from_city=%s,
        to_city=%s,
        distance=%s,
        rate_per_km=%s,
        toll=%s,
        loading_charge=%s,
        total_fare=%s,
        trip_date=%s
    WHERE id=%s
    """

    values = (
        data["truck_number"],
        data["driver_name"],
        data["from_city"],
        data["to_city"],
        data["distance"],
        data["rate_per_km"],
        data["toll"],
        data["loading_charge"],
        total,
        data["trip_date"],
        trip_id
    )

    cursor.execute(query, values)
    connection.commit()

    return {"message": "Trip updated"}


# Delete trip
@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int):

    query = "DELETE FROM trips WHERE id=%s"
    cursor.execute(query, (trip_id,))
    connection.commit()

    return {"message": "Trip deleted"}