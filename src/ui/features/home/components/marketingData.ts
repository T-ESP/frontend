import {
  BrainCircuit, BellRing, LineChart, Truck, Boxes, ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type Feature = { Icon: LucideIcon; title: string; body: string };

/** Fonctionnalités produit — partagées entre la landing et la page /fonctionnalites. */
export const FEATURES: Feature[] = [
  { Icon: BrainCircuit, title: "Prévisions de demande", body: "L'IA analyse votre historique de ventes et anticipe la demande produit par produit pour commander juste." },
  { Icon: BellRing, title: "Alertes intelligentes", body: "Soyez prévenu avant la rupture, avec une quantité de réapprovisionnement déjà calculée." },
  { Icon: LineChart, title: "KPIs produits en temps réel", body: "Scoring, rotation, marge, valeur immobilisée : chaque produit a sa fiche de performance." },
  { Icon: Truck, title: "Multi-fournisseurs", body: "Centralisez vos fournisseurs, comparez les délais et gardez le contact au bon moment." },
  { Icon: Boxes, title: "Inventaire vivant", body: "Stock à jour en continu, recherche instantanée, statuts clairs (en stock, faible, rupture)." },
  { Icon: ShieldCheck, title: "Décisions sécurisées", body: "Des recommandations explicables, basées sur vos vraies données — pas une boîte noire." },
];
