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
          className="h-14 w-auto mr-4"
          viewBox="0 0 50 50" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="50" height="50" rx="6" fill="currentColor" className="text-primary/20" />
          <path d="M10 20V40H40V20L25 10L10 20Z" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
          <path d="M20 40V25H30V40" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
        </svg>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {title} <span className="text-primary font-extrabold">{coloredText}</span>
          </h1>
          {!broker && (
            <p className="text-muted-foreground font-medium text-sm mt-1">{currentDate}</p>
          )}
        </div>
      </div>
      
      {broker ? (
        <div 
          className="px-6 py-3 rounded-lg shadow-lg flex items-center border border-border"
          style={{ 
            backgroundColor: broker.color,
            boxShadow: `0 4px 20px ${broker.color}40`
          }}
        >
          <div className="text-3xl font-bold mr-3 font-mono text-white">#{broker.rank}</div>
          <div className="text-right">
            <p className="text-white text-lg font-semibold">{broker.name}</p>
            <p className="text-white text-sm font-medium">{broker.specialty}</p>
          </div>
        </div>
      ) : (
        <div className="text-right bg-card/50 p-3 rounded-lg border border-border shadow-sm">
          <p className="text-foreground text-sm font-medium">{currentDate}</p>
          <p className="text-xl font-mono text-primary font-bold">{currentTime}</p>
        </div>
      )}
    </header>
  );
}
