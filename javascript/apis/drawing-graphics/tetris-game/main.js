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
        [ [1], [1], [1], [1] ],
        [ [1,1,1,1] ]
    ],
    [
        [ [1,1,1], [0,1,0] ],
        [ [0,1], [1,1], [0,1] ],
        [ [0,1,0], [1,1,1] ],
        [ [1,0], [1,1], [1,0] ]
    ],
    [
        [ [1,1], [1,1] ]
    ],
    [
        [ [0,1], [0,1], [1,1] ],
        [ [1,0,0], [1,1,1] ],
        [ [1,1], [1,0], [1,0] ],
        [ [1,1,1], [0,0,1] ]
    ],
    [
        [ [1,0], [1,0], [1,1] ],
        [ [1,1,1], [1,0,0] ],
        [ [1,1], [0,1], [0,1] ],
        [ [0,0,1], [1,1,1] ]
    ],
    [
        [ [0,1,1], [1,1,0] ],
        [ [1,0], [1,1], [0,1] ]
    ],
    [
        [ [1,1,0], [0,1,1] ],
        [ [0,1], [1,1], [1,0] ]
    ]
];

let canvas = document.getElementById('cvs-tetris');
let ctx = canvas.getContext('2d');
let width, height;   // 窗口的尺寸
let rem;             // 相对单位，等于单个方块的宽度
let layout;          // detail | regular | slim
let score = 0, lines = 0, level = 0;
let blockCount = [0, 0, 0, 0, 0, 0, 0, 0];
let gamePanel = [];
let curCol = 3, curRow = 0;
let current, next = newBlock();

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
    else {
        layout = 'slim';
        rem = height / 20;
        if ( width < rem*10 )
            rem = width / 10;
    }
}

function setBackground() {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

function setGameBox() {
    let X, Y = rem;
    if (layout === 'detail')
        X = width/2 - rem*13;
    else if (layout === 'regular')
        X = width/2 - rem*7.5;
    else if (layout === 'slim') {
        X = width / 2 - rem * 5;
        Y = height / 2 - rem*10;
    }

    ctx.save();
    ctx.fillStyle = COLOR[level].FADE;
    ctx.fillRect(X - 1, Y - 1, rem*10 + 1, rem*20 + 1);

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if (gamePanel[i][j] === 2) {
                ctx.fillStyle = COLOR[level].MEDIUM;
                ctx.fillRect(X + rem*j,  Y + rem*i, rem, rem);
            }
        }
    }

    drawBlock(current.number, current.sequence, 1,
              X + rem*curCol + 1, Y + rem*curRow + 1);

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
        Y = height/2 - rem*9.4;

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
        ctx.fillText('方块统计', statX + rem*1.5, rem*3.8);

        drawBlock(1, 0, .5, statX + rem*.55,  blockY);
        drawBlock(2, 1, .5, statX + rem*1.45,  blockY);
        drawBlock(3, 0, .5, statX + rem*2.85,  blockY);
        drawBlock(4, 0, .5, statX + rem*4.25,  blockY);
        drawBlock(5, 0, .5, statX + rem*5.65,  blockY);
        drawBlock(6, 1, .5, statX + rem*7.05,  blockY);
        drawBlock(7, 1, .5, statX + rem*8.45,  blockY);

        ctx.restore();
    }
}


function drawBlock(number, sequence, size, x, y) {
    ctx.save();
    ctx.fillStyle = COLOR[number].MEDIUM;
    for (let i = 0; i < BLOCKS[number][sequence].length; i++) {
        for (let j = 0; j < BLOCKS[number][sequence][0].length; j++) {
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
    next = newBlock();
    for (let i = 0; i < BLOCKS[current.number][current.sequence].length; i++) {
        for (let j = 0; j < BLOCKS[current.number][current.sequence][0].length; j++) {
            if (BLOCKS[current.number][current.sequence][i][j] === 1) {
                gamePanel[i][j+3] = 1;
            }
        }
    }
    blockCount[0]++;
    blockCount[current.number]++;
}

function moveBlockLeft() {
    if (current.X > 0) {
        current.X--;
    }
}

function moveBlockRight() {
}

function downBlock() {
}


function newBlock() {
    let n = rand(1, 7),
        s = rand(0, 3) % BLOCKS[n].length;
    return {
        number: n,
        sequence: s
    };
}

function fit(block, row, col) {
    if ( row < 0 || row + BLOCKS[block.number][block.sequence].length > 20 ||
         col < 0 || col + BLOCKS[block.number][block.sequence][0].length > 10 )
        return false;
    for (let i = row; i < row + BLOCKS[block.number][block.sequence].length; i++)
        for (let j = col; j < col + BLOCKS[block.number][block.sequence][0].length; j++) {
            if (BLOCKS[i][j] === 1 && gamePanel[i][j] === 2)
                return false;
        }
    return true;
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

