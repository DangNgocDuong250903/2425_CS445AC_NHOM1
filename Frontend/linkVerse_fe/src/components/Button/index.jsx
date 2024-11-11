const Button = ({
  title,
  containerStyles,
  iconRight,
  type,
  onClick,
  disable,
  ...rests
}) => {
  return (
    <button
      {...rests}
      disabled={disable}
      onClick={onClick}
      type={type || "button"}
      className={`inline-flex items-center text-base ${containerStyles} ${
        disable && "cursor-not-allowed opacity-[0.3]"
      }`}
    >
      {title}

      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default Button;
