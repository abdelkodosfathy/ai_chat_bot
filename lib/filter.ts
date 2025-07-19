import { units, Unit } from "./units";

export function filterUnits(userInput: string): Unit[] {
  console.log("filterUnits: ", userInput);
  
  
  let areaMatch = userInput.match(/(\d{2,3}) ?م(تر)?/); // زي "95 متر"
  let floorMatch = userInput.match(/الدور [^\s]+/); // زي "الدور الأرضي"

  const area = areaMatch ? parseInt(areaMatch[1]) : null;
  const floor = floorMatch ? floorMatch[0] : null;

  return units.filter((unit) => {
    const areaMatch = area ? unit.area === area : true;
    const floorMatch = floor ? unit.floor === floor : true;
    return areaMatch && floorMatch;
  });
}



export function getUnitDetails(areaString: string, units: Unit[]) {
  console.log("getUnitDetails: ",areaString, units);

  
  const area = parseInt(areaString.trim());

  if (isNaN(area)) return null;

  const matchedUnit = units.find((unit) => unit.area === area);
  return matchedUnit || null;

  
}



type Booking = {
  name: string;
  phone: string;
  unit_id: string;
};

export function bookUnit(data: Booking, units: Unit[]) {
  console.log("bookUnit: ", data, units);

  const unit = units.find((u) => u.id === data.unit_id);
  if (!unit) return { success: false, message: "الوحدة غير موجودة" };

  // وهميًا فقط – تقدر تحفظه في ملف JSON أو قاعدة بيانات حقيقية لاحقًا
  console.log("📦 تم حجز الوحدة:", {
    clientName: data.name,
    phone: data.phone,
    unitId: data.unit_id,
    unitDetails: unit,
  });


  return {
    success: true,
    message: `تم حجز الوحدة ${unit.area}م بنجاح باسم ${data.name}. سنتواصل معك على ${data.phone}`,
  };
}


type Query = {
  area?: string; // مثال: "90-120"
  price?: string; // مثال: "15000-20000"
};

export function getData(query: Query, units: Unit[]) {
  console.log("getData: ", query,units);
  
  
  let results = [...units];

  // ✅ فلترة حسب المساحة
  if (query.area) {
    const [min, max] = query.area.split("-").map((v) => parseFloat(v.trim()));
    results = results.filter((u) => u.area >= min && u.area <= max);
  }

  // ✅ فلترة حسب السعر/متر
  if (query.price) {
    const [min, max] = query.price.split("-").map((v) => parseFloat(v.trim()));
    results = results.filter((u) => u.pricePerMeter >= min && u.pricePerMeter <= max);
  }

  
  
  return results;
}
