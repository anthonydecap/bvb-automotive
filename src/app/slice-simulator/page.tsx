import { SliceSimulator, type SliceSimulatorParams, getSlices } from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";

import { getSettings } from "@/lib/content";
import { components } from "@/slices";

export default async function SliceSimulatorPage({ searchParams }: SliceSimulatorParams) {
  const { state } = await searchParams;
  const slices = getSlices(state);
  const settings = await getSettings();

  return (
    <SliceSimulator>
      <SliceZone slices={slices} components={components} context={{ settings }} />
    </SliceSimulator>
  );
}
