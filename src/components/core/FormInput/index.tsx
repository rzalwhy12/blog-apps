"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface IFormInput {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  // Make onChange more specific to handle input and textarea change events
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>; // More specific ref type
  value?: string;
  defaultValue?: string;
  id?: string; // <--- ADD THIS LINE FOR THE ID PROP
}

const FormInput: React.FC<IFormInput> = ({
  type,
  name,
  label,
  placeholder,
  onChange,
  ref,
  value,
  defaultValue,
  id, // <--- DESTRUCTURE THE ID PROP HERE
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Determine the actual ID to use for the input and label's htmlFor
  // Prioritize the 'id' prop passed, otherwise fallback to 'name'
  const inputElementId = id || name;

  if (type === "password") {
    let icon;
    let activeType;
    if (isVisible) {
      icon = <FaRegEye style={{ margin: "auto" }} />;
      activeType = "text";
    } else {
      icon = <FaRegEyeSlash style={{ margin: "auto" }} />;
      activeType = "password";
    }
    return (
      <div className="flex flex-col gap-2">
        {label && <label htmlFor={inputElementId} className="font-medium">{label}</label>}
        <div className="relative">
          <input
            id={inputElementId} // Use the resolved ID here
            name={name}
            ref={ref as React.Ref<HTMLInputElement>} // Cast ref for specific input type
            type={activeType}
            placeholder={placeholder}
            className="w-full border border-gray-100 px-3 py-2 rounded-md shadow"
            onChange={onChange}
            // For password fields, 'value' and 'defaultValue' are often managed by the parent
            // If you intend for FormInput to be controlled in this case, pass them down.
            // However, typically password inputs are uncontrolled or have their own state if the component is self-contained.
            // Given your current usage in PostPage with refs, these might not be directly used here for password.
            value={value}
            defaultValue={defaultValue}
          />
          <Button
            type="button"
            className="absolute right-1 top-1 w-12 p-1 rounded-md border"
            onClick={() => setIsVisible(!isVisible)}
          >
            {icon}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      {label && <label htmlFor={inputElementId} className="font-medium">{label}</label>}
      <input
        id={inputElementId} // Use the resolved ID here
        name={name}
        type={type}
        ref={ref as React.Ref<HTMLInputElement>} // Cast ref for specific input type
        placeholder={placeholder}
        className="w-full border border-gray-100 px-3 py-2 rounded-md shadow"
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default FormInput;