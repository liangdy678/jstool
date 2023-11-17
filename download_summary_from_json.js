// "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&retmode=json&id=1,2,6323"
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

const parserjson = (obj) => {
    const results = []
    const uids = obj?.result?.uids
    if (uids?.length <= 0) {
        return results
    }
    const genes = obj.result
    for (const uid of uids) {
        const gene = genes[uid]
        const symbol = gene.name
        const description = gene.description
        const summary = gene?.summary || "null"
        results.push(`${uid}\t${symbol}\t${description}\t${summary}\n`)
    }

    return results
}

const response = async (ids) => {
    const uri = `/entrez/eutils/esummary.fcgi?db=gene&retmode=json&id=${ids}`
    try {
        const resp = await fetch(uri, {
            method: "GET",
            mode: "same-origin",
            credentials: 'same-origin',
        })
        if (resp.status < 200 || resp.status >= 300) {
            throw "error fetch"
        }
        const data = await resp.json()
        const arr = parserjson(data)
        if (arr.length < 1) {
            throw "error fetch"
        }
        return arr
    } catch (err) {
        throw err
    }
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
const summarys = ["Entrez\tSymbol\tDescription\tSummary\n"]
const ids = [1, 2, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60]
run(ids, summarys)
