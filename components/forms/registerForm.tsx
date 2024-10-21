"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../ui/CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../ui/FileUploader"


const RegisterForm = ({ user }: { user: User }) => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })

    // Handle form submission
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true)
        console.log("submitted");

        let formData

        if (values.identificationDocument && values.identificationDocument.length > 0 ) {
            const blobFile = new Blob([values.identificationDocument[0]],{
                type : values.identificationDocument[0].type,
            })
            formData = new FormData()
            formData.append("bolbFile",blobFile)
            formData.append("fileName", values.identificationDocument[0].name)
        }       

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate:new Date(values.birthDate),
                IdentificationDocument:formData
            }
            //@ts-ignore
            const patient = await registerPatient(patientData)

            if (patient) {
                router.push(`/patients/${user.$id}/new-appointment`);
              }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    }


    // Return the form JSX
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700 mt-2">Let us know more about yourself.</p>
                </section>

                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control} name="name" label="Full name"
                    iconSrc="/assets/icons/user.svg" placeholder="John" />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control} name="email" label="Email"
                        iconSrc="/assets/icons/email.svg" placeholder="John@gmail.com" />
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control} name="phone" label="Phone number"
                        placeholder="(553) 243-4343" />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control} name="birthDate" label="Date of birth"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control} name="gender" label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {GenderOptions.map((option) => (
                                        <div key={option} className="radio-group">
                                            <RadioGroupItem id={option} value={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )} />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control} name="address" label="Address"
                        placeholder="14th street newyork" />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control} name="occupation" label="Occupation"
                        placeholder="Software engineer" />
                </div>
                
                <div />

                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control} name="emergencyContactName" label="Emergency Contact Name"
                         placeholder="Guardians name" />
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}   
                        control={form.control} name="emergencyContactNumber" label="Emergency Contact Number" 
                        placeholder="453452222"/>
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>
                </div>

                <CustomFormField
                        fieldType={FormFieldType.SELECT}   
                        control={form.control} name="primaryPhysician" label="Primary Physician" 
                        placeholder="Select a physician">
                            {Doctors.map((doctor)=>(
                                <SelectItem key={doctor.name} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image src={doctor.image} width={32} height={32}
                                         alt={doctor.name} className="rounded-full border border-dark-500"/>
                                         <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                </CustomFormField>
                
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control} name="insuranceProvider" label="Insurance Provider"
                        placeholder="LIC" />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control} name="insurancePolicyNumber" label="Insurance Policy Number"
                        placeholder="ABC2423" />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row ">
                    <CustomFormField 
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control} name="allergies" label="Allergies (if any)"
                        placeholder="Peanuts,pollen..." />
                    <CustomFormField 
                        fieldType={FormFieldType.TEXTAREA }
                        control={form.control} name="currentMedication" label="Current Medication"
                        placeholder="Paracetamol,Lubrex..." />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control} name="familyMedicalHistory" label="Family Medical History"
                        placeholder="Mother had heart problem" />
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA }
                        control={form.control} name="pastMedicalHistory" label="Past Medical History"
                        placeholder="Appendectomy.Tonsillectomy" />
                </div>

                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verificaton</h2>
                    </div>
                </section>

                <CustomFormField
                        fieldType={FormFieldType.SELECT}   
                        control={form.control} name="identificationType" label="Identification Type" 
                        placeholder="Select an identification type">
                            {IdentificationTypes.map((type)=>(
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control} name="identificationNumber" 
                    label="Identification Number"
                    placeholder="145345333" />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control} name="identificationDocument"
                    label="scanned copy of identification document"
                    renderSkeleton={(field) => (
                       <FormControl>
                        <FileUploader files={field.value} onChange={field.onChange} />
                       </FormControl>
                    )} />

                <section className="space-y-4">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and privacy</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control} name="treatmentConsent" 
                    label="I consent to treatment" />

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control} name="disclosureConsent" 
                    label="I consent to disclosure of information" />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control} name="privacyConsent" 
                    label="I consent to privacy policy" />


                <SubmitButton isLoading={isLoading} >Get started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm
