import { Button, Link } from '@nextui-org/react'
import React from 'react'

const NotFound = () => {
  return (
    <div className="bg-white px-6 py-32 lg:px-8 min-h-[85vh]">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 mt-12 flex flex-col justify-center items-center">
            <h1 className="mt-2 text-3xl font-bold tracking-tightsm:text-4xl text-[#0e4d71] mb-12 text-center">Attività non trovata</h1>
            <Button
                as={Link}
                href='/'
                size='lg'
                color='primary'
                variant='solid'
                className='bg-[#0E4D71]'
            >
                Torna alle attività
            </Button>
        </div>
    </div>
  )
}

export default NotFound