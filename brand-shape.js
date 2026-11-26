// Single geometric master for the flat mark, intro and extruded model.
export const brandShape = {
  width: 688, height: 676,
  blue: '#2d63ed', silver: '#d9dee6',
  commands: [
    ['M',156,36], ['L',418,36], ['C',440,36,454,50,454,72],
    ['L',454,188], ['C',454,210,440,224,418,224],
    ['L',276,224], ['C',234,224,210,248,210,284],
    ['L',210,486], ['C',210,508,202,521,180,521],
    ['L',96,521], ['C',60,521,36,497,36,461],
    ['L',36,156], ['C',36,90,90,36,156,36], ['Z']
  ]
};
