
import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import GoogleIcon from "../assets/svg/googleIcon.svg"
import styled from "styled-components"

const GoggleIconContainer = styled.div`
    margin: 20px 0 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    p{
        padding-bottom: 12px;
        font-size: 1rem;

}
`
const GoggleIconWrapper = styled.div`

`
const GoggleIcon = styled.img`
    width: 30px !important;
    height: 30px !important;
    cursor: pointer;
`
const OAuth = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            //Check for user
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)

            // If user doesn't exist, create user
            if (!docSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate("/")
        }
        catch (error) {
            toast.error("Could not authorize with Google")
        }
    }
    return (
        <GoggleIconContainer>
            <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p>
            <GoggleIconWrapper onClick={onGoogleClick}>
                <GoggleIcon src={GoogleIcon} alt="google" />
            </GoggleIconWrapper>
        </GoggleIconContainer>
    )
}

export default OAuth