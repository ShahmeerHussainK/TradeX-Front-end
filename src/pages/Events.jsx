import EventsAccordion from '@/components/EventsAccordion';
import MatchLiveResults from '@/components/MatchLiveResults';
import UpcomingCurentMatchesAccordion from '@/components/UpcomingCurentMatchesAccordion';
import { useSearchParams } from 'react-router-dom';

export default function Events() {
  const [searchParams] = useSearchParams();
  searchParams.get('isLive');

  return (
    <div className="w-full space-y-6 p-6 2xl:py-20">
      <div className="flex w-full justify-center pb-10 pt-5">
        {searchParams.get('isLive') ? (
          <div className="w-[50%]">
            <MatchLiveResults />
          </div>
        ) : null}
      </div>
      <div className="flex h-screen gap-4 overflow-hidden">
        <div className="h-full w-1/5 overflow-auto">
          <UpcomingCurentMatchesAccordion />
        </div>
        <div className="h-full w-4/5 overflow-auto">
          <EventsAccordion />
        </div>
        <div className="h-full w-1/5 overflow-auto">
          <UpcomingCurentMatchesAccordion />
        </div>
      </div>
    </div>
  );
}
