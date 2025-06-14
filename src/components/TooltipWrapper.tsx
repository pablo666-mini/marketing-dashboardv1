
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TooltipWrapperProps {
  children?: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  iconClassName?: string;
}

export const TooltipWrapper = ({ 
  children, 
  content, 
  side = 'top',
  showIcon = false,
  iconClassName = "h-4 w-4 text-muted-foreground ml-2"
}: TooltipWrapperProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {showIcon && !children ? (
            <HelpCircle className={iconClassName} />
          ) : (
            <div className="flex items-center">
              {children}
              {showIcon && (
                <HelpCircle className={iconClassName} />
              )}
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
