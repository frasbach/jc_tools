'use client';

import SplittingTable from '@/custom-components/splitting-table';

export default function Home() {
  return (
    <div className="main">
      {/* <SiteHeader /> */}
      <div className="flex min-h-screen items-start pt-8 justify-center">
        <SplittingTable />
      </div>
    </div>
  );
}
