import { useEffect, useRef, useState } from "react";
import { HStack } from "../ui/hstack";
import { cn } from "@/lib/helpers";
import { Input, InputField } from "../ui/input";

export function CodeInput({
  className,
  value,
  onChange,
}: {
  className?: string;
  value: string;
  onChange: (text: string) => void;
}) {
  const input0 = useRef(null);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);

  const inputs = [input0, input1, input2, input3];

  const [code, setCode] = useState([
    value[0] ?? "",
    value[1] ?? "",
    value[2] ?? "",
    value[3] ?? "",
  ]);

  useEffect(() => {
    setCode([value[0] ?? "", value[1] ?? "", value[2] ?? "", value[3] ?? ""]);
  }, [value]);

  useEffect(() => {
    onChange(code.join(""));
  }, [code]);

  function focusEmptyInputFov(index: number) {
    const input = inputs[Math.min(index + 1, inputs.length - 1)].current;
    //@ts-ignore
    input?.focus();
  }

  function focusInputBack(index: number) {
    const input = inputs[Math.max(index - 1, 0)].current;
    //@ts-ignore
    input?.focus();
  }

  //TODO causes flickering because of preventDefault not working in onKeyPress
  const onKeyPress = (slot: number) =>
    function onKeyPressHandle(e: any) {
      e.preventDefault();
      e.stopPropagation();

      if (e.nativeEvent.key === "Backspace") {
        setCode((prev) => {
          const newCode = [...prev];
          newCode[slot] = "";
          return newCode;
        });
        focusInputBack(slot);

        // else if key is a integer number
      } else if (e.nativeEvent.key >= 0 && e.nativeEvent.key <= 9) {
        setCode((prev) => {
          const newCode = [...prev];

          newCode[slot] = e.nativeEvent.key;
          return newCode;
        });
        focusEmptyInputFov(slot);
      }
    };

  const pasteCode = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const text = e.nativeEvent.text as string;

    //delete all non integer numbers from text
    text.replace(/[^0-9]/g, "");
    if (text.length === 4) {
      const newCode = [];
      for (let i = 0; i < 4; i++) {
        if (text[i] >= "0" && text[i] <= "9") {
          newCode.push(text[i]);
        } else {
          newCode.push("");
        }
      }
      //@ts-ignore
      inputs[3]?.current?.focus();
      setCode(newCode);
    }
  };

  return (
    <HStack className={cn("justify-around gap-4 px-4", className)}>
      <Input className="h-16 w-10 grow">
        <InputField
          ref={input0}
          className="text-center text-3xl"
          keyboardType="numeric"
          onKeyPress={onKeyPress(0)}
          onChange={pasteCode}
          maxLength={4}
          value={code[0]}
          //   onSelectionChange={pasteCode}
        />
      </Input>
      <Input className="h-16 w-10 grow">
        <InputField
          ref={input1}
          className="text-center text-3xl"
          keyboardType="numeric"
          onKeyPress={onKeyPress(1)}
          onChange={pasteCode}
          maxLength={4}
          value={code[1]}
        />
      </Input>
      <Input className="h-16 w-10 grow">
        <InputField
          ref={input2}
          className="text-center text-3xl"
          keyboardType="numeric"
          onKeyPress={onKeyPress(2)}
          onChange={pasteCode}
          maxLength={4}
          value={code[2]}
        />
      </Input>
      <Input className="h-16 w-10 grow">
        <InputField
          ref={input3}
          className="text-center text-3xl"
          keyboardType="numeric"
          onKeyPress={onKeyPress(3)}
          onChange={pasteCode}
          maxLength={4}
          value={code[3]}
        />
      </Input>
    </HStack>
  );
}
