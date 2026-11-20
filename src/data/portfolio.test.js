import { describe, expect, test } from "bun:test";
import { pricing } from "./config";
import { inquirySchema } from "./inquiry";
import { resolveMedia } from "./media";

describe("starting prices and revisions", () => {
  test("video editing starts at ₹2,500 with one revision", () => {
    expect(pricing.packages[0]?.price).toBe("₹2,500");
    expect(pricing.packages[0]?.features).toContain("1 revision");
  });
  test("creator starts at ₹5,000 with two revisions", () => {
    expect(pricing.packages[1]?.price).toBe("₹5,000");
    expect(pricing.packages[1]?.features).toContain("2 revisions");
  });
  test("advanced starts at ₹10,000 with three revisions", () => {
    expect(pricing.packages[2]?.price).toBe("₹10,000");
    expect(pricing.packages[2]?.features).toContain("3 revisions");
  });
  test("gaming starts at ₹3,000", () => expect(pricing.specialties[0]?.[1]).toBe("₹3,000"));
  test("VFX starts at ₹2,000 per shot", () =>
    expect(pricing.specialties[1]?.[1]).toBe("₹2,000 / shot"));
  test("motion graphics starts at ₹1,500", () =>
    expect(pricing.specialties[2]?.[1]).toBe("₹1,500"));
  test("rush delivery adds 30 percent", () =>
    expect(pricing.addons.find(([name]) => name === "Rush Delivery")?.[1]).toBe("+30%"));
  for (const [name, value] of [
    ["Thumbnail", "₹500+"],
    ["YouTube Short", "₹800+"],
    ["Advanced Captions", "₹500+"],
    ["Motion Graphics", "₹1,000+"],
    ["VFX Shot", "₹2,000+"],
    ["Extra Revision", "₹500"],
  ]) {
    test(`${name} starting price`, () =>
      expect(pricing.addons.find(([item]) => item === name)?.[1]).toBe(value));
  }
});
test("inquiry rejects invalid email and reference schemes", () => {
  const valid = {
    name: "Visitor",
    email: "visitor@example.com",
    projectType: "Gaming",
    budget: "Not sure yet",
    deadline: "Next month",
    description: "A cinematic gameplay edit",
    reference: "",
  };
  expect(inquirySchema.safeParse(valid).success).toBe(true);
  expect(inquirySchema.safeParse({ ...valid, email: "invalid" }).success).toBe(false);
  expect(inquirySchema.safeParse({ ...valid, reference: "javascript:alert(1)" }).success).toBe(
    false,
  );
});
test("media supports YouTube shorts, local MP4 and Vimeo without Instagram scraping", () => {
  expect(resolveMedia("https://youtube.com/shorts/abcdefghijk")).toEqual({
    kind: "youtube",
    url: "https://www.youtube-nocookie.com/embed/abcdefghijk",
  });
  expect(resolveMedia("/showreel.mp4").kind).toBe("video");
  expect(resolveMedia("https://vimeo.com/123456").kind).toBe("vimeo");
  expect(resolveMedia("https://instagram.com/reel/example").kind).toBe("instagram");
  expect(resolveMedia("javascript:alert(1)").kind).toBe("none");
});
