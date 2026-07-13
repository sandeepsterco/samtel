import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not_found_page flex-grow flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8 bg-gray-50 min-h-[calc(100vh-38.3rem)] bg-gray-50">
      <div className="text-center">
        <div className="content">

          <h1 className="text-[10rem] font-bold text-[var(--color-0c)] leading-[10rem]">
            404
          </h1>
          <h2 className="title42">Look like you're lost</h2>
          <p className="mt-6 text-[3rem] md:!text-[2.5rem] leading-[4rem] text-gray-600 max-w-[80rem] mx-auto">
            The page you are looking for not available!
          </p>

          <div className="mt-[5rem] block">
            <Link
              href="/"
              className="mt-[5rem] rounded-md bg-[var(--color-fa)] px-[2rem] md:px-[3rem] py-[1rem] md:py-[1.5rem] text-[2rem] md:text-[2.5rem] font-semibold text-white shadow-sm hover:bg-[var(--color-06)] hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition duration-200 go_back__btn" 
            >
              Back to Homepage
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
