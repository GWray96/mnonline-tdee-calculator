"use client";

import { useState } from "react";

type Step = 1 | 2 | 3 | 4;
type Unit = "metric" | "imperial";
type Gender = "male" | "female";

type Results = {
  firstName: string;
  email: string;
  cutCals: number;
  goalCals: number;
  bulkCals: number;
  bmr: number;
  tdee: number;
  bmi: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  goalLabel: string;
  goalDesc: string;
  ctaHeadline: string;
  ctaBody: string;
};

export default function CalculatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit>("metric");
  const [selectedGender, setSelectedGender] = useState<Gender>("male");

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [weightSt, setWeightSt] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("maintain");
  const [calcError, setCalcError] = useState(false);

  const [results, setResults] = useState<Results | null>(null);

  function showStep(n: Step) {
    setStep(n);
  }

  // Step 1 → validate stats before moving to details
  function goToStep2() {
    const ageVal = parseFloat(age);

    let weightKgVal: number;
    if (selectedUnit === "metric") {
      weightKgVal = parseFloat(weightKg);
    } else {
      const st = parseFloat(weightSt) || 0;
      const lbs = parseFloat(weightLbs) || 0;
      weightKgVal = st * 6.35029 + lbs * 0.453592;
      if (!st && !lbs) weightKgVal = NaN;
    }

    let heightCmVal: number;
    if (selectedUnit === "metric") {
      heightCmVal = parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inVal = parseFloat(heightIn) || 0;
      heightCmVal = (ft * 12 + inVal) * 2.54;
      if (!ft) heightCmVal = NaN;
    }

    if (!ageVal || isNaN(weightKgVal) || isNaN(heightCmVal) || !weightKgVal || !heightCmVal) {
      setCalcError(true);
      return;
    }

    setCalcError(false);
    showStep(2);
  }

  // Step 2 → validate details then calculate
  function submitDetailsAndCalculate() {
    const nameVal = firstName.trim();
    const emailVal = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    setNameError(!nameVal);
    setEmailError(!emailVal || !emailValid);
    if (!nameVal || !emailVal || !emailValid) return;
    calculate();
  }

  function calculate() {
    const ageVal = parseFloat(age);
    const activityVal = parseFloat(activity);
    const bodyFatVal = parseFloat(bodyFat);

    let weightKgVal: number;
    if (selectedUnit === "metric") {
      weightKgVal = parseFloat(weightKg);
    } else {
      const st = parseFloat(weightSt) || 0;
      const lbs = parseFloat(weightLbs) || 0;
      weightKgVal = st * 6.35029 + lbs * 0.453592;
      if (!st && !lbs) weightKgVal = NaN;
    }

    let heightCmVal: number;
    if (selectedUnit === "metric") {
      heightCmVal = parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inVal = parseFloat(heightIn) || 0;
      heightCmVal = (ft * 12 + inVal) * 2.54;
      if (!ft) heightCmVal = NaN;
    }

    if (!ageVal || isNaN(weightKgVal) || isNaN(heightCmVal) || !weightKgVal || !heightCmVal) {
      setCalcError(true);
      return;
    }

    setCalcError(false);
    showStep(3);

    setTimeout(() => {
      let bmr: number;
      if (!isNaN(bodyFatVal) && bodyFatVal > 0) {
        bmr = 370 + 21.6 * weightKgVal * (1 - bodyFatVal / 100);
      } else {
        bmr =
          selectedGender === "male"
            ? 10 * weightKgVal + 6.25 * heightCmVal - 5 * ageVal + 5
            : 10 * weightKgVal + 6.25 * heightCmVal - 5 * ageVal - 161;
      }

      const tdee = Math.round(bmr * activityVal);
      const bmrRound = Math.round(bmr);
      const cutCals = Math.round(tdee * 0.8);
      const bulkCals = Math.round(tdee * 1.1);
      const bmiVal = (weightKgVal / Math.pow(heightCmVal / 100, 2)).toFixed(1);

      let goalCals: number;
      let goalLabelText: string;
      let goalDescText: string;
      let ctaH: string;
      let ctaB: string;

      if (goal === "cut") {
        goalCals = cutCals;
        goalLabelText = "✦ Fat Loss";
        goalDescText = "~500 kcal deficit";
        ctaH = "You Know Your Deficit.<br>Now Execute It.";
        ctaB =
          "Most guys have this number and do nothing with it. Maciej will give you a plan that fits your life, hold you accountable every week, and make sure this is the last time you start over.";
      } else if (goal === "bulk") {
        goalCals = bulkCals;
        goalLabelText = "✦ Muscle Gain";
        goalDescText = "~250 kcal surplus";
        ctaH = "You've Got the Target.<br>Let's Build Something Real.";
        ctaB =
          "Calories are step one. Maciej will programme your training, dial in your nutrition, and track your progress week by week so you're actually building — not just eating more.";
      } else {
        goalCals = tdee;
        goalLabelText = "✦ Maintenance";
        goalDescText = "Recomp / maintain";
        ctaH = "Now You Know the Numbers.<br>Want the Full Plan?";
        ctaB =
          "Maciej will build your exact training and nutrition programme, track your progress every week, and hold you accountable until you get there.";
      }

      const proteinG = Math.round(weightKgVal * 2.2);
      const fatG = Math.round((goalCals * 0.25) / 9);
      const carbsG = Math.max(0, Math.round((goalCals - proteinG * 4 - fatG * 9) / 4));

      const first = firstName.trim().split(" ")[0];
      const emailVal = email.trim();

      setResults({
        firstName: first,
        email: emailVal,
        cutCals,
        goalCals,
        bulkCals,
        bmr: bmrRound,
        tdee,
        bmi: bmiVal,
        proteinG,
        carbsG,
        fatG,
        goalLabel: goalLabelText,
        goalDesc: goalDescText,
        ctaHeadline: ctaH,
        ctaBody: ctaB,
      });

      showStep(4);

      fetch("/api/ghl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first,
          email: emailVal,
          goal,
          goalCals,
          cutCals,
          bulkCals,
          tdee,
          bmr: bmrRound,
          bmi: bmiVal,
          proteinG,
          carbsG,
          fatG,
          gender: selectedGender,
          unit: selectedUnit,
        }),
      }).catch((err) => console.warn("GHL error:", err));
    }, 1800);
  }

  const activeDot = step === 4 ? 3 : step;

  return (
    <div className="relative z-10 mx-auto max-w-[520px] px-5 pb-16">
      <header className="pt-7 text-center">
        <div className="font-(family-name:--font-bebas) text-[1.6rem] tracking-[0.15em] text-(--orange)">
          MNONLINE
        </div>
        <div className="mt-0.5 text-xs tracking-[0.2em] uppercase text-(--muted)">
          Build Your Body. Build Your Bag.
        </div>
      </header>

      <div className="my-10 text-center">
        <div className="mb-3 font-(family-name:--font-barlow-condensed) text-xs tracking-[0.25em] uppercase text-(--orange)">
          Free Tool
        </div>
        <h1 className="font-(family-name:--font-bebas) text-[clamp(3rem,10vw,4.2rem)] leading-[0.95] tracking-[0.02em]">
          Find Out Exactly{" "}
          <span className="block text-(--orange)">
            How Many Calories
            <br />
            You Need
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-[380px] text-[0.95rem] font-light leading-relaxed text-(--muted)">
          Stop guessing. Get your personalised daily calorie target and macros in 60 seconds —
          sent straight to your inbox.
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2">
        <div
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            1 < activeDot ? "bg-(--orange-dim)" : 1 === activeDot ? "scale-[1.3] bg-(--orange)" : "bg-(--border)"
          }`}
        />
        <div
          className={`h-px w-10 transition-colors duration-300 ${1 < activeDot ? "bg-(--orange-dim)" : "bg-(--border)"}`}
        />
        <div
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            2 < activeDot ? "bg-(--orange-dim)" : 2 === activeDot ? "scale-[1.3] bg-(--orange)" : "bg-(--border)"
          }`}
        />
        <div
          className={`h-px w-10 transition-colors duration-300 ${2 < activeDot ? "bg-(--orange-dim)" : "bg-(--border)"}`}
        />
        <div
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            3 < activeDot ? "bg-(--orange-dim)" : 3 === activeDot ? "scale-[1.3] bg-(--orange)" : "bg-(--border)"
          }`}
        />
      </div>

      {/* Step 2 — Your Details */}
      {step === 2 && (
        <div
          className="animate-fadeUp rounded border border-(--border) bg-(--surface) p-8"
          style={{ boxShadow: "none" }}
        >
          <div className="relative overflow-hidden">
            <div className="absolute left-0 right-0 top-0 h-0.5 bg-(--orange)" />
            <div className="font-(family-name:--font-barlow-condensed) mb-6 text-lg font-bold tracking-widest uppercase">
              Step 2 — Your Details
            </div>

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. James"
                autoComplete="given-name"
                className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 font-(family-name:--font-barlow) text-base text-foreground outline-none transition-colors placeholder:text-(--muted) focus:border-(--orange)"
              />
              {nameError && (
                <p className="mt-1.5 text-[0.78rem] text-[#f87171]">Please enter your name.</p>
              )}
            </div>

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 font-(family-name:--font-barlow) text-base text-foreground outline-none transition-colors placeholder:text-(--muted) focus:border-(--orange)"
              />
              {emailError && (
                <p className="mt-1.5 text-[0.78rem] text-[#f87171]">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={submitDetailsAndCalculate}
              className="mt-2 w-full rounded bg-(--orange) py-4 font-(family-name:--font-bebas) text-xl tracking-[0.12em] text-white transition-colors hover:bg-[#e04a08] active:scale-[0.99]"
            >
              Get My Results →
            </button>

            <div className="mt-3.5 flex items-center justify-center gap-1 text-center text-[0.72rem] leading-relaxed text-(--muted)">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="inline-block">
                <rect
                  x="1"
                  y="5"
                  width="9"
                  height="8"
                  rx="1.5"
                  stroke="#888"
                  strokeWidth="1.2"
                />
                <path
                  d="M3.5 5V3.5a2 2 0 0 1 4 0V5"
                  stroke="#888"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              Your results will be emailed to you. No spam. Unsubscribe anytime.
            </div>
          </div>
        </div>
      )}

      {/* Step 1 — Your Stats */}
      {step === 1 && (
        <div
          className="animate-fadeUp rounded border border-(--border) bg-(--surface) p-8"
          style={{ boxShadow: "none" }}
        >
          <div className="relative overflow-hidden">
            <div className="absolute left-0 right-0 top-0 h-0.5 bg-(--orange)" />
            <div className="font-(family-name:--font-barlow-condensed) mb-6 text-lg font-bold tracking-widest uppercase">
              Step 1 — Your Stats
            </div>

            <div className="mb-[22px] flex overflow-hidden rounded border border-(--border) bg-(--surface2)">
              <button
                type="button"
                onClick={() => setSelectedUnit("metric")}
                className={`flex-1 px-4 py-2.5 font-(family-name:--font-barlow-condensed) text-sm font-bold uppercase tracking-widest transition-colors ${
                  selectedUnit === "metric" ? "bg-(--orange) text-white" : "text-(--muted)"
                }`}
              >
                Metric (kg / cm)
              </button>
              <button
                type="button"
                onClick={() => setSelectedUnit("imperial")}
                className={`flex-1 px-4 py-2.5 font-(family-name:--font-barlow-condensed) text-sm font-bold uppercase tracking-widest transition-colors ${
                  selectedUnit === "imperial" ? "bg-(--orange) text-white" : "text-(--muted)"
                }`}
              >
                Imperial (st / ft)
              </button>
            </div>

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                Gender
              </label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedGender("male")}
                  className={`flex-1 rounded border px-4 py-3 font-(family-name:--font-barlow-condensed) text-sm font-bold uppercase tracking-widest transition-colors ${
                    selectedGender === "male"
                      ? "border-(--orange) bg-(--orange) text-white"
                      : "border-(--border) bg-(--surface2) text-(--muted)"
                  }`}
                >
                  ♂ Male
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGender("female")}
                  className={`flex-1 rounded border px-4 py-3 font-(family-name:--font-barlow-condensed) text-sm font-bold uppercase tracking-widest transition-colors ${
                    selectedGender === "female"
                      ? "border-(--orange) bg-(--orange) text-white"
                      : "border-(--border) bg-(--surface2) text-(--muted)"
                  }`}
                >
                  ♀ Female
                </button>
              </div>
            </div>

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                Age
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min={15}
                  max={80}
                  className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                  yrs
                </span>
              </div>
            </div>

            {selectedUnit === "metric" && (
              <div className="mb-[18px]">
                <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  Weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="80"
                    min={40}
                    max={250}
                    className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                    kg
                  </span>
                </div>
              </div>
            )}

            {selectedUnit === "imperial" && (
              <div className="mb-[18px]">
                <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  Weight
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="relative">
                    <input
                      type="number"
                      value={weightSt}
                      onChange={(e) => setWeightSt(e.target.value)}
                      placeholder="12"
                      min={5}
                      max={35}
                      className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                      st
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(e.target.value)}
                      placeholder="7"
                      min={0}
                      max={13}
                      className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                      lbs
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedUnit === "metric" && (
              <div className="mb-[18px]">
                <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  Height
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="178"
                    min={140}
                    max={220}
                    className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                    cm
                  </span>
                </div>
              </div>
            )}

            {selectedUnit === "imperial" && (
              <div className="mb-[18px]">
                <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="relative">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      min={4}
                      max={7}
                      className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                      ft
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="10"
                      min={0}
                      max={11}
                      className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                      in
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                Body Fat %{" "}
                <span className="text-[0.65rem] text-[#555]">(optional — improves accuracy)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="e.g. 18"
                  min={5}
                  max={50}
                  className="w-full rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-11 font-(family-name:--font-barlow) text-base text-foreground outline-none placeholder:text-(--muted) focus:border-(--orange)"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-(--muted)">
                  %
                </span>
              </div>
            </div>

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full appearance-none rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-10 font-(family-name:--font-barlow) text-base text-foreground outline-none focus:border-(--orange) [&>option]:bg-(--surface2)"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                <option value="1.2">Sedentary (desk job, no exercise)</option>
                <option value="1.375">Lightly Active (1–3 workouts/week)</option>
                <option value="1.55">Moderately Active (3–5 workouts/week)</option>
                <option value="1.725">Very Active (6–7 workouts/week)</option>
                <option value="1.9">Extremely Active (athlete / physical job)</option>
              </select>
            </div>

            <div className="mb-[18px]">
              <label className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                Your Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full appearance-none rounded border border-(--border) bg-(--surface2) px-4 py-3 pr-10 font-(family-name:--font-barlow) text-base text-foreground outline-none focus:border-(--orange) [&>option]:bg-(--surface2)"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                <option value="cut">Lose Fat</option>
                <option value="maintain">Maintain / Recomp</option>
                <option value="bulk">Build Muscle</option>
              </select>
            </div>

            {calcError && (
              <p className="mb-3 text-[0.78rem] text-[#f87171]">
                Please fill in your age, weight, and height.
              </p>
            )}
            <button
              type="button"
              onClick={goToStep2}
              className="mt-2 w-full rounded bg-(--orange) py-4 font-(family-name:--font-bebas) text-xl tracking-[0.12em] text-white transition-colors hover:bg-[#e04a08] active:scale-[0.99]"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Loading */}
      {step === 3 && (
        <div
          className="animate-fadeUp rounded border border-(--border) bg-(--surface) p-10"
          style={{ boxShadow: "none" }}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-(--border) border-t-(--orange)" />
            <p className="font-(family-name:--font-barlow-condensed) text-sm uppercase tracking-[0.15em] text-(--muted)">
              Calculating your numbers...
            </p>
          </div>
        </div>
      )}

      {/* Step 4 - Results */}
      {step === 4 && results && (
        <div className="animate-fadeUp">
          <div className="mb-7 text-center">
            <div className="font-(family-name:--font-bebas) text-3xl tracking-[0.05em]">
              Here&apos;s Your Plan, <span className="text-(--orange)">{results.firstName}</span>
            </div>
            <p className="mt-1.5 text-sm text-(--muted)">Based on your stats and goal</p>
          </div>

          <div className="mb-3.5 rounded border border-(--border) bg-(--surface) p-8">
            <div className="font-(family-name:--font-barlow-condensed) mb-6 text-lg font-bold tracking-widest uppercase">
              Daily Calorie Targets
            </div>
            <div className="mb-6 grid grid-cols-3 gap-2.5 max-[400px]:grid-cols-1">
              <div className="rounded border border-(--border) bg-(--surface2) p-4 text-center">
                <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  Fat Loss
                </div>
                <div className="font-(family-name:--font-bebas) text-3xl text-foreground">
                  {results.cutCals.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[0.7rem] tracking-widest text-(--muted)">
                  kcal / day
                </div>
                <div className="mt-1.5 text-[0.72rem] leading-snug text-(--muted)">
                  Deficit for steady fat loss
                </div>
              </div>
              <div className="rounded border border-(--orange) bg-[var(--orange)/0.07] p-4 text-center">
                <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  {results.goalLabel}
                </div>
                <div className="font-(family-name:--font-bebas) text-3xl text-(--orange)">
                  {results.goalCals.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[0.7rem] tracking-widest text-(--muted)">
                  kcal / day
                </div>
                <div className="mt-1.5 text-[0.72rem] leading-snug text-(--muted)">
                  {results.goalDesc}
                </div>
              </div>
              <div className="rounded border border-(--border) bg-(--surface2) p-4 text-center">
                <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-(--muted)">
                  Muscle Gain
                </div>
                <div className="font-(family-name:--font-bebas) text-3xl text-foreground">
                  {results.bulkCals.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[0.7rem] tracking-widest text-(--muted)">
                  kcal / day
                </div>
                <div className="mt-1.5 text-[0.72rem] leading-snug text-(--muted)">
                  Surplus for muscle growth
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2.5 max-[400px]:grid-cols-1">
            <div className="rounded border border-(--border) bg-(--surface2) px-4 py-3.5">
              <div className="text-[0.65rem] uppercase tracking-[0.15em] text-(--muted)">
                BMR (at rest)
              </div>
              <div className="font-(family-name:--font-barlow-condensed) text-xl font-bold text-foreground">
                {results.bmr.toLocaleString()} kcal
              </div>
            </div>
            <div className="rounded border border-(--border) bg-(--surface2) px-4 py-3.5">
              <div className="text-[0.65rem] uppercase tracking-[0.15em] text-(--muted)">
                TDEE (maintenance)
              </div>
              <div className="font-(family-name:--font-barlow-condensed) text-xl font-bold text-foreground">
                {results.tdee.toLocaleString()} kcal
              </div>
            </div>
            <div className="rounded border border-(--border) bg-(--surface2) px-4 py-3.5">
              <div className="text-[0.65rem] uppercase tracking-[0.15em] text-(--muted)">
                BMI
              </div>
              <div className="font-(family-name:--font-barlow-condensed) text-xl font-bold text-foreground">
                {results.bmi}
              </div>
            </div>
            <div className="rounded border border-(--border) bg-(--surface2) px-4 py-3.5">
              <div className="text-[0.65rem] uppercase tracking-[0.15em] text-(--muted)">
                Protein Target
              </div>
              <div className="font-(family-name:--font-barlow-condensed) text-xl font-bold text-foreground">
                {results.proteinG}g / day
              </div>
            </div>
          </div>

          <div className="mb-6 rounded border border-(--border) bg-(--surface2) p-5">
            <div className="mb-4 font-(family-name:--font-barlow-condensed) text-sm font-bold uppercase tracking-[0.15em] text-(--muted)">
              Macro Breakdown (Based on Your Goal)
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-[70px] text-sm font-semibold text-foreground">Protein</div>
                <div className="flex-1 overflow-hidden rounded-full bg-(--border)">
                  <div
                    className="h-1.5 rounded-full bg-[#F5500A] transition-[width] duration-1000"
                    style={{
                      width: `${Math.round((results.proteinG * 4) / results.goalCals * 100)}%`,
                    }}
                  />
                </div>
                <div className="w-[60px] text-right text-sm font-semibold text-foreground">
                  {results.proteinG}g
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[70px] text-sm font-semibold text-foreground">Carbs</div>
                <div className="flex-1 overflow-hidden rounded-full bg-(--border)">
                  <div
                    className="h-1.5 rounded-full bg-[#2563eb] transition-[width] duration-1000"
                    style={{
                      width: `${Math.round((results.carbsG * 4) / results.goalCals * 100)}%`,
                    }}
                  />
                </div>
                <div className="w-[60px] text-right text-sm font-semibold text-foreground">
                  {results.carbsG}g
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[70px] text-sm font-semibold text-foreground">Fat</div>
                <div className="flex-1 overflow-hidden rounded-full bg-(--border)">
                  <div
                    className="h-1.5 rounded-full bg-[#d97706] transition-[width] duration-1000"
                    style={{
                      width: `${Math.round((results.fatG * 9) / results.goalCals * 100)}%`,
                    }}
                  />
                </div>
                <div className="w-[60px] text-right text-sm font-semibold text-foreground">
                  {results.fatG}g
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-[var(--orange)/0.3] bg-linear-to-br from-[var(--orange)/0.12] to-[var(--orange)/0.04] p-6 text-center">
            <h3
              className="font-(family-name:--font-bebas) mb-2.5 text-2xl leading-tight tracking-[0.05em]"
              dangerouslySetInnerHTML={{ __html: results.ctaHeadline }}
            />
            <p className="mb-4 text-sm leading-relaxed text-(--muted)">{results.ctaBody}</p>
            <a
              href="https://tidycal.com/maciej-nowicki/discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-(--orange) px-8 py-3.5 font-(family-name:--font-bebas) text-lg tracking-[0.12em] text-white transition-colors hover:bg-[#e04a08]"
            >
              Book a Free Call with Maciej
            </a>
          </div>

          <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-[#555]">
            These figures are estimates based on established formulas (Mifflin-St Jeor / Katch-McArdle).
            <br />
            Individual results vary. Consult a professional before making significant dietary changes.
          </p>
        </div>
      )}

      <footer className="mt-10 border-t border-(--border) pt-5 text-center text-[0.72rem] tracking-[0.05em] text-[#444]">
        © MNONLINE · mnonlinecoach.com
      </footer>
    </div>
  );
}
