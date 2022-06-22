
import styled from "styled-components"
import { Link } from "react-router-dom"

const CategoryContainer = styled.div`
    margin-bottom: 60px;
    width: 100%;
    height: 60px;
    color: #fff;
    background-color: #ad34eb;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;

    @media screen and (max-width: 992px) {
        padding: 0 10px;
        height: auto;
        padding: 20px;

    }

    @media screen and (max-width: 600px) {
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;

    }
`

const CategoryItem = styled.div`
    display: flex;
    align-items: center;
`

const Categorylink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 5px 15px;
    border: 0.5px solid #fff;
    border-radius: 10px;

    @media screen and (max-width: 992px) {
        padding: 3px;
        font-size: .9rem;
    }

    &:hover{
        background-color: #721d9c;
    }
`

const Category = () => {
    return (
        <CategoryContainer>
            <CategoryItem>
                <Categorylink to={"/type/mansion"}>Mansion</Categorylink>
            </CategoryItem>
            <CategoryItem>
                <Categorylink to={"/type/family"}>Family</Categorylink>
            </CategoryItem>
            <CategoryItem>
                <Categorylink to={"/type/condo"}>Condo</Categorylink>
            </CategoryItem>
            <CategoryItem>
                <Categorylink to={"/type/island"}>Island</Categorylink>
            </CategoryItem>
            <CategoryItem>
                <Categorylink to={"/type/tiny-house"}>Tiny House</Categorylink>
            </CategoryItem>
            <CategoryItem>
                <Categorylink to={"/type/tree-house"}>Tree House</Categorylink>
            </CategoryItem>
        </CategoryContainer>
    )
}

export default Category