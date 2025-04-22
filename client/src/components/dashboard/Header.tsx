import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '@/lib/utils';

interface HeaderProps {
  title: string;
  coloredText?: string;
  broker?: {
    rank: number;
    name: string;
    specialty: string;
    color: string;
  };
}

export function Header({ title, coloredText, broker }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const currentDate = formatDate(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <svg 
          className="h-12 w-auto mr-4"
          viewBox="0 0 50 50" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="50" height="50" rx="4" fill="currentColor" className="text-primary/20" />
          <path d="M10 20V40H40V20L25 10L10 20Z" stroke="currentColor" strokeWidth="2" className="text-primary" />
          <path d="M20 40V25H30V40" stroke="currentColor" strokeWidth="2" className="text-primary" />
        </svg>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {title} <span className="text-primary">{coloredText}</span>
          </h1>
          {!broker && (
            <p className="text-muted-foreground text-sm">{currentDate}</p>
          )}
        </div>
      </div>
      
      {broker ? (
        <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center`} style={{ backgroundColor: broker.color }}>
          <div className="text-3xl font-bold mr-2 font-mono">#{broker.rank}</div>
          <div className="text-right">
            <p className="text-white text-lg font-medium">{broker.name}</p>
            <p className="text-white/70 text-sm">{broker.specialty}</p>
          </div>
        </div>
      ) : (
        <div className="text-right">
          <p className="text-muted-foreground text-sm">{currentDate}</p>
          <p className="text-lg font-mono text-primary">{currentTime}</p>
        </div>
      )}
    </header>
  );
}
