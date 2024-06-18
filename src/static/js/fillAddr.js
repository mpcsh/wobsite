let addrFilled = false;

function fillAddr(addrEncoded) {
	if (addrFilled) {
		return;
	}

	const prefix = atob(atob("YldGcGJIUnZPZz09"));
	const addr = atob(atob(addrEncoded));
	const domain = atob(atob("UUcxd1l5NXphQT09"));
	const anchor = document.getElementById("addr");
	anchor.href = `${prefix}${addr}${domain}`;
	anchor.innerText = `${addr}${domain}`;
	addrFilled = true;
}
