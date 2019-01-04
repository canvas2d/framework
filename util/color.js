const cache = {
    black: [0, 0, 0],
    silver: [0.75, 0.75, 0.75],
    gray: [0.5, 0.5, 0.5],
    white: [1, 1, 1],
    maroon: [0.5, 0, 0],
    red: [1, 0, 0],
    purple: [0.5, 0, 0.5],
    fuchsia: [1, 0, 1],
    green: [0, 0.5, 0],
    lime: [0, 1, 0],
    olive: [0.5, 0.5, 0],
    yellow: [1, 1, 0],
    navy: [0, 0, 0.5],
    blue: [0, 0, 1],
    teal: [0, 0.5, 0.5],
    aqua: [0, 1, 1]
}

function toRGBA(color) {
    let rgba
    switch (color[0].toLowerCase()) {
        case '#':
            if (color.length == 4) {
                color = color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
            } else {
                color = color.slice(1)
            }
            let number = ('0x' + color) | 0
            const b = number % 256
            number -= b
            number = number >> 8
            const g = number % 256
            number -= g
            number = number >> 8
            const r = number

            rgba = [r / 255, g / 255, b / 255, 1]
            break
        case 'r':
            rgba = color.slice(color.indexOf('(') + 1, color.indexOf(')')).split(',').map(number => parseFloat(number))
            for (let i = 0; i < 3; i++) {
                rgba[i] = rgba[i] / 255
            }
            break
        case 'h':
            console.log('hsl not support')
            break
    }
    cache[color] = rgba
    return rgba
}
export default {
    get(color) {
        return cache[color] || toRGBA(color)
    }
}