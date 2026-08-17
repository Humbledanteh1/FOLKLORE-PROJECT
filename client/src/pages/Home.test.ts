import { describe, expect, it } from "vitest";
import { plans } from "./Home";

describe("Folklore billing plans", () => {
  it("keeps the public archive available and paid-plan checkout disabled", () => {
    const fieldNotes = plans.find((plan) => plan.key === "field-notes");
    const paidPlans = plans.filter((plan) => plan.key !== "field-notes");

    expect(fieldNotes?.href).toBe("/agents#agent-library");
    expect(fieldNotes?.price).toBe("$0");
    expect(paidPlans).toHaveLength(2);
    expect(paidPlans.every((plan) => plan.href === undefined)).toBe(true);
  });

  it("describes each plan with access information instead of a payment action", () => {
    expect(plans.every((plan) => plan.features.length >= 3)).toBe(true);
    expect(plans.some((plan) => plan.price === "Opening soon")).toBe(true);
  });
});
