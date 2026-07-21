"use client"

import { API_URL } from "@/config/config";
import { useRouter } from "next/navigation";
import { useState } from "react"

type FieldErrors = {
    name?: string[];
    country?: string[];
    phone?: string[];
    email?: string[];
};

export default function ContactForm() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setStatus('sending');
        setErrors({});

        const formData = new FormData(e.currentTarget)

        try{
            const res = await fetch(`${API_URL}contact-form`, {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await res.json();
            console.log('res',data);

            if(!data.success){
                setStatus('idle');

                if(data.errors){
                    setErrors(data.errors)
                }else{
                    setGeneralError(data.message || 'Something went wrong. Please try again.');
                }
                return;
            }

            setStatus('sent');
            router.push('/thank-you');
        }catch(error){
            setStatus('idle');
            setGeneralError('Unable to submit the form. Please try again later.');
        }

    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            {generalError && <p className="form-error">{generalError}</p>}

            <div className="form-group">
                <input type="text" name="name" placeholder="Name" required />
                {errors.name?.map((msg, i) => (
                    <p key={i} className="field-error">{msg}</p>
                ))}
            </div>

            <div className="form-group">
                <input type="text" name="company" placeholder="Company Name" />
            </div>

            <div className="form-group">
                <select name="country" required defaultValue="">
                    <option value="" disabled>Country</option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                </select>
                {errors.country?.map((msg, i) => (
                    <p key={i} className="field-error">{msg}</p>
                ))}
            </div>

            <div className="form-group phone-input-container">
                <select name="country-code" defaultValue="+91">
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                </select>
                <input type="tel" name="phone" placeholder="Mobile No." />
                {errors.phone?.map((msg, i) => (
                    <p key={i} className="field-error">{msg}</p>
                ))}
            </div>

            <div className="form-group">
                <input type="email" name="email" placeholder="Email ID" required />
                {errors.email?.map((msg, i) => (
                    <p key={i} className="field-error">{msg}</p>
                ))}
            </div>

            <div className="form-group">
                <textarea name="requirement" placeholder="Requirement" rows={2}></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Submitting...' : 'Submit'}
                <span><img src="/assets/icons/arrow2.svg" alt="" /></span>
            </button>
        </form>
    )
}