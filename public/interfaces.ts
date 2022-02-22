export interface ObjProps {
  id: number;
  name: string;
  position: [number, number];
  anchor: [number, number];
  rotation: number;
  scale: [number, number];
  color: [number, number, number, number];
  originalColor: [number, number, number, number];
  length: number;
  va: Array<number>;
  type: number;
  objType: number;
  projectionMatrix: Array<number>;
}

export interface AppData {
  objects: ObjProps[];
}

export interface Drawables {
  id: number;
  name: string;
  vertices: number[];
  method: any;
  n: any;
  type: string
  points: number[];
}


