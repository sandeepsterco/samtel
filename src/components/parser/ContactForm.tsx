"use client";

import { API_URL, RECAPTCHA_SITE_KEY } from "@/config/config";
import { useRouter } from "next/navigation";
import Script from "next/script";
import countryList from "react-select-country-list";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

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
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    if (!RECAPTCHA_SITE_KEY) {
      setGeneralError("Security verification is not configured.");
      return;
    }

    if (captchaFailed) {
      setGeneralError("Security verification failed to load. Please try again later.");
      return;
    }

    if (!captchaReady || !window.grecaptcha) {
      setGeneralError("Security verification is still loading. Please try again.");
      return;
    }

    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    try {
      const recaptchaToken = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: "contact_form" },
      );
      const res = await fetch(`${API_URL}contact-form`, {
        method: "POST",
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          recaptcha_token: recaptchaToken,
        }),
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
    } catch {
      setStatus("idle");
      setGeneralError("Unable to submit the form. Please try again later.");
    }
  }

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
          onReady={() => {
            if (!window.grecaptcha) {
              setCaptchaFailed(true);
              return;
            }
            window.grecaptcha.ready(() => setCaptchaReady(true));
          }}
          onError={() => setCaptchaFailed(true)}
        />
      )}
      <form onSubmit={handleSubmit} noValidate>
        {generalError && <p className="form-error">{generalError}</p>}

        <div className="form-group">
          <input type="text" name="name" placeholder="Name*" required />
          {errors.name?.map((msg, i) => (
            <small key={i} className="field-error">
              {msg}
            </small>
          ))}
        </div>

        <div className="form-group">
          <input type="text" name="company_name" placeholder="Company Name" />
        </div>

        <div className="form-group">
          <select name="country" required defaultValue="">
            <option value="" disabled>
              Country*
            </option>

            {countries.map((country) => (
              <option key={country.label} value={country.label}>
                {country.label}
              </option>
            ))}
          </select>

          {errors.country?.map((msg, i) => (
            <small key={i} className="field-error">
              {msg}
            </small>
          ))}
        </div>

        <div className="form-group">
          <PhoneInput
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            placeholder="Mobile No.*"
            className="phone-input"
          />

          <input type="hidden" name="phone" value={phone || ""} />

          {errors.phone?.map((msg, i) => (
            <small key={i} className="field-error">
              {msg}
            </small>
          ))}
        </div>

        <div className="form-group">
          <input type="email" name="email" placeholder="Email ID*" required />
          {errors.email?.map((msg, i) => (
            <small key={i} className="field-error">
              {msg}
            </small>
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
    </>
  );
}
