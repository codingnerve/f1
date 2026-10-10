import type { CircuitFacts, CircuitGeometry, CircuitSlug } from "@/types/circuit";

import * as autodromoHermanosRodriguez from "./autodromo-hermanos-rodriguez";
import * as circuitOfTheAmericas from "./circuit-of-the-americas";
import * as interlagos from "./interlagos";
import * as lasVegasStripCircuit from "./las-vegas-strip-circuit";
import * as lusailInternationalCircuit from "./lusail-international-circuit";
import * as yasMarinaCircuit from "./yas-marina-circuit";

export const circuitGeometries: Record<CircuitSlug, CircuitGeometry> = {
  "circuit-of-the-americas": circuitOfTheAmericas.geometry,
  "autodromo-hermanos-rodriguez": autodromoHermanosRodriguez.geometry,
  interlagos: interlagos.geometry,
  "las-vegas-strip-circuit": lasVegasStripCircuit.geometry,
  "lusail-international-circuit": lusailInternationalCircuit.geometry,
  "yas-marina-circuit": yasMarinaCircuit.geometry,
};

export const circuitFacts: Record<CircuitSlug, CircuitFacts> = {
  "circuit-of-the-americas": circuitOfTheAmericas.facts,
  "autodromo-hermanos-rodriguez": autodromoHermanosRodriguez.facts,
  interlagos: interlagos.facts,
  "las-vegas-strip-circuit": lasVegasStripCircuit.facts,
  "lusail-international-circuit": lusailInternationalCircuit.facts,
  "yas-marina-circuit": yasMarinaCircuit.facts,
};
