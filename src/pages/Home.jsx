import CardSkeleton from "@/components/CardSkeleton";
import HalfDoughnutChart from "@/components/HalfDoughnutChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { LuClock4 } from "react-icons/lu";
import { BsCurrencyDollar } from "react-icons/bs";

import Carousel from "@/components/Carousel";
import { useEffect, useState } from "react";
import { getEvents } from "@/api/matches";
import { DateTime } from "luxon";
import toast from "react-hot-toast";



const isPending = false;
const isError = false;

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([])

  const handleEvents = async () => {
    try {
      const list = await getEvents()

      if( list?.length ) setEvents(list)
    }
    catch(err){
      toast.error('error occured', err)
    }
  }

  useEffect(()=>{
    handleEvents()
  },[])

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-white">
          Oops! Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  if (isPending) {
    return <CardSkeleton />;
  }

  return (
    <div className="w-full space-y-6 p-6 2xl:space-y-20 2xl:px-40 2xl:py-20">
      <Carousel />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events?.map((event, idx) => {
          return (
            <Card
              key={idx}
              className="min-h-40 w-full flex-col rounded-md border-none bg-gray-700 shadow-lg 2xl:min-h-60"
            >
              <CardContent className="flex h-full flex-col justify-between p-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle
                    className="text-balance text-sm font-semibold text-white hover:cursor-pointer hover:underline 2xl:text-base"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    {event.question}
                  </CardTitle>
                  <HalfDoughnutChart percentage={Math.floor(event.yes_percentage)} />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    className="group flex flex-1 items-center justify-center space-x-2 rounded-sm bg-[#22c55e] bg-opacity-30 text-[#22c55e] hover:bg-[#22c55e] hover:bg-opacity-100 hover:text-white 2xl:py-6"
                    onClick={() =>
                      navigate(`/event/${event.id}`, {
                        state: { bet: "yes" },
                      })
                    }
                  >
                    <span>Bet Yes</span>
                    <FaAngleDoubleUp className="group-hover:animate-bounce-updown" />
                  </Button>
                  <Button
                    className="group flex flex-1 items-center justify-center space-x-2 rounded-sm bg-red-600 bg-opacity-30 text-red-500 hover:bg-red-600 hover:bg-opacity-100 hover:text-white 2xl:py-6"
                    onClick={() =>
                      navigate(`/event/${event.id}`, {
                        state: { bet: "no" },
                      })
                    }
                  >
                    <span>Bet No</span>
                    <FaAngleDoubleDown className="group-hover:animate-bounce-updown" />
                  </Button>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <p className="flex items-center space-x-1">
                    <LuClock4 />
                    <span>
                      {DateTime.fromISO(
                        event?.match_time
                      ).toLocaleString(DateTime.DATETIME_MED)}
                    </span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <BsCurrencyDollar />
                    <span>5,073,203 Vol.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
