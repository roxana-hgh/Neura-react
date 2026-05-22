import {LucideChevronDown, LucideChevronUp, LucideLogOut, PauseCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../ui/button";

interface Iprop {
   defaultMinutes?: number,
   defaultSeconds?: number
   onComplete?: () => void
}

function FocusTimer({
    defaultMinutes=25, 
    defaultSeconds=0,
    onComplete
  }: Iprop) {

  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [prevMinutes, setPrevMinutes] = useState(minutes);
  const [prevSeconds, setPrevSeconds] = useState(seconds);
  const intervalRef = useRef<number | null>(null);

  const today = new Date().toDateString()

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      
      
      intervalRef.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              onComplete?.();
              return 0;
            }

            setPrevMinutes(minutes);
            setMinutes((prevMin) => prevMin - 1);
            setPrevSeconds(59);
            return 59;
          }
          
          setPrevSeconds(prevSec);
          return prevSec - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, minutes, onComplete]);

  // Button handlers
  const changeMinutes = (delta: number) => {
    setPrevMinutes(minutes);
    setMinutes(Math.max(0, minutes + delta));
  };
  const changeSeconds = (delta: number) => {
    setPrevSeconds(seconds);
    setSeconds(Math.max(0, Math.min(59, seconds + delta)));
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setPrevMinutes(defaultMinutes);
    setMinutes(defaultMinutes);
    setPrevSeconds(0);
    setSeconds(0);
  };

  // const slideVariants = {
  //   initial: (direction: number) => ({
  //     y: direction > 0 ? 20 : -20,
  //     opacity: 0,
  //   }),
  //   animate: { y: 0, opacity: 1 },
  //   exit: (direction: number) => ({
  //     y: direction > 0 ? -20 : 20,
  //     opacity: 0,
  //   }),
  // };


  return (
    <>
    <div className="Timer flex justify-center w-full h-full py-5 my-4">
      <div className="clock flex items-center gap-4 py-5">
        <div className="min flex flex-col items-center gap-3 p-3">
            <div onClick={() => changeMinutes(1)} className="text-neutral-600 opacity-60 hover:opacity-100 cursor-pointer">
                 <LucideChevronUp size={32}/>
            </div>
           
          <span className="text-9xl font-semibold"> {minutes.toString().padStart(2, "0")}</span>
          <div   onClick={() => changeMinutes(-1)} className="text-neutral-600 opacity-60 hover:opacity-100 cursor-pointer">
                <LucideChevronDown  size={32} />
            </div>
         
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-medium text-lg">.</span>
          <span className="font-medium text-lg">.</span>
        </div>
        <div   className="min flex flex-col items-center gap-3 p-3">
            <div  onClick={() => changeSeconds(1)} className="text-neutral-600 opacity-60 hover:opacity-100 cursor-pointer">
                 <LucideChevronUp size={32}/>
            </div>
           
          <span className="text-9xl font-semibold">{seconds.toString().padStart(2, "0")}</span>
          <div  onClick={() => changeSeconds(-1)} className="text-neutral-600 opacity-60 hover:opacity-100 cursor-pointer">
                <LucideChevronDown  size={32} />
            </div>
         
        </div>
      </div>
    </div>
      <div className="text-center my-4">
        <h6 className="font-semibold mb-3 dark:text-neutral-300">
          Deep Focus Session
        </h6>
        <h5 className="text-3xl max-w-140 mx-auto"> {today}</h5>
      </div>
      <div className="py-3">
        {isRunning ? (
          <div className="flex justify-center gap-2 py-2">
            <Button
              size="lg"
              variant="outline"
              className=" cursor-pointer rounded-full"
              onClick={handlePause}
            >
              <PauseCircle />
              <span>Pause Sesstion</span>
            </Button>
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className=" cursor-pointer rounded-full"
            >
              <LucideLogOut />
              <span>Exit Sesstion</span>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-2 py-2">
            <Button
              onClick={handleStart}
              size="lg"
              className=" cursor-pointer rounded-full px-8"
            >
              Start Session
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default FocusTimer;
