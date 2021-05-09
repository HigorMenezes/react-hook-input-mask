import {
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  ChangeEventHandler,
} from "react";

import { useInputRefSetup } from "./useInputRefSetup";
import { useRefresh } from "./useRefresh";
import {
  removeMask,
  applyMask,
  getNextRegExpIndex,
  getPrevRegExpIndex,
} from "./utils";

import { Pattern, DeleteKey } from "./types";

export type InputMaskChangeEvent = {
  inputValue: string;
  unmaskedValue: string;
  partialMaskedValue: string;
  maskedValue: string;
};
export type InputMaskChangeHandler = (
  maskEvent: InputMaskChangeEvent,
  inputEvent: ChangeEvent<HTMLInputElement>,
) => void;

export type UseInputMakProps = {
  value: string;
  onChange: InputMaskChangeHandler;
  inputRef: HTMLInputElement | null;
  pattern: Pattern;
  maskChar?: string;
};

export type UseInputMaskReturn = {
  partialMaskedValue: string;
  maskedValue: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export function useInputMask({
  value,
  onChange,
  inputRef,
  pattern,
  maskChar = "_",
}: UseInputMakProps): UseInputMaskReturn {
  useInputRefSetup({ inputRef });
  const [refreshCursorPosition, refreshCursorPositionHandler] = useRefresh();

  const cursorPositionRef = useRef<number>(0);
  const inputValueRef = useRef(value);
  const unmaskedValueRef = useRef(
    removeMask({
      value,
      pattern,
    }),
  );
  const partialMaskedValueRef = useRef(
    applyMask({
      value: unmaskedValueRef.current,
      pattern,
      maskChar,
      partial: true,
    }),
  );
  const maskedValueRef = useRef(
    applyMask({
      value: unmaskedValueRef.current,
      pattern,
      maskChar,
    }),
  );
  const deleteKeyRef = useRef<DeleteKey | null>(null);

  // keydown event listener
  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case DeleteKey.BACKSPACE:
          deleteKeyRef.current = DeleteKey.BACKSPACE;
          break;
        case DeleteKey.DELETE:
          deleteKeyRef.current = DeleteKey.DELETE;
          break;
        default:
          deleteKeyRef.current = null;
      }
    };

    inputRef?.addEventListener("keydown", keydownHandler);

    return () => inputRef?.removeEventListener("keydown", keydownHandler);
  }, [inputRef]);

  const cursorPositionHandler = useCallback(() => {
    const currentCursorPosition = cursorPositionRef.current;
    let newCursorPosition = currentCursorPosition;

    if (deleteKeyRef.current === DeleteKey.BACKSPACE) {
      const patternItemFromCursor = pattern[currentCursorPosition - 1];
      const isCursorAtStringIndex = typeof patternItemFromCursor === "string";

      if (isCursorAtStringIndex) {
        const prevRegExpIndex = getPrevRegExpIndex({
          pattern,
          initialPatternIndex: currentCursorPosition - 1,
        });
        newCursorPosition = prevRegExpIndex + 1;
      }
    } else if (deleteKeyRef.current === DeleteKey.DELETE) {
      const patternItemFromCursor = pattern[currentCursorPosition];
      const isCursorAtStringIndex = typeof patternItemFromCursor === "string";

      if (isCursorAtStringIndex) {
        const nextRegExpIndex = getNextRegExpIndex({
          pattern,
          initialPatternIndex: currentCursorPosition,
        });
        newCursorPosition = nextRegExpIndex;
      }
    } else {
      const patternItemFromCursor = pattern[currentCursorPosition - 1];
      const isCursorAtStringIndex = typeof patternItemFromCursor === "string";

      if (isCursorAtStringIndex) {
        const nextRegExpIndex = getNextRegExpIndex({
          pattern,
          initialPatternIndex: currentCursorPosition - 1,
        });
        newCursorPosition = nextRegExpIndex + 1;
      }
    }

    newCursorPosition = Math.min(
      newCursorPosition,
      partialMaskedValueRef.current.length,
    );

    inputRef?.setSelectionRange(newCursorPosition, newCursorPosition);
  }, [inputRef, pattern]);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (inputEvent) => {
      const inputValue = inputEvent.target.value;
      const currentCursorPosition =
        inputEvent.currentTarget.selectionStart ?? 0;

      const unmaskedValue = removeMask({
        value: inputValue,
        pattern,
      });
      const partialMaskedValue = applyMask({
        value: unmaskedValue,
        pattern,
        maskChar,
        partial: true,
      });
      const maskedValue = applyMask({
        value: unmaskedValue,
        pattern,
        maskChar,
      });

      onChange(
        {
          inputValue,
          unmaskedValue,
          partialMaskedValue,
          maskedValue,
        },
        inputEvent,
      );

      unmaskedValueRef.current = unmaskedValue;
      partialMaskedValueRef.current = partialMaskedValue;
      maskedValueRef.current = maskedValue;
      cursorPositionRef.current = currentCursorPosition;
      refreshCursorPositionHandler();
    },
    [onChange, pattern, maskChar, refreshCursorPositionHandler],
  );

  useEffect(() => {
    inputValueRef.current = value;
  }, [value]);

  useEffect(() => {
    cursorPositionHandler();
  }, [cursorPositionHandler, refreshCursorPosition]);

  return {
    partialMaskedValue: partialMaskedValueRef.current,
    maskedValue: maskedValueRef.current,
    onChange: onChangeHandler,
  };
}
