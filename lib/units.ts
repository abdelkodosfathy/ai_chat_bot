export type InstallmentPlan = {
  years: number;
  downPaymentPercent: number;
};

export type Unit = {
  id: string;
  area: number;
  pricePerMeter: number;
  floor: string;
  image_url?: string;
  maintenanceFeePercent: number;
  installmentPlans: InstallmentPlan[];
};


const standardInstallments: InstallmentPlan[] = [
  { years: 5, downPaymentPercent: 10 },
  { years: 6, downPaymentPercent: 15 },
  { years: 7, downPaymentPercent: 20 },
  { years: 8, downPaymentPercent: 25 },
];

export const units: Unit[] = [
  {
    id: "unit-001",
    area: 95,
    pricePerMeter: 18000,
    image_url: "95.png",
    floor: "الدور الأرضي",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,
  },
  {
    id: "unit-002",
    area: 138,
    pricePerMeter: 18000,
    image_url: "138.png",
    floor: "الدور الأرضي",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,

  },
  {
    id: "unit-003",
    area: 139,
    pricePerMeter: 18000,
    image_url: "139.png",
    floor: "الدور الأرضي",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,

  },
  {
    id: "unit-004",
    area: 140,
    pricePerMeter: 19000,
    image_url: "140.png",
    floor: "متكرر",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,

  },
  {
    id: "unit-005",
    area: 147,
    pricePerMeter: 19000,
    image_url: "147.png",
    floor: "متكرر",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,

  },
  {
    id: "unit-006",
    area: 148,
    pricePerMeter: 19000,
    image_url: "148.png",
    floor: "متكرر",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,

  },
  {
    id: "unit-007",
    area: 98,
    pricePerMeter: 18000,
    image_url: "98.png",
    floor: "الدور الارضي",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,
  },
  {
    id: "unit-008",
    area: 110,
    pricePerMeter: 19000,
    image_url: "110.png",
    floor: "متكرر",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,
  },
  {
    id: "unit-009",
    area: 131,
    pricePerMeter: 18000,
    image_url: "131.png",
    floor: "متكرر",
    maintenanceFeePercent: 5,
    installmentPlans: standardInstallments,
  },
];
