'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className='flex flex-col w-full md:h-screen h-full md:py-0 py-24 items-center justify-center'>

            <div className='w-full h-full flex md:flex-row flex-col items-center justify-center overflow-hidden'>

                <div className='md:w-1/2 w-full h-full flex flex-col items-center justify-center text-center'>
                    {isLogin ? (
                        <div className='w-auto flex flex-col items-center justify-center'>
                            <div className='text-xl font-medium mb-6'>Login Here</div>

                            <Button type='submit' variant='default' onClick={() => { signIn("google"); }} className="w-full flex flex-row gap-2 mb-6">
                                <FaGoogle className="text-lg" />
                                Login with Google
                            </Button>

                            <div>Don't have an account? <span className='cursor-pointer transition-all hover:underline' onClick={() => setIsLogin(!isLogin)}>Register</span> here;</div>
                        </div>
                    ) : (
                        <div className='w-auto flex flex-col items-center justify-center'>
                            <div className='text-xl font-medium mb-6'>Register Here</div>

                            <Button type='submit' variant='default' onClick={() => { signIn("google"); }} className="w-full flex flex-row gap-2 mb-6">
                                <FaGoogle className="text-lg" />
                                Register with Google
                            </Button>

                            <div>Already have an account? <span className='cursor-pointer transition-all hover:underline' onClick={() => setIsLogin(!isLogin)}>Login</span> here;</div>
                        </div>
                    )}
                </div>
                <div className='md:w-1/2 h-full flex items-center justify-center rounded-tr-2xl rounded-br-2xl overflow-hidden bg-login'></div>
            </div>

        </div>
    )
}

export default Login