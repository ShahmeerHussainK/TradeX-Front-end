import EventInformationSection from '@/components/EventInformationSection';
import TradeCard from '@/components/TradeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { BsCurrencyDollar } from 'react-icons/bs';
import { LuClock4 } from 'react-icons/lu';
import { useLocation, useParams } from 'react-router-dom';
import { getEventDetail } from '@/api/matches';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const isLoading = false;

// Helper function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === undefined) return 0;
  if (previous === 0) return (current * 100).toFixed(1);
  return (((current - previous) / previous) * 100).toFixed(1);
};

// Transform backend data to chart-friendly format
const transformData = (data) => {
  const labels = [];
  const xLabels = [];
  const yesData = [];
  const noData = [];
  if (data.length) {
    // Get the first and last timestamps to calculate the time span
    const firstDate = DateTime.fromISO(data[0].timestamp);
    const lastDate = DateTime.fromISO(data[data.length - 1].timestamp);
    const totalDays = lastDate.toFormat('d') - firstDate.toFormat('d');
    const totalMonths = lastDate.toFormat('L') - firstDate.toFormat('L');

    let previousDay = null;
    let previousMonth = null;

    data.forEach((item) => {
      const date = DateTime.fromISO(item.timestamp);

      // If the variation is within 1 day, show time
      if (totalDays === 0) {
        labels.push(date.toLocaleString(DateTime.TIME_SIMPLE)); // 'p' gives you time in 12-hour format
        xLabels.push(date.toLocaleString(DateTime.TIME_SIMPLE));
      }
      // If variations span multiple days but less than a month, show date + time
      else if (totalMonths === 0) {
        labels.push(date.toLocaleString(DateTime.DATETIME_MED)); // 'MMM d' gives date like "Oct 9", 'p' gives time
        const currentDay = date.toLocaleString(DateTime.DATETIME_MED);
        if (currentDay !== previousDay) {
          xLabels.push(date.toLocaleString(DateTime.DATE_MED)); // Show first label for each day
          previousDay = currentDay;
        } else {
          xLabels.push(''); // Hide other labels for the same day
        }
      }
      // If variations span multiple months, show only month and day
      else {
        labels.push(date.toLocaleString(DateTime.DATETIME_MED)); // 'MMM yyyy' gives month and year like "Oct 9, 2024, 'p' gives time"
        const currentMonth = date.toLocaleString(DateTime.DATETIME_MED);
        if (currentMonth !== previousMonth) {
          xLabels.push(date.toLocaleString(DateTime.DATETIME_MED)); // Show first label for each month
          previousMonth = currentMonth;
        } else {
          xLabels.push(''); // Hide other labels for the same month
        }
      }

      yesData.push(item.yes);
      noData.push(item.no);
    });

    return {
      labels,
      xLabels,
      datasets: [
        {
          label: 'YES',
          data: yesData,
          fill: false,
          borderColor: '#1f9cf7', // Blue line
          tension: 0.1,
        },
        {
          label: 'NO',
          data: noData,
          fill: false,
          borderColor: '#ff6384', // Red line
          tension: 0.1,
        },
      ],
    };
  }
  return null;
};

export default function Event() {
  const { id } = useParams();
  const { state } = useLocation();
  const bet = state?.bet || 'yes';

  const [event, setEvent] = useState(null);

  const chartRef = useRef(null);
  const data = useMemo(() => {
    if (event?.variations?.length) return transformData(event?.variations);
    return null;
  }, [event]);

  const initialData = useMemo(() => {
    if (event?.variations?.length === 0) {
      return { yes: 0, no: 0 };
    }
    return {
      yes: event?.variations[event?.variations?.length - 1].yes,
      no: event?.variations[event?.variations?.length - 1].no,
    };
  }, [event?.variations]);

  const initialPercentageVariation = useMemo(() => {
    if (event?.variations?.length < 2) {
      return { yes: 0, no: 0 };
    }
    const prevYes = event?.variations[event?.variations?.length - 2].yes;
    const prevNo = event?.variations[event?.variations?.length - 2].no;
    return {
      yes: calculatePercentageChange(initialData.yes, prevYes),
      no: calculatePercentageChange(initialData.no, prevNo),
    };
  }, [initialData, event?.variations]);

  const [hoveredData, setHoveredData] = useState(initialData);
  const [hoveredDataVariation, setHoveredDataVariation] = useState(
    initialPercentageVariation
  );

  const handleMouseMove = useCallback(
    (event) => {
      const chart = chartRef.current;
      if (!chart) return;

      const elements = chart.getElementsAtEventForMode(
        event,
        'index',
        { intersect: false },
        false
      );

      if (elements.length) {
        const index = elements[0].index;
        const yesValue = data?.datasets[0]?.data[index] ?? 0;
        const noValue = data?.datasets[1]?.data[index] ?? 0;
        const prevYes = data?.datasets[0]?.data[index - 1] ?? 0;
        const prevNo = data?.datasets[1]?.data[index - 1] ?? 0;

        setHoveredData({ yes: yesValue, no: noValue });

        setHoveredDataVariation({
          yes: calculatePercentageChange(yesValue, prevYes),
          no: calculatePercentageChange(noValue, prevNo),
        });
      } else {
        setHoveredData(initialData);
        setHoveredDataVariation(initialPercentageVariation);
      }
    },
    [data, initialData, initialPercentageVariation]
  );

  const handleEventDetail = useCallback(async () => {
    try {
      const details = await getEventDetail(id);
      if (details) setEvent(details);
    } catch (err) {
      toast.error('error occured', err);
    }
  }, [id]);

  useEffect(() => {
    handleEventDetail();
  }, [handleEventDetail]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const canvas = chart.canvas;
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw}¢`,
          },
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          position: 'right',
          grid: {
            drawBorder: false,
            color: (context) =>
              [25, 50, 75].includes(context.tick.value)
                ? '#d1e7ff'
                : 'transparent',
            lineWidth: 0.1,
          },
          ticks: {
            stepSize: 25,
            callback: (value) =>
              value === 0 || value === 100 ? '' : `${value}%`,
            align: 'end',
          },
          border: { display: false },
        },
        x: {
          ticks: {
            autoSkip: false,
            callback: (value, index) => data.xLabels[index], // Use xLabels for x-axis
            maxRotation: 0,
            minRotation: 0,
          },
          grid: { display: false },
          border: { display: false },
        },
      },
      elements: {
        point: {
          radius: 2,
          hoverRadius: 5,
          backgroundColor: (context) =>
            context.datasetIndex === 0 ? '#1f9cf7' : '#ff6384',
          borderColor: '#1f9cf7',
          borderWidth: 2,
        },
      },
      layout: { padding: 0 },
    }),
    [data]
  );

  if (data?.labels) {
    return (
      <div className="flex flex-col justify-between gap-10 p-5 sm:p-10 lg:flex-row 2xl:gap-40 2xl:px-40 2xl:py-20">
        <div className="text-white lg:w-[70%]">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <p className="pb-1 text-3xl font-semibold">
                  {isLoading ? (
                    <Skeleton className="h-8 w-72" /> // Skeleton for title
                  ) : (
                    event?.question
                  )}
                </p>
                <div className="flex space-x-2 text-base text-gray-400">
                  <p className="flex items-center space-x-1">
                    <LuClock4 />
                    <span>
                      {DateTime.fromISO(
                        event?.match?.match_time
                      ).toLocaleString(DateTime.DATETIME_MED)}
                    </span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <BsCurrencyDollar />
                    <span>5,073,203 Vol.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <EventInformationSection
              label="YES"
              value={hoveredData?.yes ?? 0}
              variation={hoveredDataVariation?.yes}
            />
            <EventInformationSection
              label="NO"
              value={hoveredData?.no ?? 0}
              variation={hoveredDataVariation?.no}
            />
          </div>
          <Line data={data} ref={chartRef} options={options} />
        </div>
        <div className="flex items-center lg:w-[30%]">
          <TradeCard bet={bet} handleEventDetail={handleEventDetail} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <p>NO DATA FOUND</p>
    </div>
  );
}
