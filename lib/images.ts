export interface NicheImageSet {
  hero: string;
  about: string;
  gallery: [string, string, string];
}

export const NICHE_IMAGE_DATABASE: Record<string, NicheImageSet> = {
  dental: {
    hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    ],
  },
  medical: {
    hero: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80",
    ],
  },
  fashion: {
    hero: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80",
    ],
  },
  food: {
    hero: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80",
    ],
  },
  realestate: {
    hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80",
    ],
  },
  beauty: {
    hero: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80",
    ],
  },
  fitness: {
    hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    ],
  },
  automotive: {
    hero: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop&q=80",
    ],
  },
  legal: {
    hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    ],
  },
  tech: {
    hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
    ],
  },
  cleaning: {
    hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&auto=format&fit=crop&q=80",
    ],
  },
  general: {
    hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80",
    ],
  },
};

export function resolveNicheImages(businessType: string, businessName: string): NicheImageSet {
  const combined = `${businessType || ""} ${businessName || ""}`.toLowerCase();

  if (
    combined.includes("dent") ||
    combined.includes("teeth") ||
    combined.includes("tooth") ||
    combined.includes("smile") ||
    combined.includes("oral") ||
    combined.includes("orthodont")
  ) {
    return NICHE_IMAGE_DATABASE.dental;
  }

  if (
    combined.includes("medic") ||
    combined.includes("doctor") ||
    combined.includes("clinic") ||
    combined.includes("hospital") ||
    combined.includes("health") ||
    combined.includes("therap") ||
    combined.includes("optomet")
  ) {
    return NICHE_IMAGE_DATABASE.medical;
  }

  if (
    combined.includes("cloth") ||
    combined.includes("fashion") ||
    combined.includes("tailor") ||
    combined.includes("boutique") ||
    combined.includes("wear") ||
    combined.includes("agbada") ||
    combined.includes("dress") ||
    combined.includes("senator") ||
    combined.includes("attire")
  ) {
    return NICHE_IMAGE_DATABASE.fashion;
  }

  if (
    combined.includes("food") ||
    combined.includes("cater") ||
    combined.includes("restaurant") ||
    combined.includes("kitchen") ||
    combined.includes("bakery") ||
    combined.includes("cafe") ||
    combined.includes("dining") ||
    combined.includes("cook") ||
    combined.includes("barbecue") ||
    combined.includes("shawarma")
  ) {
    return NICHE_IMAGE_DATABASE.food;
  }

  if (
    combined.includes("realt") ||
    combined.includes("estate") ||
    combined.includes("property") ||
    combined.includes("house") ||
    combined.includes("shortlet") ||
    combined.includes("apartment") ||
    combined.includes("developer") ||
    combined.includes("homes")
  ) {
    return NICHE_IMAGE_DATABASE.realestate;
  }

  if (
    combined.includes("hair") ||
    combined.includes("salon") ||
    combined.includes("barber") ||
    combined.includes("spa") ||
    combined.includes("beauty") ||
    combined.includes("makeup") ||
    combined.includes("nail") ||
    combined.includes("skincare") ||
    combined.includes("lashes")
  ) {
    return NICHE_IMAGE_DATABASE.beauty;
  }

  if (
    combined.includes("gym") ||
    combined.includes("fitness") ||
    combined.includes("train") ||
    combined.includes("workout") ||
    combined.includes("pilates") ||
    combined.includes("crossfit") ||
    combined.includes("athlet")
  ) {
    return NICHE_IMAGE_DATABASE.fitness;
  }

  if (
    combined.includes("car") ||
    combined.includes("auto") ||
    combined.includes("mechanic") ||
    combined.includes("detail") ||
    combined.includes("wash") ||
    combined.includes("garage") ||
    combined.includes("motor")
  ) {
    return NICHE_IMAGE_DATABASE.automotive;
  }

  if (
    combined.includes("clean") ||
    combined.includes("laundry") ||
    combined.includes("fumigat") ||
    combined.includes("janitor") ||
    combined.includes("plumb") ||
    combined.includes("electric")
  ) {
    return NICHE_IMAGE_DATABASE.cleaning;
  }

  if (
    combined.includes("law") ||
    combined.includes("legal") ||
    combined.includes("attorney") ||
    combined.includes("consult") ||
    combined.includes("account") ||
    combined.includes("audit") ||
    combined.includes("tax") ||
    combined.includes("finance")
  ) {
    return NICHE_IMAGE_DATABASE.legal;
  }

  if (
    combined.includes("tech") ||
    combined.includes("software") ||
    combined.includes("digital") ||
    combined.includes("agency") ||
    combined.includes("media") ||
    combined.includes("brand") ||
    combined.includes("marketing") ||
    combined.includes("design") ||
    combined.includes("studio")
  ) {
    return NICHE_IMAGE_DATABASE.tech;
  }

  return NICHE_IMAGE_DATABASE.general;
}