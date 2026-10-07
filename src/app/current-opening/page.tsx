import KekaJobs from "@/components/career/KekaJobs";
import { Suspense } from "react";

export const metadata = {
  title: "Current Opening",
  description:
    "Discover opportunities to grow, learn, and build a rewarding career.",
};

export default function CurrentOpeningPage() {
  return (
    <>
      <section className="apply_sec">
        <div className="container">
          <div className="col-lg-10 mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <KekaJobs />
            </Suspense>
          </div>
        </div>
      </section>

    </>
  );
}