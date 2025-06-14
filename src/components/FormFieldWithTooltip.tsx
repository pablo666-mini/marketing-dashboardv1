
import React from 'react';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TooltipWrapper } from '@/components/TooltipWrapper';

interface FormFieldWithTooltipProps {
  label: string;
  tooltip: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormFieldWithTooltip = ({ 
  label, 
  tooltip, 
  description, 
  children,
  required = false 
}: FormFieldWithTooltipProps) => {
  return (
    <FormItem>
      <FormLabel className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <TooltipWrapper
          content={tooltip}
          showIcon
          iconClassName="h-3 w-3 text-muted-foreground ml-2"
        />
      </FormLabel>
      <FormControl>
        {children}
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
