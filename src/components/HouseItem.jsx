
import styled from "styled-components"
import { IoIosHeartEmpty } from "react-icons/io"
import { Link } from "react-router-dom"

const HouseItemContainer = styled.div`
    width: 30% !important;
    height: auto;
    border-radius: 20px;
    margin-bottom: 10px;
    position: relative;

    @media screen and (max-width: 1200px) {
        width: 45% !important;
    }

    @media screen and (max-width: 768px) {
        width: 80% !important;
    }

    @media screen and (max-width: 600px) {
        width: 100% !important;
    }
`

const HouseItemImageWrapper = styled(Link)`
    width: 100%;
    width: 100%;
    height: auto;
`

const HouseItemImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 20px; 
`

const HouseItemHeart = styled(IoIosHeartEmpty)`
    font-size: 1.5rem;
    position: absolute;
    top: 15px;
    right: 15px;
`

const HouseItemContent = styled.div`
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
`

const HouseItemDesc = styled(Link)`
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
`

const HouseItemName = styled.h2`
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 10px;

    @media screen and (max-width: 600px) {
        font-size: 1rem;

    }
`

const HouseItemLocation = styled.p`
    font-size: .9rem;
    font-weight: 700;
    margin-bottom: 10px;
    font-weight: 500;
`

const HouseItemPrice = styled.span`
    font-size: 1rem;
    margin-bottom: 10px;

    @media screen and (max-width: 600px) {
        font-size: 0.9rem;

    }
`

const HouseItemInfo = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 15px;

    a{
        color: #fff;
        font-size: .8rem;
        border-radius: 20px;
        padding: 5px 20px;

        @media screen and (max-width: 600px) {
        font-size: 0.7rem;
        padding: 5px 10px;
    }
    }
`

const HouseItemFor = styled(Link)`
    background-color: #000;
    text-transform: capitalize;
`

const HouseItemType = styled(Link)`
    background-color: #ad34eb;
    text-transform: capitalize;
`

const HouseItemOffer = styled(Link)`
    background-color: #842b2b;
`

const HouseItemFurnished = styled(Link)`
    background-color: #105400;
`

const HouseItem = ({ house, id }) => {

    const houseItemHeartClick = () => {
    }
    return (
        <HouseItemContainer>
            <HouseItemImageWrapper to={`/house/${id}`}>
                <HouseItemImage src={house.imgUrls[0]} />
            </HouseItemImageWrapper>
            <HouseItemHeart fill="#fff" onClick={houseItemHeartClick} />
            <HouseItemContent>
                <HouseItemDesc to={`/house/${id}`}>
                    <HouseItemName>{house.name}</HouseItemName>
                    <HouseItemLocation>{house.location}</HouseItemLocation>
                    <HouseItemPrice>$
                        {house.offer
                            ? house.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : house.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</HouseItemPrice>
                </HouseItemDesc>
                <HouseItemInfo>
                    <HouseItemFor to={`/for-${house.forType}`}>For {house.forType}</HouseItemFor>
                    <HouseItemType to={`/type/${house.type}`}>{house.type}</HouseItemType>
                    {house.offer &&
                        <HouseItemOffer to={"/"}>Offer</HouseItemOffer>
                    }
                    {house.furnished &&
                        <HouseItemFurnished to={"/"}>Furnished</HouseItemFurnished>
                    }
                </HouseItemInfo>
            </HouseItemContent>
        </HouseItemContainer>
    )
}

export default HouseItem