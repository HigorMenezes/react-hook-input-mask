import React, { FC, useState, useCallback, useMemo, useRef } from "react";

import { useInputMask, InputMaskChangeHandler } from "../../src";

export const CustomInput: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeHandler: InputMaskChangeHandler = useCallback(
    ({ unmaskedValue, partialMaskedValue, maskedValue }) => {
      setInputValue(unmaskedValue);
    },
    [],
  );

  const pattern = useMemo(
    () => [/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
    [],
  );

  const inputMask = useInputMask({
    value: inputValue,
    onChange: onChangeHandler,
    inputRef: inputRef.current,
    pattern,
  });

  return (
    <input
      ref={inputRef}
      style={{ width: "400px" }}
      value={inputMask.maskedValue}
      onChange={inputMask.onChange}
    />
  );
};
