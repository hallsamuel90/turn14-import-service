export interface Turn14Brand {
  id: string;
  type: string;
  attributes: Turn14BrandAttribute;
}

interface Turn14BrandAttribute {
  name: string;
  AAIA: string[];
}
