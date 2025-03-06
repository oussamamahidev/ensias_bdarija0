"use client";

import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface CustomInputTypes {
    route: string,
    iconPosition: string,
    imgSrc: string,
    placeholder: string,
    otherClasses: string
}

const LocalSearch = ({
    route,
    iconPosition,
    imgSrc,
    placeholder,
    otherClasses
}: CustomInputTypes) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [search, setSearch] = useState(query || '')

    useEffect(() => {
        // debounce
        const delayDebounced = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    Key: 'q',
                    Value: search
                })
                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        Keys: ['q']
                    })
                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300)

        return () => clearTimeout(delayDebounced);
    }, [search, router, route, searchParams, query])

    return (
        <div className="mt-10 flex w-full items-center gap-4 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-400 border border-gray-300 dark:border-gray-600">
            {iconPosition === 'left' && (
                <Image 
                    src={imgSrc}
                    alt='search icon'
                    width={20}
                    height={20}
                    className='cursor-pointer transition-transform hover:scale-110 filter drop-shadow-md dark:invert'
                />
            )}
            <Input
                type='text'
                placeholder={placeholder} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm'
            />
        </div>
    )
}

export default LocalSearch