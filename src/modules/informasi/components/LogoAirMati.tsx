import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const LogoAirMati = (props: SvgProps) => (
  <Svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <Rect width={48} height={48} rx={24} fill="#262626" />
    <Path
      d="M21.4999 33V30L17.9999 26.5V21C17.9999 20.6 18.0916 20.225 18.2749 19.875C18.4582 19.525 18.7249 19.2584 19.0749 19.075L20.9999 21H19.9999V25.65L23.4999 29.15V31H24.4999V29.15L25.4249 28.225L13.3999 16.2L14.7999 14.8L33.1999 33.2L31.7999 34.6L26.8499 29.65L26.4999 30V33H21.4999ZM29.1499 26.3L27.9999 25.15V21H23.8499L19.9999 17.15V15H21.9999V19H25.9999V15H27.9999V20L26.9999 19H27.9999C28.5499 19 29.0209 19.196 29.4129 19.588C29.8049 19.98 30.0006 20.4507 29.9999 21V25.45L29.1499 26.3Z"
      fill="#FAFAFA"
    />
  </Svg>
);

export default LogoAirMati;
