import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb.js';
import { User } from '@/models/User.js';

export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        const { email, fileUrl } = await request.json();

        if (!email || !fileUrl) {
            return NextResponse.json({ message: 'Email and fileUrl are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.files.push(fileUrl);
        await user.save();
        return NextResponse.json(
            {
                message: 'File URL added successfully',
                user: {
                    email: user.email,
                    files: user.files,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
