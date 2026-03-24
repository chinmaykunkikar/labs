import { SVGProps } from "react";

const RefreshIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.9603 10.7353C16.7316 12.8842 15.514 14.898 13.4992 16.0612C10.1518 17.9938 5.8715 16.8469 3.93887 13.4995L3.73303 13.143M3.0397 9.26471C3.26844 7.11579 4.48603 5.10205 6.50082 3.93881C9.84823 2.00618 14.1285 3.15309 16.0612 6.5005L16.267 6.85704M2.99609 14.9946L3.59884 12.7451L5.84834 13.3479M14.1522 6.65215L16.4017 7.2549L17.0044 5.0054"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RefreshIcon;
