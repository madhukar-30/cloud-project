'use client';

import Loader from '@/components/Loader'
import Login from '@/components/Login'
import Navbar from '@/components/Navbar'
import { UserContext } from '@/context/userContext'
import { CheckCircleIcon, CopyIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

const ProfilePage = () => {
    const { loading, authenticated, setNavTracker, userData } = useContext(UserContext);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        setNavTracker('profile');
    }, [setNavTracker]);

    const handleCopy = async (url: string, index: number) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedIndex(index);
            setTimeout(() => {
                setCopiedIndex(null);
            }, 4000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

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

                                <div className='w-full h-auto flex flex-row gap-6 mt-10'>
                                    {userData?.files.length === 0 ? (
                                        <p>No files uploaded yet.</p>
                                    ) : (
                                        userData?.files.map((file: any, index: any) => (
                                            <div key={index} className="border border-white shadow text-base flex flex-col gap-5 relative overflow-hidden">
                                                <Image src={file} alt='' width={300} height={300} className='w-96 h-64 object-cover relative' />
                                                <div className='text-black bg-white font-medium absolute bottom-0 left-0 w-96 flex flex-row'>
                                                    <Link href={file} target="_blank" rel="noopener noreferrer" className="w-full px-2 py-2 text-nowrap">
                                                        {file}
                                                    </Link>
                                                    <div
                                                        className='bg-white shadow absolute bottom-0 right-0 py-2 px-2 cursor-pointer hover:bg-gray-100 transition-colors'
                                                        onClick={() => handleCopy(file, index)}
                                                    >
                                                        {copiedIndex === index ? <CheckCircleIcon className="text-green-600" /> : <CopyIcon />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

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