import HomeBanner from "@/components/homepage/homeBanner/HomeBanner";
import LazySections from "@/components/homepage/LazySections";
import { apiFetch } from "@/lib/api";

export default async function Home() {
  const {data, error} = await apiFetch(`home-page`);

  const pageData = data?.data;

  console.log('homepeage data',pageData);

  return (
    <>
      <HomeBanner data={pageData?.banner ?? {}}  />
      <LazySections />
    </>
  );
}
