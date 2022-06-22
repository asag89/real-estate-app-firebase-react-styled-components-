
import styled from "styled-components"
import { MdEdit, MdDelete } from "react-icons/md"

import { Link } from "react-router-dom"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

const ProfileHouseItemContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
    padding-bottom: 30px;
    border-bottom: 0.5px solid #8e8e8e;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    height: auto;

`

const ProfileHouseItemContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @media screen and (max-width: 992px) {
        flex-direction: column;

    }
`

const ProfileHouseItemImgWrapper = styled.div`
    width: 40%;
    @media screen and (max-width: 992px) {
        width: 100%;
        
    }
`

const ProfileHouseItemImg = styled.img`
    width: 100%;
    border-radius:20px;
`

const ProfileHouseItemDesc = styled.div`
    width: 50%;
    padding: 20px;
    @media screen and (max-width: 992px) {
        width: 100%;
        
    }
`

const ProfileHouseItemName = styled.h2`
    padding-bottom: 10px;

    @media screen and (max-width: 600px) {
        font-size: 1.2rem;

    }
`

const ProfileHouseItemLocation = styled.div`
    font-weight: 500;
    padding-bottom: 20px;

`

const ProfileHouseItemPrice = styled.div`
    font-weight: 600;
    padding-bottom: 10px !important;
`

const ProfileHouseItemRooms = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    div{
        width: 120px;
        text-align: center;
        background-color: #444;
        color: #fff;
        font-weight: 500;
        font-size: .8rem;
        border-radius: 20px;
        padding: 6px 20px;

        @media screen and (max-width: 600px) {
        padding: 5px 15px !important;
        width: auto;

    }
    }
`

const ProfileHouseItemInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    a{
        color: #fff;
        font-size: .8rem;
        border-radius: 20px;
        padding: 5px 20px;

        @media screen and (max-width: 600px) {
        padding: 5px 10px;
    }
    }
`

const ProfileHouseItemFor = styled(Link)`
    background-color: #000;
    text-transform: capitalize;

`

const ProfileHouseItemType = styled(Link)`
    background-color: #ad34eb;
    text-transform: capitalize;

`

const ProfileHouseItemOffer = styled(Link)`
    background-color: #842b2b;
`

const ProfileHouseItemFurnished = styled(Link)`
    background-color: #105400;
`

const ProfileHouseItemSettings = styled.div`
    padding: 15px;
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 10px;
    
    @media screen and (max-width: 992px) {
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
        gap: 50px;
    }
`

const EditIcon = styled(MdEdit)`
    font-size: 1.5rem;
    cursor: pointer !important;
`

const DeleteIcon = styled(MdDelete)`
    font-size: 1.5rem;
    cursor: pointer;
`

const ProfileHouseItemMapContainer = styled.div`
    margin-top: 40px;
    width: 100%;
    height: auto;
    z-index: -20;



    h2{
        font-size: 1.4rem;
        padding: 0 0 25px;

        @media screen and (max-width: 600px) {
            font-size: 1.1rem;

    }
    }
`

const ProfileHouseItemMap = styled.div`
    width: 100%;
    height: 400px;
    overflow: hidden;
`

const ProfileHouseItem = ({ house, id, onEdit, onDelete }) => {

    return (
        <ProfileHouseItemContainer>
            <ProfileHouseItemContent>
                <ProfileHouseItemImgWrapper>
                    <ProfileHouseItemImg src={house.imgUrls[0]} />
                </ProfileHouseItemImgWrapper>
                <ProfileHouseItemDesc>
                    <ProfileHouseItemName>
                        {house.name}
                    </ProfileHouseItemName>
                    <ProfileHouseItemLocation>
                        {house.location}
                    </ProfileHouseItemLocation>
                    <ProfileHouseItemPrice>
                        ${house.offer
                            ? house.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : house.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {house.type === 'rent' && ' / Month'}
                    </ProfileHouseItemPrice>
                    <ProfileHouseItemRooms>
                        <div>
                            {house.bedrooms > 1
                                ? `${house.bedrooms} Bedrooms`
                                : "1 Bedroom"}
                        </div>
                        <div>
                            {house.bathrooms > 1
                                ? `${house.bathrooms} Bathrooms`
                                : "1 Bathroom"}
                        </div>
                    </ProfileHouseItemRooms>
                    <ProfileHouseItemInfo>
                        <ProfileHouseItemFor to={`/for-${house.forType}`}>For {house.forType}</ProfileHouseItemFor>
                        <ProfileHouseItemType to={`/type/${house.type}`}>{house.type}</ProfileHouseItemType>
                        {house.offer &&
                            <ProfileHouseItemOffer to={"/"}>Offer</ProfileHouseItemOffer>
                        }
                        {house.furnished &&
                            <ProfileHouseItemFurnished to={"/"}>Furnished</ProfileHouseItemFurnished>
                        }
                    </ProfileHouseItemInfo>
                </ProfileHouseItemDesc>
                <ProfileHouseItemSettings>
                    <EditIcon onClick={() => onEdit(id)} />
                    <DeleteIcon onClick={() => onDelete(house.id, house.name)} />
                </ProfileHouseItemSettings>
            </ProfileHouseItemContent>
            {(house.latitude && house.longitude) &&
                <ProfileHouseItemMapContainer>
                    <h2>Location</h2>
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
        </ProfileHouseItemContainer >
    )
}

export default ProfileHouseItem