import React from 'react';
import Svg, {Rect, Circle, G} from 'react-native-svg';

const CharacterSvg = ({width = 50, height = 75}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 50 75">
      <G>
        {/* Legs */}
        <Rect x="12" y="58" width="7" height="15" fill="#5A677D" />
        <Rect x="31" y="58" width="7" height="15" fill="#5A677D" />

        {/* Body */}
        <Rect x="8" y="22" width="34" height="36" rx="4" fill="#788AAE" />
        <Circle cx="25" cy="40" r="8" fill="#42A5F5" />

        {/* Arms */}
        <Rect x="2" y="28" width="8" height="18" rx="4" fill="#5A677D" />
        <Rect x="40" y="28" width="8" height="18" rx="4" fill="#5A677D" />

        {/* Head */}
        <Rect x="10" y="2" width="30" height="22" rx="7" fill="#5A677D" />

        {/* Eyes */}
        <G>
          <Circle cx="18" cy="13" r="3" fill="#FFFFFF" />
          <Circle cx="32" cy="13" r="3" fill="#FFFFFF" />
        </G>

        {/* Antenna */}
        <Rect x="23" y="0" width="4" height="4" fill="#455A64" />
        <Circle cx="25" cy="2" r="2.2" fill="#FF7043" />
      </G>
    </Svg>
  );
};

export default CharacterSvg;
