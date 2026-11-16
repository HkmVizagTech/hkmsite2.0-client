import GovernanceView from "@/components/governance/GovernanceView";
import { pageSeo } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

const baseMetadata = pageSeo({
  title: "Governance: Governing Council of the Hare Krishna Movement",
  description:
    "Meet the Governing Council of the Hare Krishna Movement, the senior devotees who guide its temples, Akshaya Patra and seva across India, including ISKCON Gambheeram Visakhapatnam.",
  path: "/governance",
});

export default function GovernancePage() {
  return <GovernanceView />;
}

export const generateMetadata = localized(baseMetadata);
