import React from "react";

const TextInput = React.forwardRef(
  (
    {
      type,
      placeholder,
      styles,
      label,
      labelStyles,
      register,
      name,
      error,
      value,
      onChange,
      iconRight,
      iconLeft,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full flex-col flex mt-2">
        {label && (
          <p className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</p>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-3 text-ascent-1 flex items-center">
              {iconLeft}
            </span>
          )}
          <input
            onChange={onChange}
            value={value}
            type={type}
            placeholder={placeholder}
            name={name}
            ref={ref}
            {...rest}
            className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-2.5 placeholder:text-[#666] 
              ${iconLeft ? "pl-10" : ""} 
              ${iconRight ? "pr-10" : ""} 
              ${styles}`}
            {...register}
            aria-invalid={error ? "true" : "false"}
          />
          {iconRight && (
            <span className="absolute right-3 text-ascent-1 flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

export default TextInput;
