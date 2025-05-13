import React from "react";
import Svg, { G, Path } from "react-native-svg";
import {View} from "react-native";

export default function CrownIcon({ size = 24, color = "currentColor", className = "" }) {
    return (
        <Svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            className={className}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
        </Svg>
    );
};