
import styled from "styled-components"
import { useState } from "react"
import { AiOutlineCopyrightCircle } from "react-icons/ai"
import { Link } from "react-router-dom"

const FooterContainer = styled.footer`
    display: ${({ active }) => active ? "block" : "none"};
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100% !important;
    height: 40px;
    background-color: #fff;
    transition: .3s ease-in;
    -webkit-box-shadow: 1px -2px 11px -6px #000000; 
    box-shadow: 1px -2px 11px -6px #000000;
    z-index: 1000;
`

const FooterWrapper = styled.div`
    padding: 0 25px;
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    font-size: .9rem;
    color: #555;
`

const FooterCopyright = styled(AiOutlineCopyrightCircle)`
    margin-right: 10px;
`

const FooterYear = styled.span`
    margin-right: 10px;
`
const FooterLink = styled(Link)`
    margin-right: 10px;
`

const Footer = () => {

    const year = new Date()
    const [footer, setFooter] = useState(false)

    const changeBackground = () => {
        if (window.scrollY >= 600) {
            setFooter(true)
        }
        else {
            setFooter(false)
        }
    }

    window.addEventListener("scroll", changeBackground)


    return (
        <FooterContainer active={footer}>
            <FooterWrapper>
                <FooterCopyright />
                <FooterYear>{year.getFullYear()} Ankrom, Inc.</FooterYear>
                <FooterLink to={"/"}>- Security</FooterLink>
                <FooterLink to={"/"}>- About</FooterLink>
                <FooterLink to={"/"}>- Contact</FooterLink>

            </FooterWrapper>
        </FooterContainer>
    )
}

export default Footer