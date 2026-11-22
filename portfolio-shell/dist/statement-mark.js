let sequence=0;
export function markedKeyword(text){
 const id=++sequence;
 return `<em class="statement-keyword">${text}<svg class="statement-underline statement-marker" viewBox="0 0 320 28" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><filter id="marker-${id}" x="-5%" y="-40%" width="110%" height="180%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".08 .7" numOctaves="2" seed="4" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .24 0 0 0 .78" result="ink"/><feComposite in="SourceGraphic" in2="ink" operator="in" result="stroke"/><feDisplacementMap in="stroke" in2="noise" scale=".6" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#marker-${id})"><path class="marker-line" pathLength="1" d="M 4 16 C 85 13 195 17 316 14"/></g></svg></em>`;
}
