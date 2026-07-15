import Link from "next/link";
import './coming-soon.css'

export default function ComingSoon() {
  return (
    <main className="coming_soon_page">
      <div className="text-center">
        <h1 className="heading">
          Coming Soon
        </h1>
        <p className="para">
          We are currently working on this page. Please stay tuned!
        </p>
        <div className="">
          <Link
            href="/"
            className="back_btn"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
