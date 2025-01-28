import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import MatchesAccordionTable from './MatchesAccordionTable';
import { useEffect, useState } from 'react';
import { getMatches } from '@/api/matches';
import toast from 'react-hot-toast';

const MatchesAccordion = () => {
  const [matches, setMatches] = useState(null);

  const handleGetMatches = async () => {
    try {
      const data = await getMatches('basketball');

      if (Object.keys(data).length) {
        setMatches(data);
      }
    } catch (err) {
      toast.error('error occured', err);
    }
  };

  useEffect(() => {
    handleGetMatches();
  }, []);

  if (matches)
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={Object.keys(matches)[0]}
      >
        {Object.entries(matches).map(([league, data], index) => (
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
              <MatchesAccordionTable data={data} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  return <div className="w-full" />;
};

export default MatchesAccordion;
