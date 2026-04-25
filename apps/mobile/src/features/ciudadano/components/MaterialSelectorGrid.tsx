import { EcoIcons, MaterialChipsRow, type MaterialChipOption } from "../../../design-system";
import type { Material } from "../../reciclador/types";

type MaterialSelectorGridProps = {
  value: Material;
  onChange: (material: Material) => void;
};

const OPCIONES: MaterialChipOption[] = [
  { id: "carton", label: "Cartón", icon: EcoIcons.materialCarton },
  { id: "plastico", label: "Plástico", icon: EcoIcons.materialPlastic },
  { id: "vidrio", label: "Vidrio", icon: EcoIcons.materialGlass },
  { id: "mixto", label: "Mixto", icon: EcoIcons.materialMixto },
];

/** FE-03 — Chips de material (§7.3 design system): teal + blanco al seleccionar. */
export function MaterialSelectorGrid({ value, onChange }: MaterialSelectorGridProps) {
  return (
    <MaterialChipsRow
      options={OPCIONES}
      selectedId={value}
      onSelect={(id) => onChange(id as Material)}
    />
  );
}
