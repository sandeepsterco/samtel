import Link from "next/link";
import "./thank-you.css";
import { BASE_URL } from "@/config/config";

export default function ThankYouPage() {
  return (
    <main className="thank_you">
      <div className="thank_you_card">
        <h1 className="heading">
          Thank You for Contacting Us!
        </h1>

        <p className="message">
          We have received your inquiry successfully. Our team will get in touch
          with you shortly.
        </p>

        <div>
          <Link
            href={BASE_URL ?? "/"}
            className="back_btn"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}