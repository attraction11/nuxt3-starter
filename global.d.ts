type reportVo = {
  event?: string;
  ecommerce: {} | null;
};

interface Window {
  dataLayer: {
    push: (item: reportVo) => void;
  };
  readonly top: any;
}
