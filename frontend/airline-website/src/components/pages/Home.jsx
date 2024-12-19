import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext"; 
import "../../styles/home.css"
import slogan from '../../assets/image/slogan.png'
import plan1 from '../../assets/image/plan-1.png'
import plan2 from '../../assets/image/plan-2.jpeg'
import plan3 from '../../assets/image/plan-3.png'
import people1 from '../../assets/image/people1.png'
import people2 from '../../assets/image/people2.png'
import people3 from '../../assets/image/people3.png'
import people4 from '../../assets/image/people4.png'
import travel1 from '../../assets/image/4.jpg'
import travel2 from '../../assets/image/2.jpg'
import travel3 from '../../assets/image/3.jpg'
import travel4 from '../../assets/image/1.jpg'


const Home = () => {
  const { user } = useContext(AuthContext);  
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");  
  }

  return (
    <div>
      <header className="section__container header__container">
        <h1 className="section__header">Vui từng chuyến bay</h1>
        <img src={slogan} alt="header" />
      </header>
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.4.0/fonts/remixicon.css"
        rel="stylesheet"
      />
     {/* Booking Section */}
     <section className="section__container booking__container">
                <form>
          {[
            { icon: "ri-map-pin-line", label: "Vị trí", placeholder: "Bạn đang ở đâu?", type: "text" },
            { icon: "ri-map-pin-line", label: "Điểm đến", placeholder: "Thêm điểm đến", type: "text" },
            { icon: "ri-calendar-line", label: "Xuất phát", placeholder: "Thêm ngày", type: "date" },
            { icon: "ri-calendar-line", label: "Trở về", placeholder: "Thêm ngày", type: "date" },
          ].map((field, index) => (
            <div className="form__group" key={index}>
              <span>
                <i className={field.icon}></i>
              </span>
              <div className="input__content">
                <div className="input__group">
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    onInput={(e) => {
                      
                    }}
                  />
                  <label>{field.label}</label>
                </div>
                <p>{field.placeholder}</p>
              </div>
            </div>
          ))}
          <button className="btn">
            <i className="ri-search-line"></i>
          </button>
        </form>

      </section>

      <section className="section__container plan__container">
        <div className="plan__grid">
          <div className="plan__content">
            <span className="number">01</span>
            <h4>Yêu cầu du lịch đến khắp thế giới</h4>
            <p>
              Hãy cập nhật thông tin và chuẩn bị cho chuyến đi đến khắp thế giới với các yêu cầu du lịch cần thiết, đảm bảo trải nghiệm suôn sẻ và thuận lợi tại những điểm đến sôi động và quyến rũ.
            </p>
            <span className="number">02</span>
            <h4>Bảo hiểm du lịch đa rủi ro</h4>
            <p>
              Sự bảo vệ toàn diện cho sự an tâm của bạn, bao gồm nhiều rủi ro tiềm ẩn khi đi du lịch và các tình huống bất ngờ.
            </p>
            <span className="number">03</span>
            <h4>Yêu cầu du lịch theo điểm đến</h4>
            <p>
              Hãy cập nhật thông tin và lên kế hoạch cho chuyến đi của bạn một cách dễ dàng vì chúng tôi cung cấp thông tin mới nhất về các yêu cầu du lịch cụ thể cho điểm đến mong muốn của bạn.
            </p>
          </div>
          <div className="plan__image">
            <img src={plan1} alt="plan1" />
            <img src={plan2} alt="plan2" />
            <img src={plan3} alt="plan3" />
          </div>
        </div>
      </section>

      <section className="memories">
        <div className="section__container memories__container">
          <div className="memories__header">
            <h2 className="section__header">
              Du lịch để tạo nên những kỷ niệm trên khắp thế giới
            </h2>
            <button className="view__all" onClick={() => navigate('/flight')} > Xem tất cả </button>
          </div>
          <div className="memories__grid">
            <div className="memories__card">
              <span><i className="ri-calendar-2-line"></i></span>
              <h4>Đặt vé và thư giãn</h4>
              <p>
                Với "Đặt phòng và thư giãn", bạn có thể ngồi lại, nghỉ ngơi và tận hưởng chuyến đi trong khi chúng tôi 
                lo mọi việc còn lại.
              </p>
            </div>
            <div className="memories__card">
              <span><i className="ri-shield-check-line"></i></span>
              <h4>Kiểm tra thông minh</h4>
              <p>
              Khám phá thông minh – giải pháp đột phá nâng tầm trải nghiệm du lịch cùng hãng hàng không của chúng tôi.
              </p>
            </div>
            <div className="memories__card">
              <span><i className="ri-bookmark-2-line"></i></span>
              <h4>Tiết kiệm nhiều hơn</h4>
              <p>
              Từ giá vé chiết khấu đến các chương trình khuyến mãi và ưu đãi độc quyền,
              chúng tôi ưu tiên khả năng chi trả mà không ảnh hưởng đến chất lượng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section__container travellers__container">
        <h2 className="section__header">Khách hàng của tháng</h2>
        <div className="travellers__grid">
          <div className="travellers__card">
            <img src={travel1} alt="traveller" />
            <div className="travellers__card__content">
              <img src={people1} alt="client" />
              <h4>Nguyễn Thị Minh Ngọc</h4>
              <p>Nha Trang</p>
            </div>
          </div>
          <div className="travellers__card">
            <img src={travel2} alt="traveller" />
            <div className="travellers__card__content">
              <img src={people2} alt="client" />
              <h4>Trần Minh Đức</h4>
              <p>Phú Yên</p>
            </div>
          </div>
          <div className="travellers__card">
            <img src={travel3} alt="traveller" />
            <div className="travellers__card__content">
              <img src={people3} alt="client" />
              <h4>Nguyễn Thị Mai</h4>
              <p>Phú Quốc</p>
            </div>
          </div>
          <div className="travellers__card">
            <img src={travel4} alt="traveller" />
            <div className="travellers__card__content">
              <img src={people4} alt="client" />
              <h4>Nguyễn Thị Hoa</h4>
              <p>Hồ Chí Minh City</p>
            </div>
          </div>
        </div>
      </section>
      {/* Quote Section */}
      <div className="quote__container">
          <p className="quote">"Vui từng chuyến bay" - Đó là lời hứa QAirline dành cho bạn</p>
        </div>     
    </div>
  );
};

export default Home;
