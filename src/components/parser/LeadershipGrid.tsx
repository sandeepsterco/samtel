import { apiFetch } from "@/lib/api";
import Leaderships from "../leadership/Leaderships";

export default async function LeadershipGrid() {
  const {data, error} = await apiFetch(`leadership`);

  if(error) {
    throw new Error(`Failed to fetch Leadership data `+error);
  }

  const leadershipData = data?.data;

  return (
    <Leaderships pageData={leadershipData} />
  );
}
