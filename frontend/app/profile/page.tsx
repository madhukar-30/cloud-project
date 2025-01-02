'use client';

import Loader from '@/components/Loader'
import Login from '@/components/Login'
import Navbar from '@/components/Navbar'
import { UserContext } from '@/context/userContext'
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'

const ProfilePage = () => {
    const { loading, authenticated, setNavTracker, userData } = useContext(UserContext);

    useEffect(() => {
        setNavTracker('profile');
    }, [setNavTracker]);

    return (
        <React.Fragment>
            <div className='w-full md:h-screen h-full min-h-screen flex flex-col items-center bg-black p-5 relative'>

                {loading && <Loader />}

                <div className='flex flex-col w-full min-h-full my-auto justify-start rounded-2xl bg-[#E6E4D5] shadow-md'>

                    {authenticated ? (
                        <div className='flex flex-col h-full w-full items-center'>

                            <Navbar />

                            <div className='flex flex-col w-full md:px-28 px-10 h-auto items-center justify-center mt-10'>
                                <div className='md:text-8xl text-4xl font-black uppercase'>Manas Cloud Share</div>

                                {userData?.files.length === 0 ? (
                                    <p>No files uploaded yet.</p>
                                ) : (
                                    userData?.files.map((file: any, index: any) => (
                                        <div key={index} className="text-lg flex flex-col gap-5">
                                            <Image src={file} alt='' width={300} height={300} className='w-96 h-auto' />
                                            <Link href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                                {file}
                                            </Link>
                                        </div>
                                    ))
                                )}

                            </div>

                        </div>
                    ) : (
                        <Login />
                    )}

                </div>
            </div>
        </React.Fragment>
    )
}

export default ProfilePage