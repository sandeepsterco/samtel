import Happenings from "@/components/homepage/happenings/Happenings";
import HomeBanner from "@/components/homepage/homeBanner/HomeBanner";
import People from "@/components/homepage/people/People";
import Sustainability from "@/components/homepage/sustainability/Sustainability";
import Technology from "@/components/homepage/technology/Technology";
import WhoWe from "@/components/homepage/whoWe/WhoWe";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <WhoWe />
      <Technology />
      <People />
      <Sustainability />
      <Happenings />
    </>
  );
}
