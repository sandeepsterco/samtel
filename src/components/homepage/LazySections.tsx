'use client'

import dynamic from "next/dynamic"

const LoadingFallback = () => <h1>Loading...</h1>

const WhoWe = dynamic(() => import("@/components/homepage/whoWe/WhoWe"), { 
  loading: LoadingFallback,
  ssr: false 
});

const Technology = dynamic(() => import("@/components/homepage/technology/Technology"), { 
  loading: LoadingFallback,
  ssr: false 
});

const People = dynamic(() => import("@/components/homepage/people/People"), { 
  loading: LoadingFallback,
  ssr: false 
});

const Sustainability = dynamic(() => import("@/components/homepage/sustainability/Sustainability"), { 
  loading: LoadingFallback,
  ssr: false 
});

const Happenings = dynamic(() => import("@/components/homepage/happenings/Happenings"), { 
  loading: LoadingFallback,
  ssr: false 
});

export default function LazySections() {
  return (
    <>
      <WhoWe />
      <Technology />
      <People />
      <Sustainability />
      <Happenings />
    </>
  )
}