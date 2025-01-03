'use client';

import React, { useContext, useState } from 'react';

import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { signIn, signOut } from 'next-auth/react';
import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import { LogInIcon, LogOutIcon, Menu } from 'lucide-react';

const Navbar = () => {
    const { authenticated, navTracker } = useContext(UserContext);
    const [mobileNav, setMobileNav] = useState(false);

    return (
        <div className='w-full h-14 flex items-center justify-between'>

            {/* first half */}
            <div className='md:w-[25%] w-5/12 h-full flex items-center justify-center bg-black'>
                <div className='w-full h-full flex items-center justify-center bg-[#E6E4D5] rounded-t-2xl'>
                    <Link href='/' className='mt-3'>
                        <Image src={'/assets/manas-cloud.svg'} alt='' width={160} height={40} />
                    </Link>
                </div>
            </div>

            {/* middle one */}
            <div className='w-[50%] bg-black h-full md:flex hidden items-center justify-center gap-8 rounded-b-2xl text-white uppercase pb-2'>
                <Link href={'/'} className={navTracker === 'home' ? 'nav--active' : 'nav--links'}>Home</Link>
                <Link href={'/about'} className={navTracker === 'about' ? 'nav--active' : 'nav--links'}>About</Link>
                <Link href={'/profile'} className={navTracker === 'profile' ? 'nav--active' : 'nav--links'}>Profile</Link>
            </div>

            <div className='w-2/12 bg-black h-full md:hidden flex items-center justify-center gap-8 rounded-b-2xl text-white uppercase pb-2 relative'>
                <Menu className='cursor-pointer' onClick={() => setMobileNav(!mobileNav)} />
                <div className={`absolute top-16 rounded-2xl shadow p-5 ${mobileNav ? 'flex' : 'hidden'} items-center justify-center z-20 flex-col bg-black w-80 h-80 gap-6`}>
                    <Link href={'/'} className={navTracker === 'home' ? 'nav--active' : 'nav--links'}>Home</Link>
                    <Link href={'/about'} className={navTracker === 'about' ? 'nav--active' : 'nav--links'}>About</Link>
                    <Link href={'/profile'} className={navTracker === 'profile' ? 'nav--active' : 'nav--links'}>Profile</Link>
                </div>
            </div>

            {/* second half */}
            <div className='md:w-[25%] w-5/12 h-full flex items-center justify-center bg-black'>
                <div className='w-full h-full flex items-center justify-center bg-[#E6E4D5] rounded-t-2xl gap-2'>
                    <Link href='/' className='mt-3 border-2 border-black font-medium uppercase transition-all hover:bg-black hover:text-white rounded-full px-6 h-8 flex items-center justify-center'>
                        Reach Us
                    </Link>
                    {authenticated ? (
                        <div className='mt-3 border-2 border-black transition-all hover:bg-black hover:text-white rounded-full h-8 w-8 p-1 md:flex hidden items-center justify-center cursor-pointer' onClick={() => signOut()}>
                            <LogOutIcon />
                        </div>
                    ) : (
                        <div className='mt-3 border-2 border-black transition-all hover:bg-black hover:text-white rounded-full h-8 w-8 p-1 md:flex hidden items-center justify-center cursor-pointer' onClick={() => signIn()}>
                            <LogInIcon />
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}

export default Navbar