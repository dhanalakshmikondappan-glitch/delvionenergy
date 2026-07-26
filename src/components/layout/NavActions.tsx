import { Button } from "~/components/buttons/Button";
import { COMPANY } from "~/constants/company";
import { ROUTE_PATHS } from "~/constants/routePaths";

interface NavActionsProps {
  inverse?: boolean;
}

/** MASTER.md §10: primary CTA "Get Free Consultation", secondary "Call Now". */
export function NavActions({ inverse = false }: NavActionsProps) {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Button href={`tel:${COMPANY.phone}`} variant="secondary" inverse={inverse}>
        Call Now
      </Button>
      <Button to={ROUTE_PATHS.contact}>Get Free Consultation</Button>
    </div>
  );
}
