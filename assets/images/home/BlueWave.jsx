import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props) => (
    <Svg
        width={314}
        height={116}
        viewBox="0 0 314 116"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <Path
            d="M116.511 12.7536C59.5656 32.3108 15.1098 20.9024 0 12.7536V71H314V12.7536C303.494 15.2809 275.942 18.8191 249.783 12.7536C217.085 5.17161 187.692 -11.6929 116.511 12.7536Z"
            fill="url(#paint0_linear_7100_489)"
        />
        <Path
            d="M115.492 29.6003C53.9905 3.48564 12.8718 18.7192 0 29.6003V85.5396H314V18.0241C299.396 16.5621 261.923 16.8306 228.857 29.6003C188.943 44.6996 148.439 42.7582 115.492 29.6003Z"
            fill="url(#paint1_linear_7100_489)"
        />
        <Path
            d="M116.511 50.724C59.5656 62.5685 15.1098 55.6592 0 50.724V86H314V50.724C303.494 52.2546 275.942 54.3975 249.783 50.724C217.085 46.1321 187.692 35.9184 116.511 50.724Z"
            fill="#306BA6"
        />
        <Path
            d="M0 86H314V92C314 105.255 303.255 116 290 116H24C10.7452 116 0 105.255 0 92V86Z"
            fill="#306BA6"
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_7100_489"
                x1={157}
                y1={0}
                x2={157}
                y2={71}
                gradientUnits="userSpaceOnUse">
                <Stop stopColor="#C2DFFF" />
                <Stop offset={1} stopColor="#8FC4FF" />
            </LinearGradient>
            <LinearGradient
                id="paint1_linear_7100_489"
                x1={157}
                y1={15.181}
                x2={157}
                y2={85.5396}
                gradientUnits="userSpaceOnUse">
                <Stop stopColor="#8FC4FF" />
                <Stop offset={1} stopColor="#5CAAFF" />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default SVGComponent;
