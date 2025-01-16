'use client';

import React, { useContext, useState } from 'react';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import { LogOutIcon, MailIcon, Menu } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from './ui/button';

const Navbar = () => {
    const { authenticated, navTracker } = useContext(UserContext);
    const [mobileNav, setMobileNav] = useState(false);

    return (
        <div className='w-full h-14 flex items-center justify-between'>

            {/* first half */}
            <div className='md:w-[25%] w-5/12 h-full flex items-center justify-center bg-black'>
                <div className='w-full h-full flex items-center justify-center bg-[#E6E4D5] rounded-t-2xl'>
                    <Link href='/' className='mt-3'>
                        <Image src={'/assets/cloud-share.svg'} alt='' width={160} height={40} className='w-40 h-auto' />
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
                    {authenticated ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className='mt-3 border-2 border-black transition-all hover:bg-black hover:text-white rounded-full h-8 w-auto uppercase px-4 md:flex hidden items-center justify-center gap-2 cursor-pointer'>
                                    Sign Out
                                    <LogOutIcon />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                    <Button variant={'destructive'} onClick={() => signOut()}>LogOut</Button>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <div className='mt-3 border-2 border-black transition-all hover:bg-black hover:text-white rounded-full h-8 w-auto uppercase px-4 md:flex hidden items-center justify-center gap-2 cursor-pointer'>
                            Reach Us
                            <MailIcon />
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}

export default Navbar