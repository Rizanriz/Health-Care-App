    "use client"

    import { zodResolver } from "@hookform/resolvers/zod"
    import { useForm } from "react-hook-form"
    import { z } from "zod"
    import {Form} from "@/components/ui/form"
    import CustomFormField from "../ui/CustomFormField"
    import SubmitButton from "../ui/SubmitButton"
    import { useState } from "react"
    import { UserFormValidation } from "@/lib/validations"
    import { useRouter } from "next/navigation"
    import { createUser } from "@/lib/actions/patient.actions"

    export const enum FormFieldType {
        INPUT = "input",
        TEXTAREA = "textarea",
        PHONE_INPUT = "phoneInput",
        CHECKBOX = "checkbox",
        DATE_PICKER = "datePicker",
        SELECT = "select",
        SKELETON = "skeleton",
    }

    const PatientForm = () => {

        const [isLoading, setIsLoading] = useState(false)
        const router = useRouter()
        // Initialize the form using useForm and zodResolver
        const form = useForm<z.infer<typeof UserFormValidation>>({
            resolver: zodResolver(UserFormValidation),
            defaultValues: {
                name: "",
                email: "",
                phone: "",
            },
        })

        // Handle form submission
        async function  onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
            setIsLoading(true)
            console.log("submitted");
            
            try {
                const userData = {name,email,phone}

                const user = await createUser(userData)

                if(user){
                    router.push(`/patients/${user.$id}/register`)                    
                } 
                               
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false)
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
                        control={form.control} name="phone" label="Phone number" 
                        placeholder="(553) 243-4343" />

                    <SubmitButton isLoading={isLoading} >Get started</SubmitButton>
                </form>
            </Form>
        )
    }

    export default PatientForm
