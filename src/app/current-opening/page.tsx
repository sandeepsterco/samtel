import KekaJobs from "@/components/career/KekaJobs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  null,
  "Current Openings",
  "Explore current job openings at Samtel Group and find opportunities to grow your career.",
);

export default function CurrentOpeningPage() {
  return (
    <>
      <section className="apply_sec">
        <div className="container">
          <div className="col-lg-10 mx-auto">
            <KekaJobs />
          </div>
        </div>
      </section>

    </>
  );
}