export const ONBOARDING_CONFIG = {
  // Whether onboarding is mandatory for new users
  isMandatory: true,

  // Whether users can skip individual steps
  allowSkipSteps: false,

  // Onboarding steps configuration
  steps: {
    profile: {
      enabled: true,
      required: false,
    },
    role: {
      enabled: true,
      required: true,
    },
    interests: {
      enabled: true,
      required: false,
    },
    location: {
      enabled: true,
      required: false,
    },
  },
} as const;

export const INTEREST_OPTIONS = [
  "Sports",
  "Music",
  "Art",
  "Technology",
  "Food",
  "Travel",
  "Fashion",
  "Gaming",
  "Fitness",
  "Photography",
  "Reading",
  "Writing",
  "Dance",
  "Movies",
  "Nature",
] as const;

export type InterestOption = (typeof INTEREST_OPTIONS)[number];
