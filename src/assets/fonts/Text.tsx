import React from 'react';

interface TextProps {
  children: React.ReactNode;
  font?: 'gloria' | 'nanum' | 'patrick';
  size?: string;
}

export default function Text({ children, font = 'patrick', size = '16px' }: TextProps) {
  
  const fontStyles = {
    gloria: 'gloria-hallelujah-regular', //Sub
    nanum: 'nanum-pen-script-regular', //default text for users
    patrick: 'patrick-hand-regular' //Main
  };

  const selectedFontClass = fontStyles[font];

  return (
    <div className={selectedFontClass} style={{ fontSize: size }}>
      {children}
    </div>
  );
}