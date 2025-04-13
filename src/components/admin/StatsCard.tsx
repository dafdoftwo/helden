import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  url?: string;
}

export default function StatsCard({ title, value, icon, trend = 'neutral', url }: StatsCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (url) {
      return (
        <Link href={url} className="block">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };
  
  return (
    <CardWrapper>
      <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              {icon}
            </div>
            <div className="ms-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {value}
                  </div>
                  
                  {trend !== 'neutral' && (
                    <div className={`ms-2 flex items-baseline text-sm font-semibold ${
                      trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend === 'up' ? (
                        <>
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="sr-only">Increased by</span>
                        </>
                      ) : (
                        <>
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="sr-only">Decreased by</span>
                        </>
                      )}
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
} 