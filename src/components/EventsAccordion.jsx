import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import MatchEventsAccordionTable from './MatchEventsAccordionTable';
import { useCallback, useEffect, useState } from 'react';
import { getEventsByMatchId } from '@/api/matches';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const EventsAccordion = () => {
  const { matchId } = useParams();
  const [events, setEvents] = useState(null);

  const handleGetMatchEvents = useCallback(async () => {
    try {
      const data = await getEventsByMatchId(matchId);

      if (Object.keys(data).length) {
        setEvents(data);
      }
    } catch (err) {
      toast.error('error occured', err);
    }
  }, [matchId]);

  useEffect(() => {
    handleGetMatchEvents();
  }, [handleGetMatchEvents]);

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
              className="flex w-full justify-between bg-sky-600 p-3 text-white hover:bg-sky-700"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex w-full items-center gap-3">
                <span className="text-left text-sm font-medium">{league}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <MatchEventsAccordionTable data={data} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  return <div className="w-full" />;
};

export default EventsAccordion;
