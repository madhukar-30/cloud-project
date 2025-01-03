'use client';

import Navbar from '@/components/Navbar'
import { UserContext } from '@/context/userContext'
import React, { useContext, useEffect } from 'react'

const AboutPage = () => {
    const { setNavTracker } = useContext(UserContext);

    useEffect(() => {
        setNavTracker('about');
    }, [setNavTracker]);

    return (
        <React.Fragment>
            <div className='w-full md:h-screen h-full min-h-screen flex flex-col items-center bg-black p-5 relative'>

                <div className='flex flex-col w-full min-h-full my-auto justify-start rounded-2xl bg-[#E6E4D5] shadow-md'>

                    <div className='flex flex-col h-full w-full items-center'>

                        <Navbar />

                        <div className='flex flex-col w-full md:px-28 px-10 h-auto items-center justify-center mt-10'>
                            <div className='md:text-8xl text-4xl font-black uppercase'>Manas Cloud Share</div>

                            <div className='w-full h-auto flex flex-row gap-6 mt-10 text-center text-xl font-semibold'>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam, ab et quas incidunt corrupti iure exercitationem cupiditate distinctio delectus ex, adipisci totam obcaecati facere. Laborum temporibus vel praesentium neque deserunt?
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default AboutPage