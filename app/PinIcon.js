import React from "react";
import Svg, { G, Path } from "react-native-svg";
import {View} from "react-native";

export default function PinIcon({ size = 24, color = "currentColor", className = "" }) {
    return (
        <View>
            <Svg
                xmlns="http://www.w3.org/2000/svg"
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
                <Path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
                <Path d="M9 15l-4.5 4.5" />
                <Path d="M14.5 4l5.5 5.5" />
            </Svg>
        </View>
    );
};