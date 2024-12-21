import React from 'react';
import "../../styles/about.css";
import logo from "../../assets/image/logo.jpg";

const About = () => {
    return (
        <section className="about__background">
            <div className="about__container">
                {/* Cột hình ảnh */}
                <div className="about__image-column">
                  <div className='about__image-wrapper'>
                       <img src={logo} alt="Logo QAirline" className="about__image" />
                   </div>
                </div>

                {/* Cột nội dung */}
                <div className="about__content-column">
                    <div className="about__content">
                        <h1 className="mb-3 fw-semibold">Giới thiệu về QAirline</h1>
                        <p>
                            Chào mừng bạn đến với QAirline, nền tảng đặt chuyến bay hàng đầu dành cho những người đam mê du lịch.
                        </p>
                        <p>
                            Với sứ mệnh mang lại những trải nghiệm tuyệt vời, chúng tôi không chỉ giúp bạn tìm kiếm và đặt vé máy bay thuận tiện, mà còn mang đến những chuyến đi thú vị và dễ dàng hơn bao giờ hết.
                        </p>
                        <p>
                            QAirlines cam kết mang lại cho bạn sự tiện lợi, sự an tâm và những lựa chọn chuyến bay phong phú để mỗi hành trình trở nên đặc biệt.
                        </p>
                        <p>
                            Hãy cùng chúng tôi khám phá thế giới, tận hưởng những chuyến đi đầy niềm vui và ký ức đáng nhớ.
                        </p>
                        <p className="quote">"Vui từng chuyến bay" - Đó là lời hứa QAirline dành cho bạn</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;