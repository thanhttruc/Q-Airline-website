import React, { useState, useEffect, useContext } from 'react';
import { Input, Button } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/booking.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const flight = location.state?.flight;

  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingStatus, setBookingStatus] = useState('');
  const [flightCode, setFlightCode] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [flightId, setFlightId] = useState('');

  useEffect(() => {
    if (flight && flight.tickets && flight.tickets.length > 0) {
      setTicketType(flight.tickets[0].type);
      setTicketPrice(parseFloat(flight.tickets[0].price));
      setTotalPrice(parseFloat(flight.tickets[0].price));
      setFlightCode(flight.flight_code);
      setDepartureTime(flight.departure.time);
      setArrivalTime(flight.arrival.time);
      setFlightId(flight.flight_id);
    }
  }, [flight]);

    const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    setQuantity(quantity);
    setTotalPrice(ticketPrice * quantity);
  };


    const handleBooking = () => {
        if (!user) {
            setBookingStatus('Bạn cần đăng nhập để mua vé.');
            return;
        }
        if (!passengerName || !email || !phone) {
            setBookingStatus('Vui lòng điền đầy đủ các trường.');
            return;
        }
        const departureTimeISO = new Date(departureTime).toISOString();
        const arrivalTimeISO = new Date(arrivalTime).toISOString();


        const bookingData = {
            user_id: user.id,
            totalPrice: totalPrice,
            orderDetails: [
                {
                    flightId: flightId,
                    ticketTypeId: flight.tickets[0].type_id,
                    quantity: quantity,
                    priceId: 1,
                    flightCode: flightCode,
                    departureTime: departureTimeISO,
                    arrivalTime: arrivalTimeISO,
                    ticketTypeName: ticketType,
                    price: ticketPrice,
                },
            ],
            voucherCode: 'HOLIDAY10',
        };


        fetch(`http://localhost:3000/api/booking/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Đơn hàng đã được tạo thành công') {
                    setBookingStatus(`Đặt vé thành công! Mã đơn hàng: ${data.order.orderId}`);
                    
                } else {
                    setBookingStatus('Đặt vé thất bại. Vui lòng thử lại.');
                }
            })
            .catch((err) => {
                console.error('LỗI. Vui lòng thử lại:', err);
                setBookingStatus('LỗI. Vui lòng thử lại.');
            });
    };


  if (!flight) {
    return <p>Đang tải thông tin chuyến bay...</p>;
  }

  const { departure, arrival, flight_code, airline } = flight;
  const departureLocation = departure?.location || 'N/A';
  const arrivalLocation = arrival?.location || 'N/A';

  return (
    <div className="booking-container">
      <h2>Vé của bạn : {flight_code}</h2>
      <div className="flight-summary">
        <p><strong>Hãng hàng không:</strong> {airline}</p>
        <p><strong>Khởi hành:</strong> {departureLocation} at {departureTime}</p>
        <p><strong>Điểm đến:</strong> {arrivalLocation} at {arrivalTime}</p>
        <p><strong>Loại vé:</strong> {ticketType}</p>
        <p><strong>Giá vé:</strong> {ticketPrice.toLocaleString()} VND</p>
      </div>
      
      <div className="booking-form">
        <h3>Thông tin hành khách</h3>

        <div className="form-group">
          <Input
            type="text"
            placeholder="Họ và Tên"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

          <div className="form-group">
          <Input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>


        <div className="form-group quantity-group">
            <label>Số lượng vé:</label>
            <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                style={{width:'80px'}}
            />

        </div>

        <p><strong>Total Price:</strong> {totalPrice.toLocaleString()} VND</p>

        <Button color="success" className="mt-3" onClick={handleBooking}>Thanh Toán.</Button>
        {bookingStatus && <p className="booking-status mt-2">{bookingStatus}</p>}
      </div>

    </div>
  );
};

export default Booking;