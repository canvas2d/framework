function get(url) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText)
            }
        }
        xhr.open("GET", url, true)
        // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
        xhr.send()
    })
}

function post(url, data) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText))
            }
        }
        xhr.open("POST", url, true)
        // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
        xhr.send(JSON.stringify(data))
    })
}
export default {
    get,
    post
}