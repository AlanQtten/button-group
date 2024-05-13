export type UseTextWidthOptions = {
  text: string | undefined;
  font?: string;
};

export interface UseTextWidthType {
  (options: UseTextWidthOptions): number;
}

let canvasCtx: CanvasRenderingContext2D;
const getContext = () => {
  if (canvasCtx) {
    return canvasCtx;
  }
  const fragment: DocumentFragment = document.createDocumentFragment();
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  fragment.appendChild(canvas);
  canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return canvasCtx;
};

const textWidthGetter: UseTextWidthType = (options) => {
  if (options?.text) {
    const context = getContext();
    context.font = options?.font ?? '16px';

    const metrics = context.measureText(options?.text);
    return metrics.width;
  }

  return NaN;
};

export default textWidthGetter;
