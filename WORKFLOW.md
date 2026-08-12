# WORKFLOW.md: AI Prompting Strategy Comparison

## Executive Summary

This experiment compares two AI-driven feature implementations for a user settings form: Round 1 (a vague, single-sentence prompt) versus Round 2 (a precise prompt with explicit library constraints, file references, and a test-driven verification loop).

---

## 1. Concrete Code Differences

The underlying architecture between both branches differed significantly:

- **Round 1 (**`feature/vague-prompt`**):** Implemented using basic React `useState` hooks for each input field. Form submission relied on standard `e.preventDefault()` with minimal manual check functions. State management was brittle and unscalable.
- **Round 2 (**`feature/precise-prompt`**):** Leveraged `react-hook-form` coupled with `@hookform/resolvers` and `zod` for strict schema validation. Server mutations and state updating were handled cleanly via `@tanstack/react-query`. Styling was fully unified with Tailwind CSS utility classes matching the project's existing design system.

---



## 2. UI, Accessibility & Edge Cases

- **Round 1:** The UI contained noticeable visual bugs - specifically a CSS padding mistake where the form header and subheading text collided overlappingly. The AI hallucinated a "Theme Selection" control that was completely non-functional (selecting a theme triggered no DOM updates or CSS variable shifts). Crucially, form validation was not as thorough as the precise prompt - which required the username to be at least two characters. Accessibility was absent, lacking `aria-invalid`, `aria-describedby`, and structured error messages.
- **Round 2:** Produced a uniform, conventional layout matching the requested fields (`email`, `username`, and `marketingPreferences`). Validation errors triggered dynamically on blur and submit, displaying explicit error messages associated via accessibility tags. Accessibility was definitely improved from the vague prompt as some UI elements had `aria-describedBy` props.
- **A suggested improvement**: Both prompts lead to forms which only check inputs on the event of a submission. For better user experience, it would be better to check the input after focus on the field is removed (when the user moves onto the next field).
---



## 3. Specific AI Mistakes Caught

- **Hallucinated Functional Controls (Round 1):** The model added a theme toggle component in Round 1 that looked functional in the TSX but had zero underlying state or CSS bindings.
- **Layout Collision (Round 1):** The vague AI prompt has an issue with padding near the heading of the form. This caused the subheading to collide with the main heading on wider screens.
- **Bypassed Validation:** Without an explicit schema constraint, the AI in Round 1 created an `onSubmit` handler that did not check if fields were empty or formatted correctly.

---



## 4. Time & Review Effort

- **Round 1 (Vague):** Prompting took **30 seconds**. However, reviewing, spotting broken layout bugs, noticing missing validation, and identifying fake interactive controls took **15 minutes** of manual inspection.
- **Round 2 (Precise):** Writing the detailed prompt took **3 minutes**. Execution and test verification took **2 minutes**. Reviewing the PR took **3 minutes** because the code structure was predictable and verified by passing automated tests.

**Takeaway:** Detailed prompting with structural constraints and test loops drastically cuts down overall engineering and review time despite taking slightly longer to write initially.