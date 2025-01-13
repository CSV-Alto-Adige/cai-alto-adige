// https://cai-alto-adige.vercel.app/api/revalidate?path=/&secret=VGot3cLp4QlQE7X

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret')

    if (secret !== process.env.MY_SECRET_TOKEN) {
        return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
            status: 401,
            statusText: 'Unauthorized',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const path = request.nextUrl.searchParams.get('path') || '/'

    revalidatePath(path)

    return NextResponse.json({ revalidated: true })
}