// 请求函数
//host: https://my.qiagendigitalinsights.com/
const request = async (body) => {
  const url = "/bbp/view/hgmd/pro/all.php";
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
      credentials: "same-origin",
    });
    const blob = await resp.blob();
    return [blob, null];
  } catch (err) {
    return [null, err];
  }
};

// 保存到文件
const save_to_file = async (params, file) => {
  const [blob, err] = await request(params);

  if (blob) {
    // 创建Blob对象URL
    const url = URL.createObjectURL(blob);

    // 保存文件
    const a = document.createElement("a");
    a.href = url;
    a.download = file; // 自定义文件名
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 释放内存
    URL.revokeObjectURL(url);
  }
  return err;
};

// 下载基因变异
const download_gene_mutations = async (gene) => {
  const params = `gene=${gene}&sorted=location&database=Get+all+mutations`;
  const file = `${gene}.mutaiton.html`;
  const err = await save_to_file(params, file);
  return err;
};

// 下载基因总结
const download_gene_summary = async (gene) => {
  const params = `gene=${gene}&sorted=location&database=Gene+summary`;
  const file = `${gene}.summary.html`;
  const err = await save_to_file(params, file);
  return err;
};

// 重试函数
const retry = async (fn, args, max_retry = 3) => {
  let err = null;
  for (let i = 0; i < max_retry; i++) {
    err = await fn(args);
    if (err) {
      continue;
    }
    break;
  }
  return err;
};

// 通用函数
const run_common = async (fn, symbols) => {
  const start = performance.now();
  const faileds = [];

  for (const symbol of symbols) {
    const err = await retry(fn, symbol, 3);
    if (err) {
      faileds.push(symbol);
    }
  }

  const end = performance.now();
  console.log(`耗时：${Math.ceil((end - start) / 1000)}秒。`);

  return faileds;
};

const run_mutations = async (symbols) => {
  const arr = await run_common(download_gene_mutations, symbols);
  if (arr.length) {
    console.log(arr);
  } else {
    console.log("works all done!");
  }
};

const run_summary = async (symbols) => {
  const arr = await run_common(download_gene_summary, symbols);
  if (arr.length) {
    console.log(arr);
  } else {
    console.log("works all done!");
  }
};

function main(symbols) {
  if (symbols?.length <= 0) {
    return;
  }
  run_mutations(symbols);
  run_summary(symbols);
}

/******************执行段******************/
// 待下载基因列表,每天累计最多900个！,每月累计最多9000个！，不然会封ip

// grep -vxF -f file1 file2  file2中不存在于file1中的行

const symbols = ["PITX1-AS1"];

main(symbols);
