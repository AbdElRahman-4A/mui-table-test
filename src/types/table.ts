export type TableHeader = {
  id: string;
  text: string;
  align: "left" | "center" | "right";
  numeric?: boolean;
  sortable?: boolean;
};
