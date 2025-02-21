import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


interface Props{
    user: {
    _id: string,
    clerckId: string,
    picture: string,
    name: string,
    username: string
   }
}
const UserCard = ({user}: Props) => {
  return (
    <>
    <Link href={`/profile/${user.clerckId}`} 
    className='shadow-light100_darknone w-full max-xs:min-w-full 
    xs:w-[260px]'>
      <article>
        <Image src={user.picture}
        alt= "user_profile_picture" 
        width={100}
        height={100}
        className='rounded-full'/>
      </article>
    </Link>
    </>
  )
}

export default UserCard