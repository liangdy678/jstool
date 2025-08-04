const run = (title, n) => {
    const tables = document.querySelectorAll("table")
    const table = tables[2]
    const rows = table.querySelectorAll("tr")
    const results = []
    results.push(title)
    for (const [k, row] of rows.entries()) {
        if (k <= 1) {
            continue
        }
        const tds = row.querySelectorAll("td")
        const vals = []
        for (let i = 1; i < n; i++) {
            const td = tds.item(i)
            const text = td.textContent
            vals.push(text)
        }
        const td = tds.item(n)
        let refs = td.querySelectorAll("a").length
        const span = td.lastChild
        const text = span.textContent
        if (text.includes("more reference(s)...")) {
            const fields = text.split(" ")
            const v = fields[0] - 0
            refs += v
        }
        vals.push(refs)
        results.push(vals.join("\t"))
    }
    console.log(results)

}

11

const missense = () => {
    const title = "codon\tacid\tnucleic\tprotein\tvcf\tclass\tphenotype\trefs"
    const n = 8
    run(title, n)
}


const splice = () => {
    const title = "splice\tnucleic\tvcf\tclass\tphenotype\trefs"
    const n = 6
    run(title, n)
}

const regulatory = () => {
    const title = "sequence\tnucleic\tvcf\tclass\tphenotype\trefs"
    const n = 6
    run(title, n)
}



const deletion = () => {
    const title = "deletion\tnucleic\tprotein\tvcf\tclass\tphenotype\trefs"
    const n = 7
    run(title, n)
}

const insertion = () => {
    const title = "insertion\tnucleic\tprotein\tvcf\tclass\tphenotype\trefs"
    const n = 7
    run(title, n)
}
const indels = () => {
    const title = "indels\tnucleic\tprotein\tvcf\tclass\tphenotype\trefs"
    const n = 7
    run(title, n)
}


const grossdel = () => {
    const title = "level\tdescription\tnucleic\tprotein\tvcf\tclass\tphenotype\trefs"
    const n = 8
    run(title, n)
}

const grossins = () => {
    const title = "level\tinset/dup\tdescription\tclass\tphenotype\trefs"
    const n = 6
    run(title, n)
}

const complex = () => {
    const title = "description\tclass\tphenotype\trefs"
    const n = 4
    run(title, n)
}
