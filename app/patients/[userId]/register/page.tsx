import RegisterForm from '@/components/forms/registerForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Register = async({params:{userId}}:SearchParamProps) => {

  const user = await getUser(userId)
  return (
    <div className="flex max-h-screen h-screen">
        <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-[496px]">
              <Image src={'/assets/icons/logo-full.svg'} alt="patient"
              height={"1000"} width={"1000"} className="mb-12 h-10 w-fit"/>

              <RegisterForm user={user}/>

              <div className="text-14-regular mt-20 flex justify-between">
                <p className="justify-items-end text-dark-600 xl:text-left">
                © 2024 CarePlus
                </p>
                <Link href={'/?admin=true'} className="text-green-500">
                    admin
                </Link>
              </div>
            </div>
        </section>

        <Image src={'/assets/images/register-img.png'} alt="patient"
              height={"1000"} width={"1000"} className="side-img max-w-[690px]"/>
    </div>
  )
}

export default Register