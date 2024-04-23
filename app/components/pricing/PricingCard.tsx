'use client';

import { Check } from '@phosphor-icons/react';

const descriptionStyle = 'text-md font-light text-neutral-500 text-center min-h-[50px]';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  subtitle: string;
  features: string[];
  additionalPrice?: string;
  outline?: boolean;
  color?: boolean;
}

const PricingCard = ({
  title,
  subtitle,
  price,
  period,
  additionalPrice,
  features,
  outline,
  color,
}: PricingCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`flex flex-col items-center justify-between rounded-xl  h-[600px] shadow-md col-span-1 w-[500px] lg:w-full ${(color || outline) && 'border-none'} hover:shadow-lg transition duration-300 ease-in-out`}
      >
        <div
          className={`h-[300px] p-6 w-full ${color && 'bg-cambio-blue'}
          border-t-8
          ${outline && 'border-solid border-sky-200'}
          ${color && 'border-solid border-sky-800'}
          rounded-t-xl`}
        >
          <div className="text-xl font-semibold text-neutral-800 text-center">{title.toLocaleUpperCase()}</div>
          <div className={descriptionStyle}>{subtitle}</div>
          <div className="mt-5 text-center font-light flex flex-col items-center gap-5 text-neutral-500">
            <div className="flex justify-center items-end gap-2">
              <div className="text-6xl font-semibold text-neutral-800">{price}</div>
              <div className="text-lg font-semibold text-neutral-800">{`per ${period}`}</div>
            </div>
            <div className={descriptionStyle}>{additionalPrice}</div>
          </div>
        </div>
        <div className="w-full h-full px-4">
          <div className={`${!color && 'border-t-2'} flex flex-col gap-1 justify-start items-start h-full w-full py-4`}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-neutral-500">
                <Check size={16} weight="bold" className="shrink-0 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
