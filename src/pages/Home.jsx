import Carousel from '@/components/Carousel';
import EventsAccordion from '@/components/EventsAccordion';

export default function Home() {
  return (
    <div className="w-full space-y-6 p-6 2xl:space-y-6 2xl:px-40 2xl:py-20">
      <Carousel />
      <EventsAccordion />
    </div>
  );
}
