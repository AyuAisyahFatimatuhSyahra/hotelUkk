import React from 'react'
import Head from 'next/head'

import Navbar from '@/components/Common/Navbar/Navbar'
import Footer from '@/components/Common/Footer'
import TopSection from './components/TopSection'
import AboutSection from './components/About'
import ContainerSearchRoom from '../SearchRoom/SearchRoom'


function ContainerHome() {
    return (
        <>
            <Head>
                <title>Wikusama Hotel</title>
            </Head>

            <Navbar />

            <main className="pt-10">
                 <TopSection /> 
                <ContainerSearchRoom/>
                <AboutSection />
            </main>

            <Footer />
        </>
    )
}

export default ContainerHome