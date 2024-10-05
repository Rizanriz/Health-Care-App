"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import CustomFormField from "../ui/CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"

const enum FormFieldType {
    INPUT= "input",
    PHONE_INPUT="phoneInput"
}

// Define the form schema
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

const PatientForm = () => {

    const [isLoading, setIsLoading] = useState(false)
    // Initialize the form using useForm and zodResolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    // Return the form JSX
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                <section>
                    <h1 className="header">Hai there 👋</h1>
                    <p className="text-dark-700 mt-2">Schedule your first appoinment.</p>
                </section>
                
                <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} name="name" label="Full name" 
                iconSrc="/assets/icons/user.svg" placeholder="John"  />
                <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} name="email" label="Email" 
                iconSrc="/assets/icons/email.svg" placeholder="John@gmail.com" />
                <CustomFormField 
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control} name="Phone" label="Phone number" 
                placeholder="(553) 243-4343" />

                <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm
