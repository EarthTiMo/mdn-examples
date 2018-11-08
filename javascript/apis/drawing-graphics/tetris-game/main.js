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

const BLOCKS = [ [],
    [
        [ [0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0] ],
        [ [0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0] ]
    ],
    [
        [ [0,0,0], [1,1,1], [0,1,0] ],
        [ [0,1,0], [1,1,0], [0,1,0] ],
        [ [0,1,0], [1,1,1], [0,0,0] ],
        [ [0,1,0], [1,1,1], [0,0,0] ]
    ],
    [
        [ [1,1], [1,1] ]
    ],
    [
        [ [0,1,0], [0,1,0], [1,1,0] ],
        [ [1,0,0], [1,1,1], [0,0,0] ],
        [ [0,1,1], [0,1,0], [0,1,0] ],
        [ [0,0,0], [1,1,1], [0,0,1] ]
    ],
    [
        [ [0,1,0], [0,1,0], [0,1,1] ],
        [ [0,0,0], [1,1,1], [1,0,0] ],
        [ [1,1,0], [0,1,0], [0,1,0] ],
        [ [0,0,1], [1,1,1], [0,0,0] ]
    ],
    [
        [ [0,1,1], [1,1,0], [0,0,0] ],
        [ [0,1,0], [0,1,1], [0,0,1] ]
    ],
    [
        [ [1,1,0], [0,1,1], [0,0,0] ],
        [ [0,0,1], [0,1,1], [0,1,0] ]
    ]
];

let canvas = document.getElementById('cvs-tetris');
let ctx = canvas.getContext('2d');
let width, height;   // 窗口的尺寸
let rem;             // 相对单位，等于单个方块的宽度
let layout;          // detail | regular | slim | mobile
let score = 0, lines = 0, level = 0;
let blockCount = [0, 0, 0, 0, 0, 0, 0, 0];
let gamePanel = [];
let current, next = nextBlock();
let curX, curY;

initGamePanel();
pushBlock();
setLayout();
window.onresize = setLayout;

function setSizeEnv() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    rem = height / 22;

    if (width >= rem*28)
        layout = 'detail';
    else if ( width < rem*28 && width >= rem*17 )
        layout = 'regular';
    else if ( width < rem*17 && width >= rem*12 )
        layout = 'slim';
    else { // width < rem*12
        rem = width / 12;
        layout = 'mobile';
    }
}

function setBackground() {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

function setGameBox() {
    let X = rem;
    if (layout === 'detail')
        X = width/2 - rem*13;
    else if (layout === 'regular')
        X = width/2 - rem*7.5;
    else if (layout === 'slim')
        X = width/2 - rem*5;

    ctx.save();
    ctx.fillStyle = COLOR[level].FADE;
    ctx.fillRect(X - 1, rem - 1, rem*10 + 1, rem*20 + 1);

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if (gamePanel[i][j] === 2) {
                ctx.fillStyle = COLOR[level].MEDIUM;
                ctx.fillRect(X + rem*j,  rem*(i+1), rem, rem);
            }
        }
    }

    drawBlock(current.number, current.sequence, 1, X + rem*curX + 1, rem + rem*curY + 1);

    ctx.restore();
}


function setInfoBox() {
    let X = width/2 + rem*3.5,
        Y = rem*4;
    if (layout === 'detail')
        X = width/2 - rem*2;

    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(X, Y, rem*4, rem*15);
    ctx.fillStyle = COLOR[level].FADE;
    ctx.fillRect(X, Y + rem*6.5, rem*4, rem);
    ctx.fillRect(X, Y + rem*9.5, rem*4, rem);
    ctx.fillRect(X, Y + rem*12.5, rem*4, rem);

    ctx.fillStyle = COLOR[level].LIGHT;
    ctx.font = rem + 'px 微软雅黑';
    ctx.fillText('下一方块', X, Y);
    ctx.fillText('当前关卡', X, Y + rem*6);
    ctx.fillText('已消层数', X, Y + rem*9);
    ctx.fillText('当前得分', X, Y + rem*12);

    ctx.font = rem + 'px Consolas';
    let numberX = (number) => X + rem * .08 + rem * .55 * (7 - String(number).length);
    ctx.fillText(level, numberX(level), Y + rem * 7.3);
    ctx.fillText(lines, numberX(lines), Y + rem * 10.3);
    ctx.fillText(score, numberX(score), Y + rem * 13.3);

    drawBlock(next.number, next.sequence, 1, X, Y + rem*.5);
    ctx.restore();
}

function setSlimInfo() {
    let rightX = width/2 + rem*2.8,
        Y = rem*1.6;

    ctx.save();
    ctx.fillStyle = COLOR[level].LIGHT;
    ctx.font = rem*.5 + 'px consolas';
    ctx.fillText(lines, width/2 - rem*4.8, Y);

    ctx.font = rem*.5 + 'px 微软雅黑';
    ctx.fillText('下一方块', rightX, Y);

    drawBlock(next.number, next.sequence, .5, rightX, Y + rem*.2);
    ctx.restore();
}

function setStatBox() {
    ctx.save();
    if (layout === 'detail') {
        let statX = width/2 + rem*3,
            blockY = height - rem*4;
        ctx.save();
        ctx.fillStyle = COLOR[level].FADE;
        ctx.fillRect(statX - 1, rem - 1, rem*10 + 1, rem*20 + 1);

        ctx.fillStyle = '#000';
        ctx.font = rem*2 + 'px 微软雅黑';
        ctx.fillText('方块统计', statX + rem*1.8, rem*3.8);

        drawBlock(1, 0, .5, statX - rem*.2,  blockY);
        drawBlock(2, 1, .5, statX + rem*1.3,  blockY);
        drawBlock(3, 0, .5, statX + rem*2.8,  blockY);
        drawBlock(4, 0, .5, statX + rem*4.3,  blockY);
        drawBlock(5, 0, .5, statX + rem*5.3,  blockY);
        drawBlock(6, 1, .5, statX + rem*6.8,  blockY);
        drawBlock(7, 1, .5, statX + rem*8.3,  blockY);

        ctx.restore();
    }
}


function drawBlock(number, sequence, size, x, y) {
    let dim = BLOCKS[number][0].length;
    ctx.save();
    ctx.fillStyle = COLOR[number].MEDIUM;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (BLOCKS[number][sequence][i][j] === 1) {
                ctx.fillRect(x + j*rem*size-1, y + i*rem*size-1, rem*size+1, rem*size+1);
            }
        }
    }
    ctx.restore();
}

function game() {

}

function initGamePanel() {
    for (let i = 0; i < 20; i++) {
        let current = [];
        for (let j = 0; j < 10; j++) {
            current.push(0);
        }
        gamePanel.push(current);
    }
}

function pushBlock() {
    current = next;
    curX = 3;
    curY =
        BLOCKS[current.number][current.sequence][0].reduce((acc, cur) => acc + cur) === 0 ? -1 : 0;
    next = nextBlock();
    let dim = BLOCKS[current.number][0].length;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (BLOCKS[current.number][current.sequence][i][j] === 1) {
                gamePanel[i][j+3] = 1;
            }
        }
    }
    blockCount[0]++;
    blockCount[current.number]++;
}


function nextBlock() {
    let n = rand(1, 7),
        s = rand(0, 3) % BLOCKS[n].length;
    return {
        number: n,
        sequence: s
    };
}

function rand(from, to) {
    return Math.floor(Math.random() * to) + from;
}

function setLayout() {
    setSizeEnv();
    setBackground();
    setGameBox();
    if (layout === 'detail' || layout === 'regular')
        setInfoBox();
    else
        setSlimInfo();
    setStatBox();

}

