// "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=1,2,6323"
const parserhtml = (str) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, "application/xml");
    const nodes = doc.querySelectorAll("DocumentSummary")
    const results = []
    if (nodes) {
        for (const node of nodes) {
            const uid = node.getAttribute("uid")?.trim()
            const name = node.querySelector("Name")?.textContent?.trim()
            const summary = node.querySelector("Summary")?.textContent?.trim() || null
            results.push(`${uid}\t${name}\t${summary}\n`)
        }
    }
    return results
}

const response = async (ids) => {
    const uri = `/entrez/eutils/esummary.fcgi?db=gene&id=${ids}`
    try {
        const resp = await fetch(uri, {
            method: "GET",
            mode: "same-origin",
            credentials: 'same-origin',
        })
        if (resp.status < 200 || resp.status >= 300) {
            throw "error fetch"
        }
        const data = await resp.text()
        const arr = parserhtml(data)
        if (arr.length < 1) {
            throw "error fetch"
        }
        return arr
    } catch (err) {
        throw err
    }
}

const download = (data) => {
    alert("执行结束，点击确定，进行文件下载");
    // data为blob格式
    const blob = new Blob(data, {
        type: "text/plain",
        endings: "native"
    });
    const node = document.createElement('a');
    const href = window.URL.createObjectURL(blob);
    node.href = href;
    node.download = "summarys.tsv";
    document.body.appendChild(node);
    node.click();
    document.body.removeChild(node);
    window.URL.revokeObjectURL(href);
}
const run = async (ids, summarys) => {
    const retry = []
    const n = 500
    const loop = Math.ceil(ids.length / n)
    for (let i = 0; i < loop; i++) {
        const start = i * n
        const symbols = ids.slice(start, start + n)
        const [result, err] = await response(symbols.join(",")).then(arr => [arr, null]).catch(err => [null, err])
        if (err != null) {
            retry.push(...symbols)
        } else {
            summarys.push(...result)
        }
        symbols.length = 0
    }
    //FetchErr，重新运行
    if (retry.length) {
        run(retry, summarys)
    } else {
        download(summarys)
    }
}


const summarys = ["Entrez\tSymbol\tSummary\n"]
const ids = [1, 2, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 47, 48, 49, 50, 51]
run(ids, summarys)
