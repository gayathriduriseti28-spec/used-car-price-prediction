const carImages = {
  "toyota camry": "/cars/camry.png",
  "bmw x3": "/cars/bmw.png",
  "honda accord": "/cars/honda.png",
  "hyundai i20": "/cars/hyundai.png",
  "ford mustang": "/cars/mustang.png",
};

export function getCarImage(brand, model) {
  const key = `${brand || ""} ${model || ""}`
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  console.log("Car image key:", key);

  return carImages[key] || "/cars/default-car.png";
}