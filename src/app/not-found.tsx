import Link from "next/link";
import './not-found.css'
import { BASE_URL } from "@/config/config";

export default function NotFound() {
  return (
    <div className="error_page section">

      <div className="error">
        <div className="error__title">404</div>
        <div className="error__subtitle">UH OH! You're lost</div>
        <div className="error__description">The page you are looking for does not exist. How you got here is a mystery. <br />But you can click the button below to go back to the home page.</div>
        <Link href={BASE_URL || '/'} className="error__button error__button--active">Back to home</Link>
        <Link href={`${BASE_URL}contact-us`} className="error__button">Contact</Link>
      </div>

    </div>
  );
}
