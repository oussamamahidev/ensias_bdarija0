import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


interface Props{
    imgUrl: string;
    alt: string;
    value: string | number;
    title: string;
    href?: string;
    textStyles?: string;
    isAuthor?: boolean;
}
const Metric = ({
    imgUrl,
    alt,
    value,
    title,
    href,
    textStyles,
    isAuthor,
}: Props) => {

    const metricContont= (
        <>
            <Image 
            src={imgUrl}
            width={16}
            alt={alt}
            height={16}
            className={`object-contain rounded-full`}
        />
        <p className={`${textStyles} flex-center gap-1`}>
            {value}
            <span className={`small-regular line-clamp-1 ${isAuthor ?'max-sm:hidden' : ''}`}></span>  
            {title}
        </p>
        </>
    )
    if(href){
        return(
            <Link href={href} className='flex-center gap-1'>
                     {metricContont}
             </Link>
        )
        
    }
  return (
    <div className='flex-center flex-wrap gap-1'>
        {metricContont}
    </div>
  )
}

export default Metric