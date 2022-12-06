import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";

const Carousel = ({children}) => {
    const settings = {
        autoplay:false,
        arrows: true,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4.5,
        slidesToScroll: 3,
    };

    return(
        <div>
            <Slider {...settings}>
                {children}
            </Slider>
        </div>
    )
}

export default Carousel