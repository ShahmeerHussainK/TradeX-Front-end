import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import EventsTable from './EventsTable';
import { useEffect, useState } from 'react';
import { getEvents } from '@/api/matches';
import toast from 'react-hot-toast';

const EventsAccordion = () => {
  const [events, setEvents] = useState(null);

  const handleEvents = async () => {
    try {
      const data = await getEvents();

      if (data) setEvents(data);
    } catch (err) {
      toast.error('error occured', err);
    }
  };

  useEffect(() => {
    handleEvents();
  }, []);

  if (events)
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={Object.keys(events)[0]}
      >
        {Object.entries(events).map(([league, data], index) => (
          <AccordionItem value={league} key={index}>
            <AccordionTrigger
              className="flex w-full justify-between bg-teal-800 p-3 text-white hover:bg-teal-600"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex w-full items-center gap-3">
                <span className="text-left text-sm font-medium">{league}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <EventsTable data={data} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  return null;
};

export default EventsAccordion;
