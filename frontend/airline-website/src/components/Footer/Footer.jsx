import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css'; // Import the CSS file

function Footer() {
  return (
    <footer className="footer">
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.4.0/fonts/remixicon.css"
        rel="stylesheet"
      />
      <div className="section__container footer__container">
        <div className="footer__col">
          <i className="ri-plane-fill"></i> {/* Added an icon */}
          <h3>QAirline</h3>
          <p>
            Nơi sự xuất sắc bay cao. Với cam kết mạnh mẽ về sự hài lòng của khách
            hàng và niềm đam mê du lịch hàng không, QAirline cung cấp dịch vụ
            đặc biệt và hành trình liền mạch. Từ những nụ cười thân thiện đến máy
            bay hiện đại, chúng tôi kết nối thế giới, đảm bảo những trải nghiệm
            an toàn, thoải mái và khó quên.
          </p>
        </div>
        <div className="footer__col">
          <h4>THÔNG TIN</h4>
          <p><Link to="/home">Trang chủ</Link></p>
          <p><Link to="/about">Giới thiệu </Link></p>
          <p><Link to="/flight">Chuyến bay</Link></p>
          <p><Link to="/promotion">Khuyến mãi</Link></p>
          <p><Link to="/order">Đặt vé</Link></p>
        </div>
        <div className="footer__col">
          <h4>Liên hệ chúng tôi</h4>
          <p>
            <i className="ri-phone-fill"></i> 0377895795
          </p>
          <p>
            <i className="ri-mail-fill"></i> Qairline@gmail.com
          </p>
          <p>
            <i className="ri-map-pin-fill"></i> 144 Xuân Thuỷ, Cầu Giấy, Hà Nội.
          </p>
          <p>
          <i className="ri-link"></i> <a href="https://www.qairline.com/" target="_blank" rel="noopener noreferrer">https://www.qairline.com/</a>
            
          </p>
        </div>
      </div>
      <div className="section__container footer__bar">
        <div className="socials">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><span><i className="ri-facebook-fill"></i></span></a>
          <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer"> <span><i className="ri-twitter-fill"></i></span></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><span><i className="ri-instagram-line"></i></span></a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"><span><i className="ri-youtube-fill"></i></span></a>
        </div>
         <p className="copyright">© {new Date().getFullYear()} QAirline. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;