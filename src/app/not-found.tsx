import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not_found_page">
      <div className="container">
        <div className="content">

          <h1 className="heading">
            404
          </h1>
          <h2 className="sub_heading">Look like you're lost</h2>
          <p className="para">
            The page you are looking for not available!
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
      </div>
    </main>
  );
}
