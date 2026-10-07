import KekaJobs from "@/components/career/KekaJobs";

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
            <KekaJobs />
          </div>
        </div>
      </section>

    </>
  );
}