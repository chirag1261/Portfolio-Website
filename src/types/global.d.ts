/* eslint-disable @typescript-eslint/no-explicit-any */

// React Three Fiber types
declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    ambientLight: any;
    mesh: any;
    icosahedronGeometry: any;
    meshBasicMaterial: any;
  }
}

// CSS Modules
declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// SVG
declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// Images
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}
