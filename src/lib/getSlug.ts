import { headers } from "next/headers";

export async function getPathname():Promise<string>{
    const headersList = await headers();
    return headersList.get('x-pathname') ?? '';
}

export async function getSlug(segmentIndex = -1):Promise<string>{
    const pathname = await getPathname();
    const parts = pathname.split('/').filter(Boolean);

    const index = segmentIndex < 0 ? parts.length + segmentIndex : segmentIndex;
    return parts[index] ?? '';
}