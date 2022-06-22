
import { db } from '../firebase.config'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'

import { v4 as uuidv4 } from 'uuid'
import { toast } from "react-toastify"
import styled from 'styled-components'

import Spinner from "../components/Spinner"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const CreateContainer = styled.div`
    width: 100%;
    margin-top: 140px;
`

const CreateWrapper = styled.div`
    padding: 0 25px;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`

const Createh1 = styled.h1`
    font-size: 2.2rem;
    margin-bottom: 30px;
    border-bottom: solid;

    @media screen and (max-width: 768px) {
        font-size: 1.8rem;



    }
`

const CreateForm = styled.form`
    width: 100%;
`
const CreateInputGrp = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 50px;

    label{
        font-weight: 700;
        width: 20% !important;
        font-size: 1.1rem;

        @media screen and (max-width: 880px) {
            width: 35% !important;
            font-size: 1rem;


    }

    @media screen and (max-width: 880px) {
            width: 25% !important;
            font-size: 1rem;


    }
    }
`

const CreateInputWrapper = styled.div`
    width: 70%;
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

const CreateInputButton = styled.button`
    padding: 15px 45px;
    font-size: 1rem;
    border-radius: 20px;
    background-color: ${({ active }) => active ? "#ad34eb" : "#fff"};
    border: ${({ active }) => !active && "0.5px solid #ad34eb"};
    color: ${({ active }) => active ? "#fff" : "#000"};
    cursor: pointer;

    @media screen and (max-width: 600px) {
        padding: 10px 25px;

    }
`

const CreateInputSelect = styled.select`
    background-color: #ad34eb;
    color: #fff;
    padding: 10px 15px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: 1rem;

`
const CreateInputText = styled.input`
    padding: 5px 10px;
    width: 60%;
    font-size: 1rem;
    border-bottom: 0.5px solid #ad34eb;

    @media screen and (max-width: 768px) {
        width: 100%;
    }
`

const CreateInputNumber = styled.input`
    padding: 10px 20px;
    font-size: 1rem;
    border: 0.5px solid #ad34eb;
    border-radius: 20px;
`

const CreateInputFile = styled.input`
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

const CreateInputSelectedFiles = styled.div`
    width: 60%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto;
    gap: 30px;
`

const CreateInputSelectedImageWrapper = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h3{
        margin-bottom: 10px;
        font-weight: 500;
    }
`
const CreateInputSelectedImage = styled.img`
    width: 100%;
    border-radius: 10px;

`

const CreateButton = styled.button`
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

const CreateAd = () => {

    const navigate = useNavigate()
    const auth = getAuth()
    const isMounted = useRef(true)

    const [loading, setLoading] = useState(false)
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

        const docRef = await addDoc(collection(db, "houses"), formDataCopy)
        setLoading(false)
        toast.success("House saved")
        navigate(`/house/${docRef.id}`)
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
        <CreateContainer>
            <CreateWrapper>
                <Createh1>
                    Sell or Rent Your Home
                </Createh1>
                <CreateForm onSubmit={onSubmit}>
                    <CreateInputGrp>
                        <label htmlFor="">Sell / Rent</label>
                        <CreateInputWrapper>
                            <CreateInputButton
                                active={forType === "sale"}
                                type='button'
                                id='forType'
                                value='sale'
                                onClick={onMutate}
                            >
                                Sell
                            </CreateInputButton>
                            <CreateInputButton
                                active={forType === "rent"}
                                type='button'
                                id='forType'
                                value='rent'
                                onClick={onMutate}
                            >
                                Rent
                            </CreateInputButton>
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Type</label>
                        <CreateInputWrapper>
                            <CreateInputSelect id="type" className="postForm-select" required value={type} onChange={onMutate}>
                                <option value="mansion">Mansion</option>
                                <option value="family">Family</option>
                                <option value="condo">Condo</option>
                                <option value="island">Island</option>
                                <option value="tiny-house">Tiny Houses</option>
                                <option value="tree-house">Tree Houses</option>
                            </CreateInputSelect>
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Name</label>
                        <CreateInputWrapper>
                            <CreateInputText
                                type='text'
                                id='name'
                                value={name}
                                onChange={onMutate}
                                maxLength='52'
                                minLength='10'
                                required
                            />
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Bedrooms</label>
                        <CreateInputWrapper>
                            <CreateInputNumber
                                type='number'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Bathrooms</label>
                        <CreateInputWrapper>
                            <CreateInputNumber
                                type='number'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Furnished</label>
                        <CreateInputWrapper>
                            <CreateInputButton
                                active={furnished}
                                type='button'
                                id='furnished'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </CreateInputButton>
                            <CreateInputButton
                                active={!furnished && furnished !== null}
                                type='button'
                                id='furnished'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </CreateInputButton>
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Address</label>
                        <CreateInputWrapper>
                            <CreateInputText
                                type='text'
                                id='address'
                                value={address}
                                onChange={onMutate}
                                required
                            />
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Latitude</label>
                        <CreateInputWrapper>
                            <CreateInputNumber
                                type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onMutate}
                                required
                            />
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Longitude</label>
                        <CreateInputWrapper>
                            <CreateInputNumber
                                type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onMutate}
                                required
                            />
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Offer</label>
                        <CreateInputWrapper>
                            <CreateInputButton
                                active={offer}
                                type='button'
                                id='offer'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </CreateInputButton>
                            <CreateInputButton
                                active={!offer && offer !== null}
                                type='button'
                                id='offer'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </CreateInputButton>
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    <CreateInputGrp>
                        <label htmlFor="">Regular Price</label>
                        <CreateInputWrapper>
                            <CreateInputNumber
                                type='number'
                                id='regularPrice'
                                value={regularPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required
                            />
                            {forType === 'rent' && <p>$ / Month</p>}
                        </CreateInputWrapper>
                    </CreateInputGrp>
                    {offer && (
                        <CreateInputGrp>
                            <label>Discounted Price</label>
                            <CreateInputNumber
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                        </CreateInputGrp>
                    )}
                    <CreateInputGrp>
                        <label>Images</label>
                        <CreateInputFile
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max={6}
                            accept='.jpg,.png,.jpeg'
                            multiple
                            required
                        />
                        <CreateInputSelectedFiles>
                            {images.length > 6 ? <p>Max 6 images</p> : <>{Array.from(images)
                                .map(file => (
                                    <CreateInputSelectedImageWrapper key={file.name + uuidv4()}>
                                        <h3>{file.name}</h3>
                                        <CreateInputSelectedImage src={file && URL.createObjectURL(file)} />
                                    </CreateInputSelectedImageWrapper>
                                ))}</>}
                        </CreateInputSelectedFiles>
                    </CreateInputGrp>
                    <CreateButton type="submit">Create Ad</CreateButton>
                </CreateForm>
            </CreateWrapper>
        </CreateContainer>
    )
}

export default CreateAd