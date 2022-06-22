
import { BiRightArrowAlt } from "react-icons/bi"
import { BiLeftArrowAlt } from "react-icons/bi"

import styled from 'styled-components';

import { useState, useRef, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";


const SliderContainer = styled.section`
    width: 100% !important;
    height: 100vh !important;
    max-height:1100px;
    position: relative;
    overflow: hidden;
`

const SliderWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden !important;


`

const SlideWrapper = styled.div`
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden !important;


`
const Slide = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 992px) {
        justify-content: flex-start;

    }

&::before{
    content: "";
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100vh;
    bottom: 0vh;
    left: 0;
    overflow: hidden !important;
    opacity: 0.4;
    background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%);

}
`

const SlideImg = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
`

const SlideContent = styled.div`
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: 40%;
    color: #fff;

    @media screen and (max-width: 992px) {
        width: 80%;
        padding-left: 120px;
    }

    @media screen and (max-width: 768px) {
        width: 90%;
        padding-left: 30px;
    }

h1{
    font-size: 1.6rem;
    font-weight: 600;
    text-transform: uppercase;
    text-shadow:  0px, 20px, 0px, rgba(0, 0, 0, 0.4);
    text-align: left;
    margin-bottom: 0.4rem;

    @media screen and (max-width: 478px) {
        font-size: 1.3rem;
    }
}

h2{
    font-size: 1.4rem;
    font-weight: 400;
    text-shadow:  0px, 20px, 0px, rgba(0, 0, 0, 0.4);
    text-align: left;
    margin-bottom: 0.4rem;

    @media screen and (max-width: 478px) {
        font-size: 1.1rem;
    }
}
p{
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
    text-shadow:  0px, 20px, 0px, rgba(0, 0, 0, 0.4);

    @media screen and (max-width: 478px) {
        font-size: 0.9rem;
    }
}
`

const ViewButton = styled(Link)`

    padding: 10px 25px;
    width: 30%;
    text-align: center;
    background-color: #ad34eb;
    color: #fff;
    border-radius: 20px;
    cursor: pointer;

    @media screen and (max-width: 1200px) {
        width: 40%;
    }

    @media screen and (max-width: 478px) {
        width: 60%;
    }

    @media screen and (max-width: 284px) {
        width: 80%;
    }
`

const SliderButtons = styled.div`
    position: absolute;
    bottom: 50px;
    right: 50px;
    display: flex;
    z-index: 10;
`

const PrevArrow = styled(BiRightArrowAlt)`
    width: 50px;
    height: 50px;
    color: #fff;
    cursor: pointer;
    background: #ad34eb;
    border-radius: 50px;
    padding: 10px;
    margin-right: 1rem;
    user-select: none;
    transform: 0.3s;


    &:hover{
        background: #cd853f;
        transform: scale(1.05);
    }

`

const NextArrow = styled(BiLeftArrowAlt)`
    width: 50px;
    height: 50px;
    color: #fff;
    cursor: pointer;
    background: #ad34eb;
    border-radius: 50px;
    padding: 10px;
    margin-right: 1rem;
    user-select: none;
    transform: 0.3s;

    &:hover{
        background: #cd853f;
        transform: scale(1.05);
    }
`


const Slider = ({ houses, imgUrls }) => {

    const location = useLocation().pathname
    const params = useParams()

    const [current, setCurrent] = useState(0)
    const [sliderImages, setSliderImages] = useState(null)
    const length = houses?.length || imgUrls?.length
    const timeout = useRef(null)


    useEffect(() => {
        if (houses) {
            setSliderImages(houses)
        }
        else {
            setSliderImages(imgUrls)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const nextSlide = () => {
            setCurrent(current => current === length - 1 ? 0 : current + 1)
        }
        timeout.current = setTimeout(nextSlide, 3000)

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current)
            }
        }
    }, [current, length])

    const nextSlide = () => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
        setCurrent(current === length - 1 ? 0 : current + 1)
    }
    const prevSlide = () => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
        setCurrent(current === 0 ? length - 1 : current - 1)

    }

    if (!Array.isArray(sliderImages) || sliderImages.length <= 0) {
        return null
    }

    return (
        <SliderContainer>
            {location === "/" || params.typeName || params.forType ?
                <SliderWrapper>
                    {houses?.map(({ data, id }, index) => {
                        return (
                            <SlideWrapper key={id}>
                                {index === current && (
                                    <Slide>
                                        <SlideImg src={data?.imgUrls[0]} alt={data.alt} />
                                        <SlideContent>
                                            <h1>{data.name}</h1>
                                            <h2>{data.location}</h2>
                                            <p>${data.offer
                                                ? data.discountedPrice
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                : data.regularPrice
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                            <ViewButton to={`/house/${id}`}>View Home</ViewButton>
                                        </SlideContent>
                                    </Slide>
                                )}
                            </SlideWrapper>
                        )
                    })}
                    <SliderButtons>
                        <NextArrow onClick={prevSlide} />
                        <PrevArrow onClick={nextSlide} />
                    </SliderButtons>
                </SliderWrapper>
                : <SliderWrapper>
                    {imgUrls?.map((img, index) =>
                    (
                        <SlideWrapper key={index}>
                            {index === current && (
                                <Slide>
                                    <SlideImg src={img} alt={img} />
                                </Slide>
                            )}
                        </SlideWrapper>
                    )
                    )}
                    <SliderButtons>
                        <NextArrow onClick={prevSlide} />
                        <PrevArrow onClick={nextSlide} />
                    </SliderButtons>
                </SliderWrapper>
            }
        </SliderContainer>
    )
}

export default Slider