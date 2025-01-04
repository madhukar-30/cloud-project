'use client';

import Navbar from '@/components/Navbar'
import { UserContext } from '@/context/userContext'
import Head from 'next/head';
import React, { useContext, useEffect } from 'react'

const AboutPage = () => {
    const { setNavTracker } = useContext(UserContext);

    useEffect(() => {
        setNavTracker('about');
    }, [setNavTracker]);

    return (
        <React.Fragment>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/ico" sizes="70x70" />
                <title>Manas Cloud</title>
            </Head>

            <div className='w-full md:h-screen h-full min-h-screen flex flex-col items-center bg-black p-5 relative'>

                <div className='flex flex-col w-full min-h-full my-auto justify-start rounded-2xl bg-[#E6E4D5] shadow-md'>

                    <div className='flex flex-col h-full w-full items-center'>

                        <Navbar />

                        <div className='flex flex-col w-full md:px-28 px-10 h-auto items-center justify-center mt-10'>
                            <div className='md:text-8xl text-4xl font-black uppercase'>Manas Cloud Share</div>

                            <div className='w-full h-auto flex flex-col gap-6 mt-10 text-center text-xl font-semibold'>
                                <div>
                                    Welcome to Manas Cloud – the simplest way to share files with anyone, anytime! Built with a focus on convenience and security, our platform allows users to upload files and instantly generate a shareable link. Whether it’s a PNG, JPG, PDF, or SVG, you can seamlessly share your files with friends, colleagues, or anyone else.
                                </div>

                                <div>
                                    Created by Manas Madhukar, a B.Tech student from Galgotias University, this platform is designed to make file sharing quick, reliable, and hassle-free. Our mission is to simplify digital collaboration and ensure a seamless experience for everyone.
                                </div>

                                <div className='text-2xl font-bold'>
                                    Your files, your control – just upload, share, and connect!
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default AboutPage