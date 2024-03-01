export const formatCurrency = (price: number): number | string => {
    const formattedPrice = price.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    return formattedPrice;
  };