
import styled from "styled-components"
import HouseItem from "./HouseItem"

const HouseItemsContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    gap: 56px;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 110px;

    @media screen and (max-width: 1200px) {
        justify-content: center;
    }

    @media screen and (max-width: 768px) {
        gap: 30px;


    }


`

const HouseItems = ({ houses }) => {

    return (
        <HouseItemsContainer>
            {houses.map(({ data, id }) => (
                <HouseItem key={id} house={data} id={id} />
            ))}
        </HouseItemsContainer>
    )
}

export default HouseItems