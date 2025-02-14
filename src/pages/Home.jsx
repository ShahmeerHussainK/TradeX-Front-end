import Carousel from '@/components/Carousel';
import MatchesAccordion from '@/components/MatchesAccordion';
import UpcomingCurentMatchesAccordion from '@/components/UpcomingCurentMatchesAccordion';

export default function Home() {
  return (
    <div className="w-full space-y-6 p-6 2xl:py-20">
      <Carousel />
      <div className="flex h-screen gap-4 overflow-hidden">
        <div className="h-full w-1/5 overflow-auto">
          <UpcomingCurentMatchesAccordion />
        </div>
        <div className="h-full w-4/5 overflow-auto">
          <MatchesAccordion />
        </div>
        <div className="h-full w-1/5 overflow-auto">
          <UpcomingCurentMatchesAccordion />
        </div>
      </div>
    </div>
  );
}
