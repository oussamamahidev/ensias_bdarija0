"use client"

import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { Value } from '@radix-ui/react-select'
import { Key } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface CustomInputTypes{
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
  const router= useRouter();
  const pathname =usePathname();
  const searchParams= useSearchParams();
  const query = searchParams.get('q');

  const [search,setSearch]=useState(query || '')
  useEffect(()=>{
    //debounce
    const delayDebounced= setTimeout(()=>{
      if(search){
        const newUrl= formUrlQuery({
          params: searchParams.toString(),
          Key: 'q',
          Value: search
        })
        router.push(newUrl),{scroll: false};
      }else{
        if(pathname===route){
          const newUrl= removeKeysFromQuery({
            params: searchParams.toString(),
            Keys: ['q']
          })
          router.push(newUrl),{scroll: false};
        }
      }
    },300)

    return ()=> clearTimeout(delayDebounced);
  },[search,router,route,searchParams,query])
  return (
    <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>

        {iconPosition ==='left'&&
        (<Image 
            src={imgSrc}
            alt='search icon'
            width={24}
            height={24}
            className='cursor-pointer'/>)}

            <Input
            type='text'
            placeholder={placeholder} 
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='paragraph-regular
             no-focus placeholder text-dark400_light700
              border-none background-light800_darkgridient
               shadow-none outline-none'
            />
            {iconPosition ==='right'&&
        (<Image 
            src={imgSrc}
            alt='search icon'
            width={24} 
            height={24}
            className='cursor-pointer'/>)}
    </div>
  )
}

export default LocalSearch