import { Pattern } from "./types";

export type RemoveMaskArgs = {
  value: string;
  pattern: Pattern;
};

export function removeMask({ value, pattern }: RemoveMaskArgs): string {
  let unmaskedValue = "";

  for (
    let patternIndex = 0, valueIndex = 0;
    patternIndex < pattern.length && valueIndex < value.length;

  ) {
    const currentValue = value[valueIndex] as string;
    const currentPattern = pattern[patternIndex] as string | RegExp;

    if (currentPattern instanceof RegExp) {
      if (currentPattern.test(currentValue)) {
        unmaskedValue += currentValue;
        patternIndex++;
      }
      valueIndex++;
    } else {
      patternIndex++;
    }
  }

  return unmaskedValue;
}

export type ApplyMaskArgs = {
  value: string;
  pattern: Pattern;
  maskChar: string;
  partial?: boolean;
};

export function applyMask({
  value,
  pattern,
  maskChar,
  partial = false,
}: ApplyMaskArgs): string {
  let maskedValue = "";

  for (
    let patternIndex = 0, valueIndex = 0;
    patternIndex < pattern.length;
    patternIndex++
  ) {
    const currentValue = value[valueIndex];
    const currentPattern = pattern[patternIndex] as string | RegExp;

    if (partial && !currentValue) {
      break;
    }

    if (typeof currentPattern === "string") {
      maskedValue += currentPattern;
    } else {
      if (currentValue) {
        if (currentPattern.test(currentValue)) {
          maskedValue += currentValue;
        }
        valueIndex++;
      } else {
        maskedValue += maskChar;
      }
    }
  }

  return maskedValue;
}

export type GetPatternStringIndexesArgs = {
  pattern: Pattern;
};

export type GetNextRegExpIndexArgs = {
  pattern: Pattern;
  initialPatternIndex: number;
};

export function getNextRegExpIndex({
  pattern,
  initialPatternIndex,
}: GetNextRegExpIndexArgs): number {
  let nextRegExpIndex = -1;

  for (
    let patternIndex = initialPatternIndex;
    patternIndex < pattern.length;
    patternIndex++
  ) {
    const currentPattern = pattern[patternIndex] as string | RegExp;

    if (currentPattern instanceof RegExp) {
      nextRegExpIndex = patternIndex;
      break;
    }
  }

  return nextRegExpIndex;
}

export type GetPrevRegExpIndexArgs = {
  pattern: Pattern;
  initialPatternIndex: number;
};

export function getPrevRegExpIndex({
  pattern,
  initialPatternIndex,
}: GetPrevRegExpIndexArgs): number {
  let prevRegExpIndex = -1;

  for (
    let patternIndex = initialPatternIndex;
    patternIndex >= 0;
    patternIndex--
  ) {
    const currentPattern = pattern[patternIndex];

    if (!currentPattern) {
      continue;
    }

    if (currentPattern instanceof RegExp) {
      prevRegExpIndex = patternIndex;
      break;
    }
  }

  return prevRegExpIndex;
}
