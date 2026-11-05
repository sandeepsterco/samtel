import ComingSoon from "@/components/common/comingSoon/ComingSoon";
import BlogCommentForm from "@/components/common/forms/BlogCommentForm";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, error } = await apiFetch(`blogs/${slug}`);

  if (error || !data?.success) notFound();

  const pageData = data?.data;

  const combinedHtml = Object.values(pageData?.content ?? {}).join("");

  if (combinedHtml?.length === 0) {
    return <ComingSoon />;
  }

  return (
    <div className="company-sec1 newsroom-detail-panel">
      <div className="container">
        <div className="col-lg-10 mx-auto">
          <div className="company-text">
            <div className="date">{formatDate(pageData?.created_at)}</div>
            <h2>{pageData?.title}</h2>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="newsroom_full">
            <figure>
              <Image alt={pageData?.image_alt || pageData?.title} src={pageData?.image_url} className="img-fluid" width={1475} height={603} loading="lazy" />
            </figure>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="news_panel_text">
                <ReactParserDynamic html={combinedHtml} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <BlogCommentForm id={pageData.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
