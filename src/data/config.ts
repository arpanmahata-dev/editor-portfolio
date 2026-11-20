export const siteConfig = {
  name: "YOUR NAME",
  role: "Video Editor & Motion Designer",
  accent: "oklch(0.91 0.22 120)",
  showreelUrl: "",
  location: "India",
  availability: "Available worldwide",
  software: [
    "Premiere Pro",
    "After Effects",
    "DaVinci Resolve",
    "Photoshop",
    "Blender",
    "Audition",
  ],
  socials: {
    youtube: "",
    instagram: "",
    linkedin: "",
    behance: "",
    email: "",
  },
} as const;

export const pricing = {
  packages: [
    {
      name: "Video Editing",
      price: "₹2,500",
      features: [
        "Basic editing",
        "Cuts & pacing",
        "Basic audio cleanup",
        "Basic color correction",
        "Music",
        "1 revision",
      ],
    },
    {
      name: "Creator",
      price: "₹5,000",
      featured: true,
      features: [
        "Advanced editing",
        "B-roll",
        "Sound design",
        "Captions",
        "Motion graphics",
        "Color grading",
        "2 revisions",
      ],
    },
    {
      name: "Advanced",
      price: "₹10,000",
      features: [
        "Complex storytelling",
        "Advanced motion graphics",
        "VFX",
        "Advanced sound design",
        "Color grading",
        "3 revisions",
      ],
    },
  ],
  specialties: [
    ["Gaming", "₹3,000"],
    ["VFX", "₹2,000 / shot"],
    ["Motion Graphics", "₹1,500"],
    ["Custom Project", "Contact for quote"],
  ],
  addons: [
    ["Thumbnail", "₹500+"],
    ["YouTube Short", "₹800+"],
    ["Advanced Captions", "₹500+"],
    ["Motion Graphics", "₹1,000+"],
    ["VFX Shot", "₹2,000+"],
    ["Rush Delivery", "+30%"],
    ["Extra Revision", "₹500"],
  ],
} as const;
