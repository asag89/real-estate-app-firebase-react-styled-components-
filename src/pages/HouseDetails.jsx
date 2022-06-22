
import Spinner from "../components/Spinner"
import Slider from "../components/Slider"

import { BsFillShareFill } from "react-icons/bs"
import { GiCheckMark } from "react-icons/gi"
import { IoIosBed } from "react-icons/io"
import { MdBathtub } from "react-icons/md"

import { getDoc, doc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../firebase.config"

import styled from "styled-components"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

const HouseDetailsContainer = styled.div`
    width: 100%;
    height: auto;
`
const HouseDetailsWrapper = styled.div`
    padding: 0 25px;
    max-width: 1200px;
    margin: 60px auto 120px;
    display: flex;
    flex-direction: column;
`

const HouseDetailsTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #3a3a3a;
    border-radius: 20px;
    color: #fff;
    padding: 10px 25px;
    margin-bottom: 10px;
`

const HouseDetailsName = styled.h1`
    font-size: 1.6rem;

    @media screen and (max-width: 768px) {
        font-size: 1.3rem;
    }
`

const HouseDetailShareLink = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: ${({ copied }) => copied ? "#ad34eb" : "#fff"};
    color: ${({ copied }) => copied ? "#fff" : "#3a3a3a"};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &{
        fill: #000;
        font-size: 1.2rem;
    }

    &:hover{
    color: ${({ copied }) => !copied && "#000"};
    }
`

const HouseDetailsAddress = styled.p`
    font-size: 1.4rem;
    color: #878787;
    font-weight: 900;
    margin-bottom: 20px;
    padding-left: 25px;

    @media screen and (max-width: 768px) {
        font-size: 1rem;
    }
`

const HouseDetailsPriceWrapper = styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-left: 25px;
    margin-bottom: 25px;
`

const HouseDetailsPrice = styled.p`
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ color }) => color};

    @media screen and (max-width: 768px) {
        font-size: 1rem;
    }
`


const HouseDetailsRoomsWrapper = styled.div`
    padding-left: 25px;
    font-size: 1.2rem;
    margin-bottom: 15px;

    div{
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 10px;
    }
`

const HouseDetailsInfo = styled.div`
    padding-left: 25px;
    margin-bottom: 30px;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 20px;

    a{
        color: #fff;
        font-size: .8rem;
        border-radius: 20px;
        padding: 5px 20px;

        @media screen and (max-width: 600px) {
        font-size: 0.7rem;
        padding: 5px 10px !important;
    }
    }
`

const HouseDetailsFor = styled(Link)`
    background-color: #000;
    text-transform: capitalize;

`

const HouseDetailsType = styled(Link)`
    background-color: #ad34eb;
    text-transform: capitalize;
`

const HouseDetailsOffer = styled(Link)`
    background-color: #842b2b;
`

const HouseDetailsFurnished = styled(Link)`
    background-color: #006321;
`

const HouseDetailsContactWrapper = styled.div`
    padding-left: 25px;
`

const HouseDetailsContact = styled(Link)`
    background-color: #ad34eb;
    width: 160px;
    text-align: center;
    color: #fff;
    font-size: 1rem;
    padding: 5px 25px;
    border-radius: 20px;
`

const HouseDetailsLocation = styled.div`
    margin-top: 40px;
    padding-left: 25px;

    h2{
        font-size: 1.6rem;
        padding-bottom: 15px;
    }
`

const ProfileHouseItemMapContainer = styled.div`
    width: 100%;
    height: auto;
    z-index: -20;
`

const ProfileHouseItemMap = styled.div`
    width: 100%;
    height: 400px;
    overflow: hidden;
`

const HouseDetails = () => {

    const [house, setHouse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchHouse = async () => {
            const docRef = doc(db, "houses", params.houseId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setHouse(docSnap.data())
                setLoading(false)
            }
        }
        fetchHouse()
    }, [navigate, params.houseId])

    if (loading) {
        return <Spinner />
    }

    return (
        <HouseDetailsContainer>
            {house &&
                <Slider imgUrls={house.imgUrls} />}
            <HouseDetailsWrapper>
                <HouseDetailsTop>
                    <HouseDetailsName>{house?.name}</HouseDetailsName>
                    <HouseDetailShareLink copied={shareLinkCopied} title={shareLinkCopied ? "Link Copied" : "Copy the Link"} onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setShareLinkCopied(true)
                        setTimeout(() => {
                            setShareLinkCopied(false)
                        }, 4000)
                    }}>
                        {!shareLinkCopied ?
                            <BsFillShareFill /> :
                            <GiCheckMark />
                        }
                    </HouseDetailShareLink>
                </HouseDetailsTop>
                <HouseDetailsAddress>{house?.location}</HouseDetailsAddress>
                <HouseDetailsPriceWrapper>
                    <HouseDetailsPrice color="#000">
                        {!house?.discountedPrice ? "Price: $" : "Regular Price: $"}{house?.regularPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </HouseDetailsPrice>
                    {house?.offer &&
                        <HouseDetailsPrice color="#c30707">Discount: ${house?.regularPrice - house?.discountedPrice}</HouseDetailsPrice>
                    }
                    {house?.offer && <HouseDetailsPrice color="#ad34eb">Discounted Price:  ${house?.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }</HouseDetailsPrice>}
                </HouseDetailsPriceWrapper>
                <HouseDetailsRoomsWrapper>
                    <div>
                        <IoIosBed /> {house?.bedrooms > 1
                            ? `${house?.bedrooms} Bedrooms`
                            : "1 Bedroom"}
                    </div>
                    <div>
                        <MdBathtub /> {house?.bathrooms > 1
                            ? `${house?.bathrooms} Bathrooms`
                            : "1 Bathroom"}
                    </div>
                </HouseDetailsRoomsWrapper>
                <HouseDetailsInfo>
                    <HouseDetailsFor to={`/for-${house?.forType}`}>For {house?.forType}</HouseDetailsFor>
                    <HouseDetailsType to={`/type/${house?.type}`}>{house?.type}</HouseDetailsType>
                    {house?.offer &&
                        <HouseDetailsOffer to={"/"}>Offer</HouseDetailsOffer>
                    }
                    {house?.furnished &&
                        <HouseDetailsFurnished to={"/"}>Furnished</HouseDetailsFurnished>
                    }
                </HouseDetailsInfo>
                {auth?.currentUser?.uid !== house?.userRef && (
                    <HouseDetailsContactWrapper>
                        <HouseDetailsContact to={`/contact/${house?.userRef}?listingName=${house?.name}`} className="primaryButton">
                            Contact Agent
                        </HouseDetailsContact>
                    </HouseDetailsContactWrapper>)}
                <HouseDetailsLocation>
                    <h2>Location</h2>
                    {(house?.latitude && house?.longitude) &&
                        <ProfileHouseItemMapContainer>
                            <ProfileHouseItemMap>
                                <MapContainer style={{ height: "100%", width: "100%" }} center={[house.latitude, house.longitude]} zoom={13} scrollWheelZoom={false}>
                                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />
                                    <Marker position={[house.latitude, house.longitude]}>
                                        <Popup>{house.location}</Popup>
                                    </Marker>
                                </MapContainer>
                            </ProfileHouseItemMap>
                        </ProfileHouseItemMapContainer>
                    }
                </HouseDetailsLocation>
            </HouseDetailsWrapper>
        </HouseDetailsContainer>
    )
}

export default HouseDetails