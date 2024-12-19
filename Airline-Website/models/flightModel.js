const { connectDB } = require('../config/db');

async function getAllFlights() {
  const connection = await connectDB();

  const query = `
    SELECT 
      f.flight_code,
      dl.name AS departure_location,
      dl.description AS departure_description,
      al.name AS arrival_location,
      al.description AS arrival_description,
      f.departure_time,
      f.arrival_time,
      f.airline,
      f.status,
      a.airplane_code,
      a.manufacturer,
      a.model,
      a.seat_count,
      p.ticket_type_id,
      t.name AS ticket_type,
      t.description AS ticket_description,
      t.category,
      t.trip_type,
      t.airline AS ticket_airline,
      p.price,
      f.departure_location_id
    FROM flights f
    JOIN locations dl ON f.departure_location_id = dl.id
    JOIN locations al ON f.arrival_location_id = al.id
    JOIN airplanes a ON f.airplane_id = a.id
    JOIN prices p ON f.id = p.flight_id
    JOIN ticket_types t ON p.ticket_type_id = t.id
  `;

  const [rows] = await connection.query(query);

  if (rows.length > 0) {
    return rows.map(row => ({
      flight_code: row.flight_code,
      departure: {
        location: row.departure_location,
        description: row.departure_description,
        time: row.departure_time
      },
      arrival: {
        location: row.arrival_location,
        description: row.arrival_description,
        time: row.arrival_time
      },
      airline: row.airline,
      status: row.status,
      airplane: {
        code: row.airplane_code,
        manufacturer: row.manufacturer,
        model: row.model,
        seat_count: row.seat_count
      },
      tickets: {
        type_id: row.ticket_type_id,
        type: row.ticket_type,
        description: row.ticket_description,
        category: row.category,
        trip_type: row.trip_type,
        airline: row.ticket_airline,
        price: row.price
      }
    }));
  } else {
    return [];
  }
}

async function getFlightByCode(flight_code) {
  const connection = await connectDB();

  const query = `
    SELECT 
      f.flight_code,
      dl.name AS departure_location,
      dl.description AS departure_description,
      al.name AS arrival_location,
      al.description AS arrival_description,
      f.departure_time,
      f.arrival_time,
      f.airline,
      f.status,
      a.airplane_code,
      a.manufacturer,
      a.model,
      a.seat_count,
      p.ticket_type_id,
      t.name AS ticket_type,
      t.description AS ticket_description,
      t.category,
      t.trip_type,
      t.airline AS ticket_airline,
      p.price
    FROM flights f
    JOIN locations dl ON f.departure_location_id = dl.id
    JOIN locations al ON f.arrival_location_id = al.id
    JOIN airplanes a ON f.airplane_id = a.id
    JOIN prices p ON f.id = p.flight_id
    JOIN ticket_types t ON p.ticket_type_id = t.id
    WHERE f.flight_code = ?`;

  const [rows] = await connection.query(query, [flight_code]);

  if (rows.length > 0) {
    const row = rows[0];
    return {
      flight_code: row.flight_code,
      departure: {
        location: row.departure_location,
        description: row.departure_description,
        time: row.departure_time
      },
      arrival: {
        location: row.arrival_location,
        description: row.arrival_description,
        time: row.arrival_time
      },
      airline: row.airline,
      status: row.status,
      airplane: {
        code: row.airplane_code,
        manufacturer: row.manufacturer,
        model: row.model,
        seat_count: row.seat_count
      },
      tickets: [{
        type_id: row.ticket_type_id,
        type: row.ticket_type,
        description: row.ticket_description,
        category: row.category,
        trip_type: row.trip_type,
        airline: row.ticket_airline,
        price: row.price
      }]
    };
  } else {
    return null;
  }
}
module.exports = {
  getFlightByCode, getAllFlights
};