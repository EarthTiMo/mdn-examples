const COLOR = [
    {LIGHT: '#fff',    MEDIUM: '#aaa',    DARK: '#888',    FADE: '#444'},    // White
    {LIGHT: '#f6685e', MEDIUM: '#f44335', DARK: '#aa2e25', FADE: '#801313'}, // I: Red
    {LIGHT: '#ffac33', MEDIUM: '#ff9800', DARK: '#b26a00', FADE: '#a13800'}, // T: Orange
    {LIGHT: '#6573c3', MEDIUM: '#3f51b5', DARK: '#2c387e', FADE: '#121858'}, // O: Indigo
    {LIGHT: '#ffef62', MEDIUM: '#ffeb3b', DARK: '#b2a429', FADE: '#ab5810'}, // J: Yellow
    {LIGHT: '#ed4b82', MEDIUM: '#e91e63', DARK: '#a31545', FADE: '#5f0937'}, // L: Pink
    {LIGHT: '#6fbf73', MEDIUM: '#4caf50', DARK: '#357a38', FADE: '#124116'}, // S: Green
    {LIGHT: '#4dabf5', MEDIUM: '#2196f3', DARK: '#1769aa', FADE: '#093170'}  // Z: Blue
];

let canvas = document.getElementById('cvs-arkanoid');
let ctx = canvas.getContext('2d');
let width, height;   // 窗口的尺寸
let rem;             // 相对单位，等于单个方块的宽度
let layout;          // detail | regular | slim