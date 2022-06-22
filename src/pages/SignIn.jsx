
import visibilityIcon from "../assets/svg/visibilityIcon.svg"

import { toast } from 'react-toastify'
import styled from "styled-components"
import OAuth from "../components/OAuth"

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import { useState, } from "react"
import { Link, useNavigate } from "react-router-dom"


const SignInContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2)), url("https://firebasestorage.googleapis.com/v0/b/real-estate-app-1eca0.appspot.com/o/images%2Fsx5wb1Ae3NRvLzkDtYtUW5Fl9yR2-signIn.jpg-cca3ad7c-1fdf-4f1f-9a54-7d70cc97d51c?alt=media&token=bb2db42e-9239-4374-a42f-8e582141c637");
    background-size: cover;
    background-position: center;
    object-fit: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`

const SignInForm = styled.form`
    width: 360px;
    height: 520px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`

const SignInHeader = styled.header`
margin: 30px 0 10px;
width: 100%;
text-align: center;
font-size: 2rem;
`

const SignInInputGrp = styled.div`
    width: 100%;
    padding: 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    input{
        width: 100%;
        border: .5px solid #ad34eb;
        font-size: 1rem;
        padding: 10px 15px;
        border-radius: 20px;
    }
`

const SingInPasswordWrapper = styled.div`
        width: 100%;
        font-size: 1rem;

        border-radius: 20px;
        position: relative;

        input{
            position: relative;
        }
`

const SingInVisibilityImg = styled.img`
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 4px;
    padding: 0.5rem;
`

const SignInButton = styled.button`
    width: 100%;
    background-color: #ad34eb;
    color: #fff;
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
`

const ForgetPassword = styled(Link)`
    width: 100%;
    font-size: .9rem;
    text-align: center;
`

const RedirectSignIn = styled(Link)`
    width: 100%;
    text-align: center;
    font-size: 1rem;
`

const SignUpBackIcon = styled(Link)`
    position: absolute;
    font-size: 2rem;
    top: 15px;
    right: 25px;
    font-family: 900;
`

const SignIn = () => {

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const { email, password } = formData

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            if (userCredential.user) {
                navigate('/')
                setLoading(false)
            }
        } catch (error) {
            toast.error('Bad User Credentials')
        }
        setLoading(false)
    }

    return (
        <SignInContainer>
            <SignInForm onSubmit={handleSubmit}>
                <SignInHeader>Sign In</SignInHeader>

                <SignInInputGrp>
                    <input type="email" placeholder="Email" id="email" value={email} onChange={handleChange} />
                </SignInInputGrp>


                <SignInInputGrp>
                    <SingInPasswordWrapper className='passwordInputDiv'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='passwordInput'
                            placeholder='Password'
                            id='password'
                            value={password}
                            onChange={handleChange}
                        />

                        <SingInVisibilityImg
                            src={visibilityIcon}
                            alt='show password'
                            title="Show"
                            onClick={() => setShowPassword((prevState) => !prevState)}
                        />
                    </SingInPasswordWrapper>

                </SignInInputGrp>

                <SignInInputGrp>
                    <SignInButton>{loading ? "loading..." : "Sign In"}</SignInButton>
                </SignInInputGrp>


                <OAuth />


                <SignInInputGrp>
                    <ForgetPassword to={"/"}>Did you forget your password?</ForgetPassword>
                </SignInInputGrp>

                <SignInInputGrp>
                    <RedirectSignIn to={"/sign-up"} >Sign Up Instead</RedirectSignIn>
                </SignInInputGrp>
            </SignInForm>
            <SignUpBackIcon to={"/"} >x</SignUpBackIcon>
        </SignInContainer>
    )
}

export default SignIn