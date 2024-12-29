import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import "../../styles/about.css";
import logo from "../../assets/image/logo.jpg";

const About = () => {
    const [startTyping, setStartTyping] = useState(false);

    // Start typing after the component mounts
    useEffect(() => {
        setStartTyping(true);
    }, []);

    // TypingEffect component (inside About.jsx)
    const TypingEffect = ({ text, delay }) => {
        const [displayedText, setDisplayedText] = useState('');
        const typingSpeed = 50; // Adjust typing speed here
        const indexRef = useRef(0); // useRef to keep track of the current index
        const displayedTextRef = useRef(''); // useRef to keep track of the displayed text

        useEffect(() => {
            const timeout = setTimeout(() => {
                const typingInterval = setInterval(() => {
                    if (indexRef.current < text.length) {
                        // Update the displayedText state by appending the current character
                        displayedTextRef.current += text[indexRef.current];
                        setDisplayedText(displayedTextRef.current);
                        indexRef.current++;
                    } else {
                        clearInterval(typingInterval); // Stop typing once all characters are typed
                    }
                }, typingSpeed);
            }, delay);

            return () => clearTimeout(timeout); // Cleanup timeout on unmount
        }, [text, delay]);

        return <Typography variant="h6">{displayedText}</Typography>;
    };

    // Define the text for each paragraph
    const text1 = "Chào mừng bạn đến với QAirline, nền tảng đặt chuyến bay hàng đầu dành cho những người đam mê du lịch.";
    const text2 = "Với sứ mệnh mang lại những trải nghiệm tuyệt vời, chúng tôi không chỉ giúp bạn tìm kiếm và đặt vé máy bay thuận tiện, mà còn mang đến những chuyến đi thú vị và dễ dàng hơn bao giờ hết.";
    const text3 = "QAirlines cam kết mang lại cho bạn sự tiện lợi, sự an tâm và những lựa chọn chuyến bay phong phú để mỗi hành trình trở nên đặc biệt.";
    const text4 = "Hãy cùng chúng tôi khám phá thế giới, tận hưởng những chuyến đi đầy niềm vui và ký ức đáng nhớ.";
    const text5 = "'Vui từng chuyến bay' - Đó là lời hứa QAirline dành cho bạn";

    const textArray = [text1, text2, text3, text4, text5];

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

                        {startTyping && textArray.map((text, index) => (
                            <p key={index}>
                                <TypingEffect text={text} delay={index * 1000} />
                            </p>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
