
import { getAuth, updateProfile } from "firebase/auth"
import { updateDoc, doc, collection, query, where, orderBy, deleteDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

import styled from "styled-components"
import ProfileHouseItem from "../components/ProfileHouseItem"


const ProfileContainer = styled.div`
    width: 100%;
    height: auto !important;
`

const ProfileWrapper = styled.div`
    padding: 0 25px;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    height: auto;
    flex-direction: column;
    align-items: center !important;
    @media screen and (max-width: 992px) {
        width: 80%;
    }

    @media screen and (max-width: 768px) {
        width: 100%;
    }
`

const Profileh1 = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 30px;
    border-bottom: solid;
`

const ProfileAccount = styled.div`
    width: 100%;
    margin-bottom: 40px;
`

const ProfileAccountHeader = styled.div`
    width: 40%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    @media screen and (max-width: 992px) {
        width: 100%;
    }

    h2{
        font-weight: 500;
        font-size: 1.2rem;
        border-bottom: solid #ad34eb;
    }
`

const ProfileEditBtn = styled.button`
    padding: 8px 30px;
    background-color: #ad34eb;
    color: #fff;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
`

const ProfileAccountForm = styled.form`
    margin-top: 20px;
    width: 40%;

    @media screen and (max-width: 992px) {
        width: 100%;
    }

`

const ProfileInputGrp = styled.div`
    width: 100%;
    margin-bottom: 30px;

    input {
        width: 100%;
        border: .5px solid #ad34eb;
        font-size: 1rem;
        padding: 10px 15px;
        border-radius: 20px;

        &:disabled{
            color: #999;
        }
    }
`

const ProfileAds = styled.div`
    width: 100%;
    margin-bottom: 40px;

`

const ProfileAdsHeader = styled.div`
    width: 40%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    @media screen and (max-width: 992px) {
        width: 100%;
    }

    h2{
        font-weight: 500;
        font-size: 1.2rem;
        border-bottom: solid #ad34eb;
    }
`
const ProfileCreateBtn = styled(Link)`
    padding: 8px 30px;
    background-color: #ad34eb;
    color: #fff;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
`

const ProfileCurrentAds = styled.div`
    width: 100%;
    height: auto;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Profile = () => {

    const navigate = useNavigate()
    const auth = getAuth()

    const [houses, setHouses] = useState(null)
    // eslint-disable-next-line
    const { loading, setLoading } = useState(true)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const { name, email } = formData

    const [changeInfo, setChangeInfo] = useState(false)

    useEffect(() => {
        const fetchUserHouses = async () => {
            const housesRef = collection(db, "houses")
            const q = query(
                housesRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc")
            )
            const querySnap = await getDocs(q)

            let houses = []

            querySnap.forEach((doc) => {
                return houses.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setHouses(houses)
        }

        fetchUserHouses()
    }, [auth.currentUser.uid])

    const handleChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async () => {
        try {
            // email disabled
            if (auth.currentUser.displayName !== name) {
                // Update displayName in Firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                // Update in Firestore
                const userRef = doc(db, "users", auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        }
        catch (error) {
            toast.error("Could not update profile details")
        }
    }
    const onDelete = async (houseId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            await deleteDoc(doc(db, "houses", houseId))
            const updatedHouses = houses.filter((house) => {
                return house.id !== houseId
            })
            setHouses(updatedHouses)
            toast.success("Succesfully deleted house")
        }
    }

    const onEdit = (houseId) => navigate(`/edit/${houseId}`)

    return (
        <ProfileContainer>
            <ProfileWrapper>
                <Profileh1>Profile</Profileh1>
                <ProfileAccount>
                    <ProfileAccountHeader>
                        <h2>Account Details</h2>
                        <ProfileEditBtn onClick={() => {
                            changeInfo && handleSubmit()
                            setChangeInfo((prevState) => !prevState)
                        }}> {changeInfo ? "Save" : "Edit"}</ProfileEditBtn>
                    </ProfileAccountHeader>
                    <ProfileAccountForm>
                        <ProfileInputGrp>
                        </ProfileInputGrp>
                        <ProfileInputGrp>
                            <input type="text" id="name" value={name} disabled={!changeInfo} onChange={handleChange} />
                        </ProfileInputGrp>
                        <ProfileInputGrp>
                            <input type="email" id="email" value={email} disabled={!changeInfo} onChange={handleChange} />
                        </ProfileInputGrp>
                    </ProfileAccountForm>
                </ProfileAccount>
                <ProfileAds>
                    <ProfileAdsHeader>
                        <h2>Your Ads</h2>
                        <ProfileCreateBtn to={"/create-ad"}>Sell or rent your home</ProfileCreateBtn>
                    </ProfileAdsHeader>
                    <ProfileCurrentAds>
                        {!loading && houses?.length > 0 && (
                            <>
                                {houses.map((house) => (
                                    <ProfileHouseItem
                                        key={house.id}
                                        house={house.data}
                                        id={house.id}
                                        onDelete={() => onDelete(house.id)}
                                        onEdit={() => onEdit(house.id)} />
                                ))}
                            </>)}
                    </ProfileCurrentAds>
                </ProfileAds>
            </ProfileWrapper>
        </ProfileContainer>
    )
}

export default Profile