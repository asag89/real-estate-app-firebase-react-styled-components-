

import { useState, useEffect, useRef } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import {
    doc,
    updateDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase.config'

import Spinner from "../components/Spinner"
import { useNavigate, useParams } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { toast } from "react-toastify"

import styled from 'styled-components'






const EditContainer = styled.div`
    width: 100%;
    margin-top: 140px;
`

const EditWrapper = styled.div`
    padding: 0 25px;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`

const Edith1 = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 30px;
    border-bottom: solid;
`

const EditForm = styled.form`
    width: 100%;
`
const EditInputGrp = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 50px;

    label{
        font-weight: 700;
        width: 20% !important;
        font-size: 1.1rem;
    }
`

const EditInputWrapper = styled.div`
    width: 100%;
    margin-left: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;

    p{
        font-weight: 700;
        font-size: 1.1rem;
    }
`

const EditInputButton = styled.button`
    padding: 15px 45px;
    font-size: 1rem;
    border-radius: 20px;
    background-color: ${({ active }) => active ? "#ad34eb" : "#fff"};
    border: ${({ active }) => !active && "0.5px solid #ad34eb"};
    color: ${({ active }) => active ? "#fff" : "#000"};
    cursor: pointer;
`

const EditInputSelect = styled.select`
    background-color: #ad34eb;
    color: #fff;
    padding: 10px 15px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: 1rem;

`
const EditInputText = styled.input`
    padding: 5px 10px;
    width: 60%;
    font-size: 1rem;
    border-bottom: 0.5px solid #ad34eb;
`

const EditInputNumber = styled.input`
    padding: 10px 20px;
    font-size: 1rem;
    border: 0.5px solid #ad34eb;
    border-radius: 20px;
`

const EditInputFile = styled.input`
    width: 175px;
 
    &::-webkit-file-upload-button{
        background-color: #ad34eb;
        border: none;
        outline: none;
        color: #ffffff;
        font-weight: 600;
        text-align: center;
        padding: 15px 35px;
        font-size: 1rem;
        border-radius: 20px;
 }
`

const EditInputSelectedFiles = styled.div`
    width: 60%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto;
    gap: 30px;
`

const EditInputSelectedImageWrapper = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h3{
        margin-bottom: 10px;
        font-weight: 500;
    }
`
const EditInputSelectedImage = styled.img`
    width: 100%;
    border-radius: 10px;

`

const EditButton = styled.button`
    font-weight: 600;
    font-size:  1.1rem;
    width: 100%;
    margin: 60px auto 120px;
    padding: 15px 45px;
    font-size: 1rem;
    border-radius: 20px;
    background-color: #ad34eb;
    color: #fff;
    cursor: pointer;
`

const EditAd = () => {

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()
    const isMounted = useRef(true)

    // eslint-disable-next-line
    const [geolocationEnabled, setGeolocationEnabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [house, setHouse] = useState(false)
    const [formData, setFormData] = useState({
        forType: "sale",
        type: "",
        name: "",
        address: "",
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const {
        forType,
        type,
        name,
        address,
        bedrooms,
        bathrooms,
        furnished,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData

    // Redirect if house is not user's
    useEffect(() => {
        if (house && house.userRef !== auth.currentUser.uid) {
            toast.error("You can not edit that house")
            navigate("/")
        }
    })

    // Fetch house to edit
    useEffect(() => {
        setLoading(true)
        const fetchHouse = async () => {
            const docRef = doc(db, "houses", params.houseId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setHouse(docSnap.data())
                setFormData({ ...docSnap.data(), address: docSnap.data().location })
                setLoading(false)
            }
            else {
                navigate("/")
                toast.error("House does not exist")
            }
        }

        fetchHouse()
    }, [params.houseId, navigate])


    // Sets userRef to logged in user
    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                }
                else {
                    navigate("/sign-in")
                }
            })
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])


    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error("Discounted price needs to be less than regular price")
            return
        }

        if (images.length > 6) {
            setLoading(false)
            toast.error("Max 6 images")
            return
        }

        // Store image in firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {

                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused')
                                break
                            case 'running':
                                console.log('Upload is running')
                                break
                            default:
                                break
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        })
                    }
                )
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            latitude,
            longitude,
            timestamp: serverTimestamp()
        }

        formDataCopy.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        // Update house
        const docRef = doc(db, "houses", params.houseId)
        await updateDoc(docRef, formDataCopy)
        setLoading(false)
        toast.success("House saved")
        navigate(`/`)
    }

    const onMutate = (e) => {
        let boolean = null

        if (e.target.value === "true") {
            boolean = true
        }

        if (e.target.value === "false") {
            boolean = false
        }

        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <EditContainer>
            <EditWrapper>
                <Edith1>
                    Sell or Rent Your Home
                </Edith1>
                <EditForm onSubmit={onSubmit}>
                    <EditInputGrp>
                        <label htmlFor="">Sell / Rent</label>
                        <EditInputWrapper>
                            <EditInputButton
                                active={forType === "sale"}
                                type='button'
                                id='forType'
                                value='sale'
                                onClick={onMutate}
                            >
                                Sell
                            </EditInputButton>
                            <EditInputButton
                                active={forType === "rent"}
                                type='button'
                                id='forType'
                                value='rent'
                                onClick={onMutate}
                            >
                                Rent
                            </EditInputButton>
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Type</label>
                        <EditInputWrapper>
                            <EditInputSelect id="type" className="postForm-select" value={type} onChange={onMutate}>
                                <option className="postForm-option" value="Villa">Villa</option>
                                <option className="postForm-option" value="Mansion">Mansion</option>
                                <option className="postForm-option" value="Tiny Houses">Tiny Houses</option>
                                <option className="postForm-option" value="Condo">Condo</option>
                                <option className="postForm-option" value="Tree Houses">Tree Houses</option>
                            </EditInputSelect>
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Name</label>
                        <EditInputWrapper>
                            <EditInputText
                                type='text'
                                id='name'
                                value={name}
                                onChange={onMutate}
                                maxLength='32'
                                minLength='10'
                                required
                            />
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Bedrooms</label>
                        <EditInputWrapper>
                            <EditInputNumber
                                type='number'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Bathrooms</label>
                        <EditInputWrapper>
                            <EditInputNumber
                                type='number'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Furnished</label>
                        <EditInputWrapper>
                            <EditInputButton
                                active={furnished}
                                type='button'
                                id='furnished'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </EditInputButton>
                            <EditInputButton
                                active={!furnished && furnished !== null}
                                type='button'
                                id='furnished'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </EditInputButton>
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Address</label>
                        <EditInputWrapper>
                            <EditInputText
                                type='text'
                                id='address'
                                value={address}
                                onChange={onMutate}
                                required
                            />
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Latitude</label>
                        <EditInputWrapper>
                            <EditInputNumber
                                type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onMutate}
                                required
                            />
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Longitude</label>
                        <EditInputWrapper>
                            <EditInputNumber
                                type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onMutate}
                                required
                            />
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Offer</label>
                        <EditInputWrapper>
                            <EditInputButton
                                active={offer}
                                type='button'
                                id='offer'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </EditInputButton>
                            <EditInputButton
                                active={!offer && offer !== null}
                                type='button'
                                id='offer'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </EditInputButton>
                        </EditInputWrapper>
                    </EditInputGrp>
                    <EditInputGrp>
                        <label htmlFor="">Regular Price</label>
                        <EditInputWrapper>
                            <EditInputNumber
                                type='number'
                                id='regularPrice'
                                value={regularPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required
                            />
                            {forType === 'rent' && <p>$ / Month</p>}
                        </EditInputWrapper>
                    </EditInputGrp>
                    {offer && (
                        <EditInputGrp>
                            <label>Discounted Price</label>
                            <EditInputNumber
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                        </EditInputGrp>
                    )}
                    <EditInputGrp>
                        <label>Images</label>
                        <EditInputFile
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max={6}
                            accept='.jpg,.png,.jpeg'
                            multiple

                        />
                        <EditInputSelectedFiles>
                            {images && <>{Array.from(images)
                                .map(file => (
                                    <EditInputSelectedImageWrapper key={file.name + uuidv4()}>
                                        <h3>{file.name}</h3>
                                        <EditInputSelectedImage src={file && URL.createObjectURL(file)} />
                                    </EditInputSelectedImageWrapper>
                                ))}</>}
                        </EditInputSelectedFiles>
                    </EditInputGrp>
                    <EditButton type="submit">Edit Ad</EditButton>
                </EditForm>
            </EditWrapper>
        </EditContainer>
    )
}

export default EditAd