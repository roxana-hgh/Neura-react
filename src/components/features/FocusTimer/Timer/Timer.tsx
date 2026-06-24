import {LucideChevronDown, LucideChevronUp, LucideLogOut, PauseCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../ui/button";
import { useFocusSessionStore } from "../../../../stores/focusSessionStore";
import type { FocusSession } from "../../../../types/FocusSession";

interface Iprop {
   defaultMinutes?: number,
   defaultSeconds?: number
   onComplete?: () => void
   onSessionSaved?: (session: FocusSession) => void
}

function FocusTimer({
    defaultMinutes=25, 
    defaultSeconds=0,
    onComplete,
    onSessionSaved
  }: Iprop) {

  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60 + defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const initialSessionSecondsRef = useRef(totalSeconds);
  const addSession = useFocusSessionStore((state) => state.addSession);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const today = new Date().toDateString()

  // Track session start time
  useEffect(() => {
    if (isRunning && !sessionStartTimeRef.current) {
      sessionStartTimeRef.current = new Date();
      initialSessionSecondsRef.current = totalSeconds;
    }
  }, [isRunning, totalSeconds]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            
            // Save session when completed
            if (sessionStartTimeRef.current) {
              const endTime = new Date();
              const durationSeconds = initialSessionSecondsRef.current - 1;
              const newSession: Omit<FocusSession, 'id' | 'dateCreated'> = {
                duration: durationSeconds,
                startTime: sessionStartTimeRef.current,
                endTime: endTime,
                name: `Focus Session - ${new Date(sessionStartTimeRef.current).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                tag: 'work',
              };
              addSession(newSession);
              onSessionSaved?.(newSession as FocusSession & { id: string; dateCreated: string });
              sessionStartTimeRef.current = null;
            }
            
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, onComplete, addSession, onSessionSaved]);

  // Button handlers
  const changeMinutes = (delta: number) => {
    setTotalSeconds(Math.max(0, totalSeconds + delta * 60));
  };
  const changeSeconds = (delta: number) => {
    const newSeconds = Math.max(0, Math.min(59, seconds + delta));
    setTotalSeconds(Math.floor(totalSeconds / 60) * 60 + newSeconds);
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    sessionStartTimeRef.current = null;
    setTotalSeconds(defaultMinutes * 60 + defaultSeconds);
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
