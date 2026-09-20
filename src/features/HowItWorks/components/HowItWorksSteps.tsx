import React from 'react';
import ProcessStepCard from '../../Hero/components/ProcessStepCard';
import { processSteps } from '../../Hero/constants';

export default function HowItWorksSteps() {
  return (
    <section className="cursor-default px-6 pt-4 pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {processSteps.map((step) => (
            <ProcessStepCard
              key={step.name}
              name={step.name}
              label={step.label}
              image={step.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
