type reportVo = {
  event?: string
  ecommerce: {} | null
}

interface Window {
  dataLayer: {
    push: (item: reportVo) => void
  }
}
