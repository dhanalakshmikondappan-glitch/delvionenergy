import { useMemo, useState } from "react";

import { Button } from "~/components/buttons/Button";
import { Input } from "~/components/forms/Input";
import { Select } from "~/components/forms/Select";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { buildMetaTags } from "~/constants/seo";
import { useAnimatedNumber } from "~/hooks/useAnimatedNumber";
import { calculateSavings, type PropertyType, type RoofType } from "~/utils/calculator";

import type { Route } from "./+types/calculator";

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

const ROOF_TYPE_OPTIONS: { value: RoofType; label: string }[] = [
  { value: "rcc", label: "RCC / Concrete" },
  { value: "metal", label: "Metal / Tin" },
  { value: "other", label: "Other" },
];

function formatRupees(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function ResultStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface-elevated p-6">
      <p className="text-caption text-ink-muted">{label}</p>
      <p className="mt-1 font-numeric text-subheading font-semibold text-ink">{children}</p>
    </div>
  );
}

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("calculator");
}

export default function Calculator() {
  const [monthlyBill, setMonthlyBill] = useState("3000");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [roofType, setRoofType] = useState<RoofType>("rcc");

  const parsedBill = Number.parseFloat(monthlyBill);
  const results = useMemo(
    () => calculateSavings({ monthlyBill: parsedBill, propertyType, roofType }),
    [parsedBill, propertyType, roofType],
  );

  const animatedSystemSize = useAnimatedNumber(results.systemSizeKw);
  const animatedMonthlySavings = useAnimatedNumber(results.monthlySavings);
  const animatedAnnualSavings = useAnimatedNumber(results.annualSavings);
  const animatedLifetimeSavings = useAnimatedNumber(Math.max(results.lifetimeSavings, 0));
  const animatedCo2 = useAnimatedNumber(results.co2ReductionKgPerYear / 1000);
  const animatedPayback = useAnimatedNumber(results.paybackYears);

  const newMonthlyBill = Math.max(parsedBill - results.monthlySavings, 0);
  const billIsValid = Number.isFinite(parsedBill) && parsedBill > 0;

  return (
    <Section>
      <Container width="calculator">
        <SectionHeader
          id="calculator-heading"
          headingLevel="h1"
          title="Savings Calculator"
          description="Enter your details below — the estimate updates instantly."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Input
              label="Monthly Electricity Bill (₹)"
              type="number"
              inputMode="decimal"
              min={0}
              value={monthlyBill}
              onChange={(event) => {
                setMonthlyBill(event.target.value);
              }}
              error={!billIsValid ? "Please enter a monthly bill greater than zero." : undefined}
            />
            <Select
              label="Property Type"
              options={PROPERTY_TYPE_OPTIONS}
              value={propertyType}
              onChange={(event) => {
                setPropertyType(event.target.value as PropertyType);
              }}
            />
            <Select
              label="Roof Type"
              options={ROOF_TYPE_OPTIONS}
              value={roofType}
              onChange={(event) => {
                setRoofType(event.target.value as RoofType);
              }}
            />

            {billIsValid ? (
              <div className="mt-2">
                <p className="text-caption text-ink-muted">Estimated monthly bill, before and after solar</p>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-caption text-ink-muted">Before</span>
                    <div className="h-3 flex-1 rounded-full bg-line">
                      <div className="h-3 rounded-full bg-ink-muted" style={{ width: "100%" }} />
                    </div>
                    <span className="w-24 shrink-0 text-right text-caption font-medium text-ink">
                      {formatRupees(parsedBill)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-caption text-ink-muted">After</span>
                    <div className="h-3 flex-1 rounded-full bg-line">
                      <div
                        className="h-3 rounded-full bg-mercury transition-[width] duration-slow"
                        style={{ width: `${Math.min((newMonthlyBill / parsedBill) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="w-24 shrink-0 text-right text-caption font-medium text-ink">
                      {formatRupees(newMonthlyBill)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultStat label="Estimated System Size">{animatedSystemSize.toFixed(1)} kW</ResultStat>
            <ResultStat label="Payback Period">{animatedPayback.toFixed(1)} yrs</ResultStat>
            <ResultStat label="Monthly Savings">{formatRupees(animatedMonthlySavings)}</ResultStat>
            <ResultStat label="Annual Savings">{formatRupees(animatedAnnualSavings)}</ResultStat>
            <ResultStat label="Lifetime Savings (25 yr, net)">{formatRupees(animatedLifetimeSavings)}</ResultStat>
            <ResultStat label="CO₂ Reduction / Year">{animatedCo2.toFixed(1)} t</ResultStat>
          </div>
        </div>

        <p className="mt-8 text-caption text-ink-muted">
          Estimates use illustrative average tariffs and generation assumptions, not your actual utility rate — they
          are a starting point, not a quote. A site visit determines your final system design and pricing.
        </p>

        <div className="mt-8 flex justify-center">
          <Button to={ROUTE_PATHS.contact}>Get Detailed Proposal</Button>
        </div>
      </Container>
    </Section>
  );
}
