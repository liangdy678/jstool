NCBI：
根据EntrezId下载Gene Summary，为了避免cookie字段，导致拒绝访问，必须要在NCBI页面的控制台（F12）下运行

HGMD：
根据提供的symbol，下载hgmd界面（处理后可实现本地hgmd），使用浏览器自带的fetch函数，无须配置cookie
注：每天最多可下载1800次，每月至多20000次，否则会封ip
