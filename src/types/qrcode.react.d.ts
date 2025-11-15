declare module 'qrcode.react' {
  import { Component } from 'react';

  export interface QRCodeSVGProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    fgColor?: string;
    bgColor?: string;
    imageSettings?: {
      src: string;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
  }

  export class QRCodeSVG extends Component<QRCodeSVGProps> {}
}

