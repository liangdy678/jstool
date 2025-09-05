// 保存文件
const save2file = (url, fileName) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName; // 自定义文件名
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 重试函数
const retry = async (fn, args, max_retry = 3) => {
  let err = null;
  for (let i = 0; i < max_retry; i++) {
    err = await fn(args);
    if (err) {
      continue;
    }
    // 成功,则跳出循环
    break;
  }
  return err;
};

// 请求函数
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
    const url = URL.createObjectURL(blob);
    save2file(url, file); //使用a标签方法 + blob url
    URL.revokeObjectURL(url); // 释放内存
  }
  return err;
};

// 下载基因变异
const download_gene_mutations = async (gene) => {
  const body = `gene=${gene}&sorted=location&database=Get+all+mutations`;
  const file = `${gene}.html`;
  const err = await save_to_file(body, file);
  return err;
};

// 下载基因总结
const download_gene_summary = async (gene) => {
  const body = `gene=${gene}&sorted=location&database=Gene+summary`;
  const file = `${gene}.html`;
  const err = await save_to_file(body, file);
  return err;
};

const run_summary = async (symbols) => {
  const start = performance.now();

  const faileds = [];
  for (const symbol of symbols) {
    const err = await retry(download_gene_summary, symbol, 3);
    if (err) {
      faileds.push(symbol);
    }
  }
  const end = performance.now();

  console.log(
    `下载${symbols.length}个基因总结耗时${Math.ceil((end - start) / 1000)}秒。`
  );

  return faileds;
};

const run_mutations = async (symbols) => {
  const start = performance.now();

  const faileds = [];

  for (const symbol of symbols) {
    const err = await retry(download_gene_mutations, symbol, 3);
    if (err) {
      faileds.push(symbol);
    }
  }

  const end = performance.now();
  console.log(
    `下载${symbols.length}个基因总结耗时${Math.ceil((end - start) / 1000)}秒。`
  );

  return faileds;
};

/******************执行段******************/

const symbols = [];

run_mutations(symbols).then((arr) => {
  if (arr.length) {
    console.log(arr);
  } else {
    console.log("works all done!");
  }
});

run_summary(symbols).then((arr) => {
  if (arr.length) {
    console.log(arr);
  } else {
    console.log("works all done!");
  }
});
