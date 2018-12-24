function requestAnimFrame() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(fn) {
            return window.setTimeout(fn, 16.67)
        }
}

function cancelAnimFrame() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFram ||
        function(timeout) {
            window.clearTimeout(timeout)
        }
}

export const requestAnimationFrame = requestAnimFrame()
export const cancelAnimationFrame = cancelAnimFrame()