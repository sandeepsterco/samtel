"use client";

import { API_URL } from "@/config/config";
import { useRouter } from "next/navigation";
import countryList from "react-select-country-list";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type FieldErrors = {
  name?: string[];
  country?: string[];
  phone?: string[];
  email?: string[];
};

export default function ContactForm() {
  const router = useRouter();
  const countries = countryList().getData();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | undefined>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${API_URL}contact-form`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!data.success) {
        setStatus("idle");

        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(
            data.message || "Something went wrong. Please try again.",
          );
        }
        return;
      }

      setStatus("sent");
      router.push("/thank-you");
    } catch (error) {
      setStatus("idle");
      setGeneralError("Unable to submit the form. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {generalError && <p className="form-error">{generalError}</p>}

      <div className="form-group">
        <input type="text" name="name" placeholder="Name" required />
        {errors.name?.map((msg, i) => (
          <p key={i} className="field-error">
            {msg}
          </p>
        ))}
      </div>

      <div className="form-group">
        <input type="text" name="company_name" placeholder="Company Name" />
      </div>

      <div className="form-group">
        <select name="country" required defaultValue="">
          <option value="" disabled>
            Country
          </option>

          {countries.map((country) => (
            <option key={country.label} value={country.label}>
              {country.label}
            </option>
          ))}
        </select>

        {errors.country?.map((msg, i) => (
          <p key={i} className="field-error">
            {msg}
          </p>
        ))}
      </div>

      <div className="form-group">
        <PhoneInput
          international
          defaultCountry="IN"
          value={phone}
          onChange={setPhone}
          placeholder="Mobile No."
          className="phone-input"
        />

        <input type="hidden" name="phone" value={phone || ""} />

        {errors.phone?.map((msg, i) => (
          <p key={i} className="field-error">
            {msg}
          </p>
        ))}
      </div>

      <div className="form-group">
        <input type="email" name="email" placeholder="Email ID" required />
        {errors.email?.map((msg, i) => (
          <p key={i} className="field-error">
            {msg}
          </p>
        ))}
      </div>

      <div className="form-group">
        <textarea
          name="requirement"
          placeholder="Requirement"
          rows={2}
        ></textarea>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Submitting..." : "Submit"}
        <span>
          <img src="/assets/icons/arrow2.svg" alt="" />
        </span>
      </button>
    </form>
  );
}
