
import styled from 'styled-components'
import { getAuth } from "firebase/auth"
import { Link } from "react-router-dom"

const DropdownContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 70%;
    z-index: 2000;
    background: #ad34eb;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    transition: .4s ease-in-out;
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
    overflow: hidden !important;
    top: ${({ isOpen }) => (isOpen ? "1" : "-100%")};
`

const DropdownWrapper = styled.div`
    margin-top: 50px;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 0.5px solid #fff;
    color: #fff;
    border-radius: 20px;
`

const MenuItem = styled(Link)`
    width: 100%;
    padding: 25px 0;
    text-align: center;
    border-radius: 20px;

    &:hover{
        background-color: #871ebc;
    }
`
const Dropdown = ({ isOpen, toggle }) => {

    const auth = getAuth()
    const logOut = () => {
        auth.signOut()
    }

    return (
        <DropdownContainer isOpen={isOpen} onClick={toggle}>
            <DropdownWrapper>
                <MenuItem to={"/"}>About</MenuItem>
                <MenuItem to={auth ? "/profile" : "/sign-up"}>{auth ? "Profile" : "Explore"}</MenuItem>
                <MenuItem to={"/sign-in"} onClick={logOut}>{auth ? "LogOut" : "Sign In"}</MenuItem>
            </DropdownWrapper>

        </DropdownContainer>
    )
}

export default Dropdown