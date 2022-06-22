
import Slider from '../components/Slider'
import Category from '../components/Category'
import HouseItems from '../components/HouseItems'
import Spinner from "../components/Spinner"

import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"

import styled from 'styled-components'

import { useState, useEffect } from "react"

const HomeContainer = styled.div`
    width: 100%;
`

const HomeWrapper = styled.div`
    padding: 0 25px;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
`

const Home = () => {

    const [loading, setLoading] = useState(true)
    const [houses, setHouses] = useState(null)

    useEffect(() => {

        const fetchHouses = async () => {
            const housesRef = collection(db, "houses")
            const q = query(
                housesRef,
                orderBy("timestamp", "desc"),
                limit(20))
            const querySnap = await getDocs(q)

            let houses = []

            querySnap.forEach((doc) => {
                houses.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setHouses(houses)
            setLoading(false)
        }
        fetchHouses()
    }, [])

    if (loading) {
        return <Spinner />
    }

    return (
        <HomeContainer>
            <Slider houses={houses} />
            <HomeWrapper>
                <Category />
                <HouseItems houses={houses} />
            </HomeWrapper>
        </HomeContainer>
    )
}

export default Home